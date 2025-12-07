import type { Hand, Answer, Tile, Meld } from '../types';

/**
 * 符の内訳項目
 */
export interface FuBreakdownItem {
  source: string;        // 例: "門前ロン", "中ポン"
  fu: number;
  description: string;
}

/**
 * 役の項目
 */
export interface YakuItem {
  name: string;
  han: number;
  description: string;
}

/**
 * 解説データ
 */
export interface Explanation {
  fuBreakdown: FuBreakdownItem[];
  yaku: YakuItem[];
  totalFu: number;
  totalHan: number;
  finalScore: number;
  calculationSteps: string[];
}

/**
 * 問題の解説を生成
 * @param hand 手牌
 * @param answer 正解の回答
 * @returns 解説データ
 */
export function generateExplanation(
  hand: Hand,
  answer: Answer
): Explanation {
  // 符の内訳を計算
  const fuBreakdown = calculateFuBreakdown(hand);
  
  // 役を判定
  const yaku = identifyYaku(hand);
  
  // 計算過程を生成
  const calculationSteps = generateCalculationSteps(fuBreakdown, yaku, answer);
  
  return {
    fuBreakdown,
    yaku,
    totalFu: answer.fu,
    totalHan: answer.han,
    finalScore: answer.score,
    calculationSteps,
  };
}

/**
 * 符の内訳を計算
 */
function calculateFuBreakdown(hand: Hand): FuBreakdownItem[] {
  const breakdown: FuBreakdownItem[] = [];
  
  // 基本符
  breakdown.push({
    source: '基本符',
    fu: 20,
    description: 'すべての和了に付く基本の符',
  });
  
  // ツモ符
  if (hand.winType === 'tsumo') {
    breakdown.push({
      source: 'ツモ',
      fu: 2,
      description: 'ツモ和了による符',
    });
  }
  
  // 門前ロン符
  if (hand.winType === 'ron' && hand.melds.length === 0) {
    breakdown.push({
      source: '門前ロン',
      fu: 10,
      description: '門前でロン和了した場合の符',
    });
  }
  
  // 面子の符を計算
  for (const meld of hand.melds) {
    const meldFu = calculateMeldFu(meld);
    if (meldFu.fu > 0) {
      breakdown.push(meldFu);
    }
  }
  
  return breakdown;
}

/**
 * 面子の符を計算
 */
function calculateMeldFu(meld: Meld): FuBreakdownItem {
  if (meld.type === 'chi') {
    return {
      source: 'チー',
      fu: 0,
      description: '順子は符が付かない',
    };
  }
  
  const tile = meld.tiles[0];
  const isYaochu = isYaochuTile(tile);
  const tileName = getTileName(tile);
  
  if (meld.type === 'pon') {
    const fu = isYaochu ? 4 : 2;
    return {
      source: `${tileName}ポン`,
      fu,
      description: `明刻（${isYaochu ? '么九牌' : '中張牌'}）`,
    };
  }
  
  if (meld.type === 'kan') {
    const fu = isYaochu ? 16 : 8;
    return {
      source: `${tileName}明槓`,
      fu,
      description: `明槓（${isYaochu ? '么九牌' : '中張牌'}）`,
    };
  }
  
  if (meld.type === 'ankan') {
    const fu = isYaochu ? 32 : 16;
    return {
      source: `${tileName}暗槓`,
      fu,
      description: `暗槓（${isYaochu ? '么九牌' : '中張牌'}）`,
    };
  }
  
  return {
    source: '不明',
    fu: 0,
    description: '',
  };
}

/**
 * 役を判定
 */
function identifyYaku(hand: Hand): YakuItem[] {
  const yaku: YakuItem[] = [];
  
  // 門前清自摸和
  if (hand.winType === 'tsumo' && hand.melds.length === 0) {
    yaku.push({
      name: '門前清自摸和',
      han: 1,
      description: '門前でツモ和了',
    });
  }
  
  // 断么九（タンヤオ）
  if (isTanyao(hand)) {
    yaku.push({
      name: '断么九',
      han: 1,
      description: '2〜8の数牌のみで構成',
    });
  }
  
  // 役牌（三元牌）
  const yakuhaiList = identifyYakuhai(hand);
  yaku.push(...yakuhaiList);
  
  // 対々和
  if (isToitoi(hand)) {
    yaku.push({
      name: '対々和',
      han: 2,
      description: 'すべての面子が刻子',
    });
  }
  
  // 三暗刻
  const ankoCount = countAnko(hand);
  if (ankoCount === 3) {
    yaku.push({
      name: '三暗刻',
      han: 2,
      description: '暗刻が3つ',
    });
  }
  
  // 混一色
  if (isHonitsu(hand)) {
    const han = hand.melds.length === 0 ? 3 : 2;
    yaku.push({
      name: '混一色',
      han,
      description: '1種類の数牌と字牌のみ',
    });
  }
  
  // 清一色
  if (isChinitsu(hand)) {
    const han = hand.melds.length === 0 ? 6 : 5;
    yaku.push({
      name: '清一色',
      han,
      description: '1種類の数牌のみ',
    });
  }
  
  // ドラ
  const doraCount = countDora(hand);
  if (doraCount > 0) {
    yaku.push({
      name: 'ドラ',
      han: doraCount,
      description: `ドラ${doraCount}枚`,
    });
  }
  
  return yaku;
}

/**
 * 計算過程を生成
 */
function generateCalculationSteps(
  fuBreakdown: FuBreakdownItem[],
  yaku: YakuItem[],
  answer: Answer
): string[] {
  const steps: string[] = [];
  
  // 符の計算
  steps.push('【符の計算】');
  for (const item of fuBreakdown) {
    steps.push(`${item.source}: ${item.fu}符`);
  }
  const totalFu = fuBreakdown.reduce((sum, item) => sum + item.fu, 0);
  const roundedFu = Math.ceil(totalFu / 10) * 10;
  steps.push(`合計: ${totalFu}符 → ${roundedFu}符（10符単位で切り上げ）`);
  steps.push('');
  
  // 役の計算
  steps.push('【役の計算】');
  if (yaku.length === 0) {
    steps.push('役なし');
  } else {
    for (const item of yaku) {
      steps.push(`${item.name}: ${item.han}飜`);
    }
  }
  steps.push(`合計: ${answer.han}飜`);
  steps.push('');
  
  // 点数の計算
  steps.push('【点数の計算】');
  steps.push(`${answer.fu}符${answer.han}飜 = ${answer.score}点`);
  
  return steps;
}

// ===== ヘルパー関数 =====

/**
 * 么九牌かどうか
 */
function isYaochuTile(tile: Tile): boolean {
  if (tile.type === 'honor') return true;
  return tile.value === 1 || tile.value === 9;
}

/**
 * 牌の名前を取得
 */
function getTileName(tile: Tile): string {
  if (tile.type === 'honor') {
    const honorNames: Record<string, string> = {
      east: '東',
      south: '南',
      west: '西',
      north: '北',
      white: '白',
      green: '發',
      red: '中',
    };
    return honorNames[tile.honor || ''] || '不明';
  }
  
  const typeNames: Record<string, string> = {
    man: '萬',
    pin: '筒',
    sou: '索',
  };
  
  return `${tile.value}${typeNames[tile.type] || ''}`;
}

/**
 * 断么九（タンヤオ）かどうか
 */
function isTanyao(hand: Hand): boolean {
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
 * 役牌を判定
 */
function identifyYakuhai(hand: Hand): YakuItem[] {
  const yaku: YakuItem[] = [];
  
  // 三元牌の刻子をチェック
  const dragonNames: Record<string, string> = {
    white: '白',
    green: '發',
    red: '中',
  };
  
  for (const [honor, name] of Object.entries(dragonNames)) {
    if (hasKotsu(hand, { type: 'honor', honor: honor as any })) {
      yaku.push({
        name: `役牌 ${name}`,
        han: 1,
        description: `${name}の刻子`,
      });
    }
  }
  
  // 場風牌
  const windNames: Record<string, string> = {
    east: '東',
    south: '南',
    west: '西',
    north: '北',
  };
  
  if (hasKotsu(hand, { type: 'honor', honor: hand.prevalentWind })) {
    yaku.push({
      name: `役牌 場風${windNames[hand.prevalentWind]}`,
      han: 1,
      description: `場風${windNames[hand.prevalentWind]}の刻子`,
    });
  }
  
  // 自風牌
  if (hasKotsu(hand, { type: 'honor', honor: hand.seatWind })) {
    yaku.push({
      name: `役牌 自風${windNames[hand.seatWind]}`,
      han: 1,
      description: `自風${windNames[hand.seatWind]}の刻子`,
    });
  }
  
  return yaku;
}

/**
 * 指定した牌の刻子を持っているか
 */
function hasKotsu(hand: Hand, tile: Tile): boolean {
  for (const meld of hand.melds) {
    if (meld.type === 'pon' || meld.type === 'kan' || meld.type === 'ankan') {
      if (meld.tiles.length > 0 && tilesEqual(meld.tiles[0], tile)) {
        return true;
      }
    }
  }
  return false;
}

/**
 * 対々和かどうか
 */
function isToitoi(hand: Hand): boolean {
  // すべての面子が刻子（ポン、カン、アンカン）であること
  if (hand.melds.length === 0) return false;
  
  return hand.melds.every(meld => 
    meld.type === 'pon' || meld.type === 'kan' || meld.type === 'ankan'
  );
}

/**
 * 暗刻の数を数える
 */
function countAnko(hand: Hand): number {
  let count = 0;
  for (const meld of hand.melds) {
    if (meld.type === 'ankan') {
      count++;
    }
  }
  return count;
}

/**
 * 混一色かどうか
 */
function isHonitsu(hand: Hand): boolean {
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
function isChinitsu(hand: Hand): boolean {
  const allTiles = [...hand.closedTiles, hand.winningTile];
  for (const meld of hand.melds) {
    allTiles.push(...meld.tiles);
  }

  const types = new Set(allTiles.map(t => t.type));
  
  // 数牌のみで1種類
  return types.size === 1 && !types.has('honor');
}

/**
 * ドラの数を数える
 */
function countDora(hand: Hand): number {
  let count = 0;
  const allTiles = [...hand.closedTiles, hand.winningTile];
  for (const meld of hand.melds) {
    allTiles.push(...meld.tiles);
  }

  for (const tile of allTiles) {
    for (const dora of hand.dora) {
      if (tilesEqual(tile, dora)) {
        count++;
      }
    }
    // 赤ドラもカウント
    if (tile.isRed) {
      count++;
    }
  }

  return count;
}

/**
 * 2つの牌が等しいか
 */
function tilesEqual(tile1: Tile, tile2: Tile): boolean {
  if (tile1.type !== tile2.type) return false;
  if (tile1.type === 'honor') {
    return tile1.honor === tile2.honor;
  }
  return tile1.value === tile2.value;
}
