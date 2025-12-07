import type { Problem, Hand, Tile, GameSettings, Difficulty, WinCondition } from '../types';
import { ScoreCalculator } from '../domain/ScoreCalculator';
import { GenerationError, CalculationError, logError } from '../types/errors';
import { validateProblem } from '../utils/validation';

/**
 * 符の値の定数（パフォーマンス最適化のため事前定義）
 */
const FU_VALUES = [20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 110];

/**
 * 問題生成の最大再試行回数
 */
const MAX_GENERATION_RETRIES = 3;

/**
 * ドラ表示牌の最大枚数
 * 実際の麻雀では、ドラ表示牌は最大5枚（本場表示を除く）
 */
const MAX_DORA_TILES = 5;

/**
 * 問題を生成するクラス
 * ランダムな手牌を生成し、難易度に応じた問題を作成する
 * 
 * パフォーマンス最適化:
 * - 手牌パターンの事前定義
 * - 計算結果のキャッシング
 */
export class ProblemGenerator {
  private calculator: ScoreCalculator;
  private handPatternGenerators: Array<() => Hand>;

  constructor(settings: GameSettings) {
    this.calculator = new ScoreCalculator(settings);
    
    // 手牌生成パターンを事前に配列化（毎回配列を作らない）
    this.handPatternGenerators = [
      () => this.generateTanyaoHand(),
      () => this.generateHonitsuHand(),
      () => this.generateChinitsuHand(),
      () => this.generateToitoiHand(),
      () => this.generateChiitoitsuHand(),
    ];
  }

  /**
   * 問題を生成する
   * @param difficulty 難易度（省略時はランダム）
   * @returns 生成された問題
   * @throws GenerationError 問題生成に失敗した場合
   */
  generate(difficulty?: Difficulty): Problem {
    let lastError: unknown;
    
    // 最大再試行回数まで問題生成を試みる
    for (let attempt = 1; attempt <= MAX_GENERATION_RETRIES; attempt++) {
      try {
        const selectedDifficulty = difficulty || this.selectRandomDifficulty();
        const hand = this.generateHand(selectedDifficulty);
        
        const winCondition: WinCondition = {
          isDealer: hand.isDealer,
          winType: hand.winType,
          prevalentWind: hand.prevalentWind,
          seatWind: hand.seatWind,
        };

        const correctFu = this.calculator.calculateFu(hand, winCondition);
        const correctHan = this.calculator.calculateHan(hand, winCondition);
        const correctScore = this.calculator.calculateScore(correctFu, correctHan, hand.isDealer, hand.winType);

        const problem: Problem = {
          id: this.generateId(),
          hand,
          correctFu,
          correctHan,
          correctScore,
          fuOptions: this.generateOptions(correctFu, 'fu'),
          hanOptions: this.generateOptions(correctHan, 'han'),
          scoreOptions: this.generateOptions(correctScore, 'score'),
          difficulty: selectedDifficulty,
        };
        
        // 生成された問題の妥当性を検証
        validateProblem(problem);
        
        return problem;
      } catch (error) {
        lastError = error;
        logError(error, `ProblemGenerator.generate (試行 ${attempt}/${MAX_GENERATION_RETRIES})`);
        
        // 計算エラーの場合は再試行しない
        if (error instanceof CalculationError) {
          throw error;
        }
        
        // 最後の試行でない場合は続行
        if (attempt < MAX_GENERATION_RETRIES) {
          continue;
        }
      }
    }
    
    // すべての試行が失敗した場合
    throw new GenerationError(
      `問題の生成に${MAX_GENERATION_RETRIES}回失敗しました。アプリケーションを再起動してください。`,
      lastError
    );
  }

  /**
   * ランダムな難易度を選択
   */
  private selectRandomDifficulty(): Difficulty {
    const rand = Math.random();
    if (rand < 0.4) return 'easy';
    if (rand < 0.75) return 'medium';
    return 'hard';
  }

  /**
   * 難易度に応じた手牌を生成
   * 
   * パフォーマンス最適化:
   * - 難易度範囲の事前計算
   * - 不要なオブジェクト生成を削減
   */
  private generateHand(difficulty: Difficulty): Hand {
    // 難易度に応じた飜数の範囲を決定
    let targetHanRange: [number, number];
    switch (difficulty) {
      case 'easy':
        targetHanRange = [1, 3];
        break;
      case 'medium':
        targetHanRange = [4, 6];
        break;
      case 'hard':
        targetHanRange = [7, 13];
        break;
    }

    // 事前定義されたパターンからランダムに選択
    const patternIndex = Math.floor(Math.random() * this.handPatternGenerators.length);
    const hand = this.handPatternGenerators[patternIndex]();

    // 難易度に合わない場合は再生成（簡易実装では1回のみ）
    const winCondition: WinCondition = {
      isDealer: hand.isDealer,
      winType: hand.winType,
      prevalentWind: hand.prevalentWind,
      seatWind: hand.seatWind,
    };
    const han = this.calculator.calculateHan(hand, winCondition);
    
    if (han < targetHanRange[0] || han > targetHanRange[1]) {
      // 難易度が合わない場合は、ドラを調整して飜数を調整
      hand.dora = this.adjustDoraForDifficulty(hand, targetHanRange, winCondition);
    }

    return hand;
  }

  /**
   * タンヤオの手牌を生成
   */
  private generateTanyaoHand(): Hand {
    const tiles: Tile[] = [];
    
    // 3つの順子を生成（2-4, 3-5, 4-6など）
    const types: ('man' | 'pin' | 'sou')[] = ['man', 'pin', 'sou'];
    for (let i = 0; i < 3; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const start = 2 + Math.floor(Math.random() * 5); // 2-6
      tiles.push(
        { type, value: start as any },
        { type, value: (start + 1) as any },
        { type, value: (start + 2) as any }
      );
    }

    // 1つの刻子を生成
    const kotsuType = types[Math.floor(Math.random() * types.length)];
    const kotsuValue = (2 + Math.floor(Math.random() * 6)) as any; // 2-7
    tiles.push(
      { type: kotsuType, value: kotsuValue },
      { type: kotsuType, value: kotsuValue },
      { type: kotsuType, value: kotsuValue }
    );

    // 雀頭を生成
    const pairType = types[Math.floor(Math.random() * types.length)];
    const pairValue = (2 + Math.floor(Math.random() * 6)) as any; // 2-7
    tiles.push(
      { type: pairType, value: pairValue },
      { type: pairType, value: pairValue }
    );

    // 最後の1枚を和了牌として分離
    const winningTile = tiles.pop()!;

    return {
      closedTiles: tiles,
      melds: [],
      winningTile,
      isDealer: Math.random() < 0.25,
      winType: Math.random() < 0.5 ? 'tsumo' : 'ron',
      prevalentWind: 'east',
      seatWind: Math.random() < 0.25 ? 'east' : 'south',
      dora: [],
    };
  }

  /**
   * 混一色の手牌を生成
   */
  private generateHonitsuHand(): Hand {
    const tiles: Tile[] = [];
    const numberType: 'man' | 'pin' | 'sou' = ['man', 'pin', 'sou'][Math.floor(Math.random() * 3)] as any;

    // 数牌の順子を2つ生成
    for (let i = 0; i < 2; i++) {
      const start = 1 + Math.floor(Math.random() * 7);
      tiles.push(
        { type: numberType, value: start as any },
        { type: numberType, value: (start + 1) as any },
        { type: numberType, value: (start + 2) as any }
      );
    }

    // 字牌の刻子を1つ生成
    const honors: ('white' | 'green' | 'red')[] = ['white', 'green', 'red'];
    const honor = honors[Math.floor(Math.random() * honors.length)];
    tiles.push(
      { type: 'honor', honor },
      { type: 'honor', honor },
      { type: 'honor', honor }
    );

    // 数牌の刻子を1つ生成
    const kotsuValue = (1 + Math.floor(Math.random() * 9)) as any;
    tiles.push(
      { type: numberType, value: kotsuValue },
      { type: numberType, value: kotsuValue },
      { type: numberType, value: kotsuValue }
    );

    // 雀頭（字牌）
    const pairHonor: ('east' | 'south' | 'west' | 'north')[] = ['east', 'south', 'west', 'north'];
    const pair = pairHonor[Math.floor(Math.random() * pairHonor.length)];
    tiles.push(
      { type: 'honor', honor: pair },
      { type: 'honor', honor: pair }
    );

    const winningTile = tiles.pop()!;

    return {
      closedTiles: tiles,
      melds: [],
      winningTile,
      isDealer: Math.random() < 0.25,
      winType: Math.random() < 0.5 ? 'tsumo' : 'ron',
      prevalentWind: 'east',
      seatWind: Math.random() < 0.25 ? 'east' : 'south',
      dora: [],
    };
  }

  /**
   * 清一色の手牌を生成
   */
  private generateChinitsuHand(): Hand {
    const tiles: Tile[] = [];
    const type: 'man' | 'pin' | 'sou' = ['man', 'pin', 'sou'][Math.floor(Math.random() * 3)] as any;

    // 4つの面子を生成
    for (let i = 0; i < 4; i++) {
      if (Math.random() < 0.5) {
        // 順子
        const start = 1 + Math.floor(Math.random() * 7);
        tiles.push(
          { type, value: start as any },
          { type, value: (start + 1) as any },
          { type, value: (start + 2) as any }
        );
      } else {
        // 刻子
        const value = (1 + Math.floor(Math.random() * 9)) as any;
        tiles.push(
          { type, value },
          { type, value },
          { type, value }
        );
      }
    }

    // 雀頭
    const pairValue = (1 + Math.floor(Math.random() * 9)) as any;
    tiles.push(
      { type, value: pairValue },
      { type, value: pairValue }
    );

    const winningTile = tiles.pop()!;

    return {
      closedTiles: tiles,
      melds: [],
      winningTile,
      isDealer: Math.random() < 0.25,
      winType: Math.random() < 0.5 ? 'tsumo' : 'ron',
      prevalentWind: 'east',
      seatWind: Math.random() < 0.25 ? 'east' : 'south',
      dora: [],
    };
  }

  /**
   * 対々和の手牌を生成
   */
  private generateToitoiHand(): Hand {
    const tiles: Tile[] = [];
    const types: ('man' | 'pin' | 'sou')[] = ['man', 'pin', 'sou'];

    // 4つの刻子を生成
    for (let i = 0; i < 4; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const value = (1 + Math.floor(Math.random() * 9)) as any;
      tiles.push(
        { type, value },
        { type, value },
        { type, value }
      );
    }

    // 雀頭
    const pairType = types[Math.floor(Math.random() * types.length)];
    const pairValue = (1 + Math.floor(Math.random() * 9)) as any;
    tiles.push(
      { type: pairType, value: pairValue },
      { type: pairType, value: pairValue }
    );

    const winningTile = tiles.pop()!;

    return {
      closedTiles: tiles,
      melds: [],
      winningTile,
      isDealer: Math.random() < 0.25,
      winType: Math.random() < 0.5 ? 'tsumo' : 'ron',
      prevalentWind: 'east',
      seatWind: Math.random() < 0.25 ? 'east' : 'south',
      dora: [],
    };
  }

  /**
   * 七対子の手牌を生成
   */
  private generateChiitoitsuHand(): Hand {
    const tiles: Tile[] = [];
    const types: ('man' | 'pin' | 'sou')[] = ['man', 'pin', 'sou'];

    // 7つの対子を生成
    for (let i = 0; i < 7; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const value = (1 + Math.floor(Math.random() * 9)) as any;
      tiles.push(
        { type, value },
        { type, value }
      );
    }

    const winningTile = tiles.pop()!;

    return {
      closedTiles: tiles,
      melds: [],
      winningTile,
      isDealer: Math.random() < 0.25,
      winType: Math.random() < 0.5 ? 'tsumo' : 'ron',
      prevalentWind: 'east',
      seatWind: Math.random() < 0.25 ? 'east' : 'south',
      dora: [],
    };
  }

  /**
   * 難易度に合わせてドラを調整
   */
  private adjustDoraForDifficulty(
    hand: Hand,
    targetRange: [number, number],
    winCondition: WinCondition
  ): Tile[] {
    const currentHan = this.calculator.calculateHan(hand, winCondition);
    const targetHan = Math.floor((targetRange[0] + targetRange[1]) / 2);
    const diff = targetHan - currentHan;

    if (diff <= 0) {
      return [];
    }

    // 手牌からランダムに牌を選んでドラにする
    const allTiles = [...hand.closedTiles, hand.winningTile];
    const dora: Tile[] = [];
    
    for (let i = 0; i < Math.min(diff, allTiles.length, MAX_DORA_TILES); i++) {
      const randomTile = allTiles[Math.floor(Math.random() * allTiles.length)];
      dora.push(randomTile);
    }

    return dora;
  }

  /**
   * 選択肢を生成する
   * @param correctValue 正解の値
   * @param type 選択肢の種類
   * @returns 選択肢の配列（正解を含む）
   * 
   * パフォーマンス最適化:
   * - 符の値を定数化
   * - 不要な配列操作を削減
   */
  generateOptions(correctValue: number, type: 'fu' | 'han' | 'score'): number[] {
    const options = new Set<number>();
    options.add(correctValue);

    if (type === 'fu') {
      // 符の選択肢: 20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 110（定数化）
      const fuValues = FU_VALUES;
      
      // 正解の前後の値を追加
      const correctIndex = fuValues.indexOf(correctValue);
      if (correctIndex > 0) options.add(fuValues[correctIndex - 1]);
      if (correctIndex < fuValues.length - 1) options.add(fuValues[correctIndex + 1]);
      
      // ランダムに追加
      while (options.size < 4) {
        const randomFu = fuValues[Math.floor(Math.random() * fuValues.length)];
        options.add(randomFu);
      }
    } else if (type === 'han') {
      // 飜数の選択肢: 1-13
      // 正解の前後を追加
      if (correctValue > 1) options.add(correctValue - 1);
      if (correctValue < 13) options.add(correctValue + 1);
      
      // ランダムに追加
      while (options.size < 4) {
        const randomHan = 1 + Math.floor(Math.random() * 13);
        options.add(randomHan);
      }
    } else {
      // 点数の選択肢
      // 正解の±20-30%の範囲で生成
      const range = correctValue * 0.3;
      
      while (options.size < 4) {
        const offset = (Math.random() - 0.5) * 2 * range;
        let wrongValue = Math.round((correctValue + offset) / 100) * 100;
        
        // 最小値は1000点
        wrongValue = Math.max(1000, wrongValue);
        
        options.add(wrongValue);
      }
    }

    // 配列に変換してソート
    return Array.from(options).sort((a, b) => a - b);
  }

  /**
   * ユニークなIDを生成
   */
  private generateId(): string {
    return `problem-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
