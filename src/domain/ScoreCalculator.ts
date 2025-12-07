import type { Hand, WinCondition, GameSettings, Tile } from '../types';
import { CalculationError, logError } from '../types/errors';
import { validateHand, validateCalculationResult } from '../utils/validation';

/**
 * 麻雀の点数計算を行うクラス
 * 日本麻雀の標準ルールに基づいて符・飜数・点数を計算する
 * 
 * ルール設定:
 * - redDora: 赤ドラの有無（赤5を飜数に加算するか）
 * - kuitan: 喰いタンの有無（鳴いた状態でタンヤオを認めるか）
 * - atozuke: 後付けの有無（鳴いた後に役を確定させることを認めるか）
 * 
 * 注意: atozuke設定は、問題生成時の手牌が既に完成形であるため、
 * 現在の実装では直接的な影響を与えません。実際のゲームでは、
 * 鳴いた時点で役が確定しているかを追跡する必要があります。
 * 
 * パフォーマンス最適化:
 * - 点数計算結果のキャッシング
 * - 頻繁に使用される計算の最適化
 */
export class ScoreCalculator {
  private settings: GameSettings;
  private scoreCache: Map<string, number>;

  constructor(settings: GameSettings) {
    this.settings = settings;
    this.scoreCache = new Map();
  }

  /**
   * 符を計算する
   * @param hand 手牌
   * @param winCondition 和了条件
   * @returns 符の値
   * @throws CalculationError 計算エラーが発生した場合
   */
  calculateFu(hand: Hand, winCondition: WinCondition): number {
    try {
      // 手牌の妥当性を検証
      validateHand(hand);
      
      // 七対子は固定で25符
      if (this.isChiitoitsu(hand)) {
        return 25;
      }

      // 平和ツモは固定で20符
      if (this.isPinfu(hand) && winCondition.winType === 'tsumo') {
        return 20;
      }

      let fu = 20; // 基本符

      // ツモ符（平和以外）
      if (winCondition.winType === 'tsumo' && !this.isPinfu(hand)) {
        fu += 2;
      }

      // 門前ロン符
      if (winCondition.winType === 'ron' && hand.melds.length === 0) {
        fu += 10;
      }

      // 面子の符を計算
      fu += this.calculateMeldFu(hand);

      // 雀頭の符を計算
      fu += this.calculatePairFu(hand, winCondition);

      // 待ちの符を計算
      fu += this.calculateWaitFu(hand);

      // 符は10符単位で切り上げ
      const result = Math.ceil(fu / 10) * 10;
      
      // 計算結果の妥当性を検証
      validateCalculationResult(result, 20, 110, '符');
      
      return result;
    } catch (error) {
      logError(error, 'ScoreCalculator.calculateFu');
      throw new CalculationError('符の計算でエラーが発生しました', error);
    }
  }

  /**
   * 飜数を計算する
   * @param hand 手牌
   * @param winCondition 和了条件
   * @returns 飜数
   * @throws CalculationError 計算エラーが発生した場合
   */
  calculateHan(hand: Hand, winCondition: WinCondition): number {
    try {
      // 手牌の妥当性を検証
      validateHand(hand);
      
      let han = 0;

      // 役満チェック
      const yakumanHan = this.calculateYakumanHan(hand, winCondition);
      if (yakumanHan > 0) {
        return yakumanHan;
      }

    // 立直（門前のみ）
    if (hand.melds.length === 0) {
      // 立直は実装上、手牌データに含まれると仮定
      // 実際の実装では別途フラグが必要
    }

    // 門前清自摸和
    if (winCondition.winType === 'tsumo' && hand.melds.length === 0) {
      han += 1;
    }

    // 平和
    if (this.isPinfu(hand)) {
      han += 1;
    }

    // 断么九（タンヤオ）
    if (this.isTanyao(hand)) {
      // 喰いタン設定をチェック
      if (this.settings.kuitan || hand.melds.length === 0) {
        han += 1;
      }
    }

    // 一盃口
    if (this.isIipeikou(hand) && hand.melds.length === 0) {
      han += 1;
    }

    // 三色同順
    const shikisanshoku = this.isShikisanshoku(hand);
    if (shikisanshoku) {
      han += hand.melds.length === 0 ? 2 : 1;
    }

    // 一気通貫
    const ikkitsukan = this.isIkkitsukan(hand);
    if (ikkitsukan) {
      han += hand.melds.length === 0 ? 2 : 1;
    }

    // 対々和
    if (this.isToitoi(hand)) {
      han += 2;
    }

    // 三暗刻
    if (this.countAnko(hand) === 3) {
      han += 2;
    }

    // 三槓子
    if (this.countKan(hand) === 3) {
      han += 2;
    }

    // 七対子
    if (this.isChiitoitsu(hand)) {
      han += 2;
    }

    // 混全帯么九
    if (this.isChanta(hand)) {
      han += hand.melds.length === 0 ? 2 : 1;
    }

    // 混老頭
    if (this.isHonroutou(hand)) {
      han += 2;
    }

    // 小三元
    if (this.isShousangen(hand)) {
      han += 2;
    }

    // 混一色
    if (this.isHonitsu(hand)) {
      han += hand.melds.length === 0 ? 3 : 2;
    }

    // 清一色
    if (this.isChinitsu(hand)) {
      han += hand.melds.length === 0 ? 6 : 5;
    }

    // 役牌（三元牌）
    han += this.calculateYakuhaiHan(hand, winCondition);

    // ドラ
    han += this.calculateDoraHan(hand);

    // 赤ドラ
    if (this.settings.redDora) {
      han += this.calculateRedDoraHan(hand);
    }

      // 計算結果の妥当性を検証
      // 注意: 役満の場合は13飜を超えることがあるため、最大値は緩く設定
      validateCalculationResult(han, 0, 100, '飜数');
      
      return han;
    } catch (error) {
      logError(error, 'ScoreCalculator.calculateHan');
      throw new CalculationError('飜数の計算でエラーが発生しました', error);
    }
  }

  /**
   * 点数を計算する
   * @param fu 符
   * @param han 飜数
   * @param isDealer 親かどうか
   * @param winType ツモかロンか
   * @returns 点数
   * @throws CalculationError 計算エラーが発生した場合
   * 
   * パフォーマンス最適化:
   * - 計算結果をキャッシュして再計算を回避
   * - 早期リターンで不要な計算を削減
   */
  calculateScore(fu: number, han: number, isDealer: boolean, winType: WinType): number {
    try {
      // 入力値の妥当性を検証
      validateCalculationResult(fu, 20, 110, '符');
      validateCalculationResult(han, 1, 100, '飜数');
      
      // キャッシュキーを生成
      const cacheKey = `${fu}-${han}-${isDealer}-${winType}`;
      
      // キャッシュから取得
      const cached = this.scoreCache.get(cacheKey);
      if (cached !== undefined) {
        return cached;
      }

      let score: number;

    // 役満以上（早期リターン）
    if (han >= 13) {
      const baseScore = isDealer ? 48000 : 32000;
      const yakumanMultiplier = Math.floor(han / 13);
      score = baseScore * yakumanMultiplier;
      this.scoreCache.set(cacheKey, score);
      return score;
    }

    // 数え役満（11-12飜）
    if (han >= 11) {
      score = isDealer ? 48000 : 32000;
      this.scoreCache.set(cacheKey, score);
      return score;
    }

    // 三倍満（10飜）
    if (han >= 10) {
      score = isDealer ? 36000 : 24000;
      this.scoreCache.set(cacheKey, score);
      return score;
    }

    // 倍満（8-9飜）
    if (han >= 8) {
      score = isDealer ? 24000 : 16000;
      this.scoreCache.set(cacheKey, score);
      return score;
    }

    // 跳満（6-7飜）
    if (han >= 6) {
      score = isDealer ? 18000 : 12000;
      this.scoreCache.set(cacheKey, score);
      return score;
    }

    // 満貫（5飜、または4飜40符以上、3飜70符以上）
    if (han >= 5 || (han === 4 && fu >= 40) || (han === 3 && fu >= 70)) {
      score = isDealer ? 12000 : 8000;
      this.scoreCache.set(cacheKey, score);
      return score;
    }

    // 通常計算
    const basePoints = fu * Math.pow(2, 2 + han);
    
    if (isDealer) {
      // 親の場合
      if (winType === 'tsumo') {
        // 子が支払う額（3人分）
        const perPlayer = Math.ceil(basePoints * 2 / 100) * 100;
        score = perPlayer * 3;
      } else {
        // ロンの場合
        score = Math.ceil(basePoints * 6 / 100) * 100;
      }
    } else {
      // 子の場合
      if (winType === 'tsumo') {
        // 親が支払う額 + 子が支払う額（2人分）
        const fromDealer = Math.ceil(basePoints * 2 / 100) * 100;
        const fromChild = Math.ceil(basePoints / 100) * 100;
        score = fromDealer + fromChild * 2;
      } else {
        // ロンの場合
        score = Math.ceil(basePoints * 4 / 100) * 100;
      }
    }

      // 計算結果の妥当性を検証
      validateCalculationResult(score, 1000, 192000, '点数');
      
      // キャッシュに保存
      this.scoreCache.set(cacheKey, score);
      return score;
    } catch (error) {
      logError(error, 'ScoreCalculator.calculateScore');
      throw new CalculationError('点数の計算でエラーが発生しました', error);
    }
  }

  // ===== 役判定のヘルパーメソッド =====

  /**
   * 七対子かどうか
   */
  private isChiitoitsu(hand: Hand): boolean {
    if (hand.melds.length > 0) return false;
    
    const allTiles = [...hand.closedTiles, hand.winningTile];
    if (allTiles.length !== 14) return false;

    const pairs = new Map<string, number>();
    for (const tile of allTiles) {
      const key = this.tileToString(tile);
      pairs.set(key, (pairs.get(key) || 0) + 1);
    }

    return pairs.size === 7 && Array.from(pairs.values()).every(count => count === 2);
  }

  /**
   * 平和かどうか
   */
  private isPinfu(hand: Hand): boolean {
    // 門前のみ
    if (hand.melds.length > 0) return false;
    
    // 両面待ちであること
    // 雀頭が役牌でないこと
    // すべての面子が順子であること
    // 簡易実装: 詳細な判定は省略
    return false; // TODO: 実装
  }

  /**
   * 断么九（タンヤオ）かどうか
   */
  private isTanyao(hand: Hand): boolean {
    const allTiles = [...hand.closedTiles, hand.winningTile];
    for (const meld of hand.melds) {
      allTiles.push(...meld.tiles);
    }

    return allTiles.every(tile => {
      if (tile.type === 'honor') return false;
      if (tile.value === 1 || tile.value === 9) return false;
      return true;
    });
  }

  /**
   * 一盃口かどうか
   */
  private isIipeikou(hand: Hand): boolean {
    // 簡易実装
    return false; // TODO: 実装
  }

  /**
   * 三色同順かどうか
   */
  private isShikisanshoku(hand: Hand): boolean {
    // 簡易実装
    return false; // TODO: 実装
  }

  /**
   * 一気通貫かどうか
   */
  private isIkkitsukan(hand: Hand): boolean {
    // 簡易実装
    return false; // TODO: 実装
  }

  /**
   * 対々和かどうか
   */
  private isToitoi(hand: Hand): boolean {
    // すべての面子が刻子であること
    const allMelds = [...hand.melds];
    // closedTilesからも刻子を抽出する必要がある
    // 簡易実装
    return false; // TODO: 実装
  }

  /**
   * 暗刻の数を数える
   */
  private countAnko(hand: Hand): number {
    let count = 0;
    for (const meld of hand.melds) {
      if (meld.type === 'ankan') {
        count++;
      }
    }
    // closedTilesからも暗刻を抽出する必要がある
    return count;
  }

  /**
   * 槓子の数を数える
   */
  private countKan(hand: Hand): number {
    return hand.melds.filter(m => m.type === 'kan' || m.type === 'ankan').length;
  }

  /**
   * 混全帯么九かどうか
   */
  private isChanta(hand: Hand): boolean {
    // 簡易実装
    return false; // TODO: 実装
  }

  /**
   * 混老頭かどうか
   */
  private isHonroutou(hand: Hand): boolean {
    const allTiles = [...hand.closedTiles, hand.winningTile];
    for (const meld of hand.melds) {
      allTiles.push(...meld.tiles);
    }

    return allTiles.every(tile => {
      if (tile.type === 'honor') return true;
      if (tile.value === 1 || tile.value === 9) return true;
      return false;
    });
  }

  /**
   * 小三元かどうか
   */
  private isShousangen(hand: Hand): boolean {
    // 簡易実装
    return false; // TODO: 実装
  }

  /**
   * 混一色かどうか
   */
  private isHonitsu(hand: Hand): boolean {
    const allTiles = [...hand.closedTiles, hand.winningTile];
    for (const meld of hand.melds) {
      allTiles.push(...meld.tiles);
    }

    const types = new Set(allTiles.map(t => t.type));
    
    // 字牌を含み、数牌は1種類のみ
    if (!types.has('honor')) return false;
    
    const numberTypes = Array.from(types).filter(t => t !== 'honor');
    return numberTypes.length === 1;
  }

  /**
   * 清一色かどうか
   */
  private isChinitsu(hand: Hand): boolean {
    const allTiles = [...hand.closedTiles, hand.winningTile];
    for (const meld of hand.melds) {
      allTiles.push(...meld.tiles);
    }

    const types = new Set(allTiles.map(t => t.type));
    
    // 数牌のみで1種類
    return types.size === 1 && !types.has('honor');
  }

  /**
   * 役牌の飜数を計算
   */
  private calculateYakuhaiHan(hand: Hand, winCondition: WinCondition): number {
    let han = 0;
    
    // 三元牌の刻子をチェック
    const dragons: HonorType[] = ['white', 'green', 'red'];
    for (const dragon of dragons) {
      if (this.hasKotsu(hand, { type: 'honor', honor: dragon })) {
        han += 1;
      }
    }

    // 場風牌
    if (this.hasKotsu(hand, { type: 'honor', honor: winCondition.prevalentWind })) {
      han += 1;
    }

    // 自風牌
    if (this.hasKotsu(hand, { type: 'honor', honor: winCondition.seatWind })) {
      han += 1;
    }

    return han;
  }

  /**
   * 指定した牌の刻子を持っているか
   */
  private hasKotsu(hand: Hand, tile: Tile): boolean {
    // 簡易実装
    for (const meld of hand.melds) {
      if (meld.type === 'pon' || meld.type === 'kan' || meld.type === 'ankan') {
        if (meld.tiles.length > 0 && this.tilesEqual(meld.tiles[0], tile)) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * ドラの飜数を計算
   */
  private calculateDoraHan(hand: Hand): number {
    let count = 0;
    const allTiles = [...hand.closedTiles, hand.winningTile];
    for (const meld of hand.melds) {
      allTiles.push(...meld.tiles);
    }

    for (const tile of allTiles) {
      for (const dora of hand.dora) {
        if (this.tilesEqual(tile, dora)) {
          count++;
        }
      }
    }

    return count;
  }

  /**
   * 赤ドラの飜数を計算
   */
  private calculateRedDoraHan(hand: Hand): number {
    let count = 0;
    const allTiles = [...hand.closedTiles, hand.winningTile];
    for (const meld of hand.melds) {
      allTiles.push(...meld.tiles);
    }

    for (const tile of allTiles) {
      if (tile.isRed) {
        count++;
      }
    }

    return count;
  }

  /**
   * 役満の飜数を計算
   */
  private calculateYakumanHan(hand: Hand, winCondition: WinCondition): number {
    // 国士無双
    if (this.isKokushi(hand)) {
      return 13;
    }

    // 四暗刻
    if (this.countAnko(hand) === 4) {
      return 13;
    }

    // 大三元
    if (this.isDaisangen(hand)) {
      return 13;
    }

    // 字一色
    if (this.isTsuuiisou(hand)) {
      return 13;
    }

    // 緑一色
    if (this.isRyuuiisou(hand)) {
      return 13;
    }

    // 清老頭
    if (this.isChinroutou(hand)) {
      return 13;
    }

    // 四槓子
    if (this.countKan(hand) === 4) {
      return 13;
    }

    // 九蓮宝燈
    if (this.isChuuren(hand)) {
      return 13;
    }

    // 天和・地和は実装上判定できないため省略

    return 0;
  }

  /**
   * 国士無双かどうか
   */
  private isKokushi(hand: Hand): boolean {
    // 簡易実装
    return false; // TODO: 実装
  }

  /**
   * 大三元かどうか
   */
  private isDaisangen(hand: Hand): boolean {
    const dragons: HonorType[] = ['white', 'green', 'red'];
    return dragons.every(dragon => 
      this.hasKotsu(hand, { type: 'honor', honor: dragon })
    );
  }

  /**
   * 字一色かどうか
   */
  private isTsuuiisou(hand: Hand): boolean {
    const allTiles = [...hand.closedTiles, hand.winningTile];
    for (const meld of hand.melds) {
      allTiles.push(...meld.tiles);
    }

    return allTiles.every(tile => tile.type === 'honor');
  }

  /**
   * 緑一色かどうか
   */
  private isRyuuiisou(hand: Hand): boolean {
    // 簡易実装
    return false; // TODO: 実装
  }

  /**
   * 清老頭かどうか
   */
  private isChinroutou(hand: Hand): boolean {
    const allTiles = [...hand.closedTiles, hand.winningTile];
    for (const meld of hand.melds) {
      allTiles.push(...meld.tiles);
    }

    return allTiles.every(tile => {
      if (tile.type === 'honor') return false;
      return tile.value === 1 || tile.value === 9;
    });
  }

  /**
   * 九蓮宝燈かどうか
   */
  private isChuuren(hand: Hand): boolean {
    // 簡易実装
    return false; // TODO: 実装
  }

  // ===== 符計算のヘルパーメソッド =====

  /**
   * 面子の符を計算
   */
  private calculateMeldFu(hand: Hand): number {
    let fu = 0;

    for (const meld of hand.melds) {
      if (meld.type === 'chi') {
        // 順子は0符
        continue;
      }

      const tile = meld.tiles[0];
      const isYaochu = this.isYaochuTile(tile);
      
      if (meld.type === 'pon') {
        // 明刻
        fu += isYaochu ? 4 : 2;
      } else if (meld.type === 'kan') {
        // 明槓
        fu += isYaochu ? 16 : 8;
      } else if (meld.type === 'ankan') {
        // 暗槓
        fu += isYaochu ? 32 : 16;
      }
    }

    // closedTilesからの暗刻も計算する必要がある（簡易実装では省略）

    return fu;
  }

  /**
   * 雀頭の符を計算
   */
  private calculatePairFu(hand: Hand, winCondition: WinCondition): number {
    // 簡易実装: 雀頭の判定は複雑なため省略
    return 0; // TODO: 実装
  }

  /**
   * 待ちの符を計算
   */
  private calculateWaitFu(hand: Hand): number {
    // 簡易実装: 待ちの判定は複雑なため省略
    // 単騎待ち、嵌張待ち、辺張待ちは2符
    return 0; // TODO: 実装
  }

  /**
   * 么九牌かどうか
   */
  private isYaochuTile(tile: Tile): boolean {
    if (tile.type === 'honor') return true;
    return tile.value === 1 || tile.value === 9;
  }

  // ===== ユーティリティメソッド =====

  /**
   * 牌を文字列に変換
   */
  private tileToString(tile: Tile): string {
    if (tile.type === 'honor') {
      return `${tile.type}-${tile.honor}`;
    }
    return `${tile.type}-${tile.value}${tile.isRed ? '-red' : ''}`;
  }

  /**
   * 2つの牌が等しいか
   */
  private tilesEqual(tile1: Tile, tile2: Tile): boolean {
    if (tile1.type !== tile2.type) return false;
    if (tile1.type === 'honor') {
      return tile1.honor === tile2.honor;
    }
    return tile1.value === tile2.value;
  }
}

type WinType = 'tsumo' | 'ron';
type HonorType = 'east' | 'south' | 'west' | 'north' | 'white' | 'green' | 'red';
