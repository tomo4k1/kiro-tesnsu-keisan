import { describe, it, expect } from 'vitest';
import { ScoreCalculator } from './ScoreCalculator';
import type { Hand, WinCondition, GameSettings, Tile } from '../types';

describe('ScoreCalculator - ルール設定の統合', () => {
  // テスト用のヘルパー関数
  const createBasicHand = (options: {
    hasRedTile?: boolean;
    hasMelds?: boolean;
    isTanyao?: boolean;
  } = {}): Hand => {
    const tiles: Tile[] = [];
    
    if (options.isTanyao) {
      // タンヤオの手牌（2-8の牌のみ）
      if (options.hasMelds) {
        // 鳴いている場合は、ポンした3枚を除いた10枚
        tiles.push(
          { type: 'man', value: 2 },
          { type: 'man', value: 3 },
          { type: 'man', value: 4 },
          { type: 'sou', value: 6 },
          { type: 'sou', value: 7 },
          { type: 'sou', value: 8 },
          { type: 'man', value: 2 },
          { type: 'man', value: 2 },
          { type: 'pin', value: 3 },
          { type: 'pin', value: 3 }
        );
      } else {
        // 門前の場合は13枚
        tiles.push(
          { type: 'man', value: 2 },
          { type: 'man', value: 3 },
          { type: 'man', value: 4 },
          { type: 'pin', value: 5, isRed: options.hasRedTile },
          { type: 'pin', value: 5 },
          { type: 'pin', value: 5 },
          { type: 'sou', value: 6 },
          { type: 'sou', value: 7 },
          { type: 'sou', value: 8 },
          { type: 'man', value: 2 },
          { type: 'man', value: 2 },
          { type: 'pin', value: 3 },
          { type: 'pin', value: 3 }
        );
      }
    } else {
      // 通常の手牌
      tiles.push(
        { type: 'man', value: 1 },
        { type: 'man', value: 2 },
        { type: 'man', value: 3 },
        { type: 'pin', value: 5, isRed: options.hasRedTile },
        { type: 'pin', value: 5 },
        { type: 'pin', value: 5 },
        { type: 'sou', value: 7 },
        { type: 'sou', value: 8 },
        { type: 'sou', value: 9 },
        { type: 'honor', honor: 'east' },
        { type: 'honor', honor: 'east' },
        { type: 'honor', honor: 'east' },
        { type: 'man', value: 1 }
      );
    }

    const melds = options.hasMelds ? [
      {
        type: 'pon' as const,
        tiles: [
          { type: 'pin' as const, value: 5 as const },
          { type: 'pin' as const, value: 5 as const },
          { type: 'pin' as const, value: 5 as const }
        ]
      }
    ] : [];

    return {
      closedTiles: tiles,
      melds,
      winningTile: { type: 'man', value: 2 },
      isDealer: false,
      winType: 'tsumo',
      prevalentWind: 'east',
      seatWind: 'south',
      dora: []
    };
  };

  const createBasicWinCondition = (): WinCondition => ({
    isDealer: false,
    winType: 'tsumo',
    prevalentWind: 'east',
    seatWind: 'south'
  });

  describe('赤ドラ設定の反映', () => {
    it('赤ドラ設定が有効な場合、赤5を含む手牌の飜数に赤ドラが加算される', () => {
      const settingsWithRed: GameSettings = {
        redDora: true,
        kuitan: true,
        atozuke: true
      };

      const settingsWithoutRed: GameSettings = {
        redDora: false,
        kuitan: true,
        atozuke: true
      };

      const hand = createBasicHand({ hasRedTile: true });
      const winCondition = createBasicWinCondition();

      const calculatorWithRed = new ScoreCalculator(settingsWithRed);
      const calculatorWithoutRed = new ScoreCalculator(settingsWithoutRed);

      const hanWithRed = calculatorWithRed.calculateHan(hand, winCondition);
      const hanWithoutRed = calculatorWithoutRed.calculateHan(hand, winCondition);

      // 赤ドラ設定が有効な場合、飜数が1多い
      expect(hanWithRed).toBeGreaterThan(hanWithoutRed);
      expect(hanWithRed - hanWithoutRed).toBe(1);
    });

    it('赤ドラ設定が無効な場合、赤5を含んでも飜数に加算されない', () => {
      const settings: GameSettings = {
        redDora: false,
        kuitan: true,
        atozuke: true
      };

      const handWithRed = createBasicHand({ hasRedTile: true });
      const handWithoutRed = createBasicHand({ hasRedTile: false });
      const winCondition = createBasicWinCondition();

      const calculator = new ScoreCalculator(settings);

      const hanWithRed = calculator.calculateHan(handWithRed, winCondition);
      const hanWithoutRed = calculator.calculateHan(handWithoutRed, winCondition);

      // 赤ドラ設定が無効な場合、赤5があっても飜数は同じ
      expect(hanWithRed).toBe(hanWithoutRed);
    });
  });

  describe('喰いタン設定の反映', () => {
    it('喰いタン設定が有効な場合、鳴いたタンヤオが役として認められる', () => {
      const settingsWithKuitan: GameSettings = {
        redDora: false,
        kuitan: true,
        atozuke: true
      };

      const hand = createBasicHand({ isTanyao: true, hasMelds: true });
      const winCondition = createBasicWinCondition();

      const calculator = new ScoreCalculator(settingsWithKuitan);
      const han = calculator.calculateHan(hand, winCondition);

      // タンヤオの1飜が含まれる（門前清自摸和も含まれる可能性があるため、1以上）
      expect(han).toBeGreaterThanOrEqual(1);
    });

    it('喰いタン設定が無効な場合、鳴いたタンヤオは役として認められない', () => {
      const settingsWithoutKuitan: GameSettings = {
        redDora: false,
        kuitan: false,
        atozuke: true
      };

      const settingsWithKuitan: GameSettings = {
        redDora: false,
        kuitan: true,
        atozuke: true
      };

      const hand = createBasicHand({ isTanyao: true, hasMelds: true });
      const winCondition = createBasicWinCondition();

      const calculatorWithoutKuitan = new ScoreCalculator(settingsWithoutKuitan);
      const calculatorWithKuitan = new ScoreCalculator(settingsWithKuitan);

      const hanWithoutKuitan = calculatorWithoutKuitan.calculateHan(hand, winCondition);
      const hanWithKuitan = calculatorWithKuitan.calculateHan(hand, winCondition);

      // 喰いタン無効の場合、タンヤオの1飜が含まれない
      expect(hanWithKuitan).toBeGreaterThan(hanWithoutKuitan);
    });

    it('門前の場合、喰いタン設定に関わらずタンヤオが認められる', () => {
      const settingsWithoutKuitan: GameSettings = {
        redDora: false,
        kuitan: false,
        atozuke: true
      };

      const hand = createBasicHand({ isTanyao: true, hasMelds: false });
      const winCondition = createBasicWinCondition();

      const calculator = new ScoreCalculator(settingsWithoutKuitan);
      const han = calculator.calculateHan(hand, winCondition);

      // 門前の場合、喰いタン設定に関わらずタンヤオが認められる
      expect(han).toBeGreaterThanOrEqual(1);
    });
  });

  describe('設定の一貫性', () => {
    it('同じ手牌と設定で計算した場合、常に同じ結果を返す', () => {
      const settings: GameSettings = {
        redDora: true,
        kuitan: true,
        atozuke: true
      };

      const hand = createBasicHand({ hasRedTile: true });
      const winCondition = createBasicWinCondition();

      const calculator = new ScoreCalculator(settings);

      const fu1 = calculator.calculateFu(hand, winCondition);
      const han1 = calculator.calculateHan(hand, winCondition);
      const score1 = calculator.calculateScore(fu1, han1, false, 'tsumo');

      const fu2 = calculator.calculateFu(hand, winCondition);
      const han2 = calculator.calculateHan(hand, winCondition);
      const score2 = calculator.calculateScore(fu2, han2, false, 'tsumo');

      expect(fu1).toBe(fu2);
      expect(han1).toBe(han2);
      expect(score1).toBe(score2);
    });

    it('異なる設定で計算した場合、結果が異なる可能性がある', () => {
      const settings1: GameSettings = {
        redDora: true,
        kuitan: true,
        atozuke: true
      };

      const settings2: GameSettings = {
        redDora: false,
        kuitan: false,
        atozuke: false
      };

      const hand = createBasicHand({ hasRedTile: true, isTanyao: true, hasMelds: true });
      const winCondition = createBasicWinCondition();

      const calculator1 = new ScoreCalculator(settings1);
      const calculator2 = new ScoreCalculator(settings2);

      const han1 = calculator1.calculateHan(hand, winCondition);
      const han2 = calculator2.calculateHan(hand, winCondition);

      // 設定が異なる場合、飜数が異なる
      expect(han1).not.toBe(han2);
    });
  });
});
