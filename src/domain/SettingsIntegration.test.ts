import { describe, it, expect } from 'vitest';
import { ScoreCalculator } from './ScoreCalculator';
import type { Hand, WinCondition, GameSettings } from '../types';

describe('ScoreCalculator - ルール設定の統合', () => {
  const createTestHand = (hasRedTile: boolean, hasMelds: boolean): Hand => {
    // 鳴いている場合は、ポンした3枚を除いた10枚の閉じた牌
    const closedTiles = hasMelds ? [
      { type: 'man' as const, value: 2 as const },
      { type: 'man' as const, value: 3 as const },
      { type: 'man' as const, value: 4 as const },
      { type: 'sou' as const, value: 6 as const },
      { type: 'sou' as const, value: 7 as const },
      { type: 'sou' as const, value: 8 as const },
      { type: 'man' as const, value: 2 as const },
      { type: 'man' as const, value: 2 as const },
      { type: 'pin' as const, value: 3 as const },
      { type: 'pin' as const, value: 3 as const }
    ] : [
      { type: 'man' as const, value: 2 as const },
      { type: 'man' as const, value: 3 as const },
      { type: 'man' as const, value: 4 as const },
      { type: 'pin' as const, value: 5 as const, isRed: hasRedTile },
      { type: 'pin' as const, value: 5 as const },
      { type: 'pin' as const, value: 5 as const },
      { type: 'sou' as const, value: 6 as const },
      { type: 'sou' as const, value: 7 as const },
      { type: 'sou' as const, value: 8 as const },
      { type: 'man' as const, value: 2 as const },
      { type: 'man' as const, value: 2 as const },
      { type: 'pin' as const, value: 3 as const },
      { type: 'pin' as const, value: 3 as const }
    ];

    return {
      closedTiles,
      melds: hasMelds ? [{
        type: 'pon' as const,
        tiles: [
          { type: 'pin' as const, value: 5 as const },
          { type: 'pin' as const, value: 5 as const },
          { type: 'pin' as const, value: 5 as const }
        ]
      }] : [],
      winningTile: { type: 'man' as const, value: 2 as const },
      isDealer: false,
      winType: 'tsumo' as const,
      prevalentWind: 'east' as const,
      seatWind: 'south' as const,
      dora: []
    };
  };

  const testWinCondition: WinCondition = {
    isDealer: false,
    winType: 'tsumo' as const,
    prevalentWind: 'east' as const,
    seatWind: 'south' as const
  };

  describe('赤ドラ設定の反映', () => {
    it('赤ドラ設定が有効な場合、赤5を含む手牌の飜数に赤ドラが加算される', () => {
      const settingsWithRed: GameSettings = { redDora: true, kuitan: true, atozuke: true };
      const settingsWithoutRed: GameSettings = { redDora: false, kuitan: true, atozuke: true };

      const hand = createTestHand(true, false);

      const calculatorWithRed = new ScoreCalculator(settingsWithRed);
      const calculatorWithoutRed = new ScoreCalculator(settingsWithoutRed);

      const hanWithRed = calculatorWithRed.calculateHan(hand, testWinCondition);
      const hanWithoutRed = calculatorWithoutRed.calculateHan(hand, testWinCondition);

      expect(hanWithRed).toBeGreaterThan(hanWithoutRed);
      expect(hanWithRed - hanWithoutRed).toBe(1);
    });

    it('赤ドラ設定が無効な場合、赤5を含んでも飜数に加算されない', () => {
      const settings: GameSettings = { redDora: false, kuitan: true, atozuke: true };

      const handWithRed = createTestHand(true, false);
      const handWithoutRed = createTestHand(false, false);

      const calculator = new ScoreCalculator(settings);

      const hanWithRed = calculator.calculateHan(handWithRed, testWinCondition);
      const hanWithoutRed = calculator.calculateHan(handWithoutRed, testWinCondition);

      expect(hanWithRed).toBe(hanWithoutRed);
    });
  });

  describe('喰いタン設定の反映', () => {
    it('喰いタン設定が有効な場合、鳴いたタンヤオが役として認められる', () => {
      const settingsWithKuitan: GameSettings = { redDora: false, kuitan: true, atozuke: true };
      const hand = createTestHand(false, true);

      const calculator = new ScoreCalculator(settingsWithKuitan);
      const han = calculator.calculateHan(hand, testWinCondition);

      expect(han).toBeGreaterThanOrEqual(1);
    });

    it('喰いタン設定が無効な場合、鳴いたタンヤオは役として認められない', () => {
      const settingsWithoutKuitan: GameSettings = { redDora: false, kuitan: false, atozuke: true };
      const settingsWithKuitan: GameSettings = { redDora: false, kuitan: true, atozuke: true };

      const hand = createTestHand(false, true);

      const calculatorWithoutKuitan = new ScoreCalculator(settingsWithoutKuitan);
      const calculatorWithKuitan = new ScoreCalculator(settingsWithKuitan);

      const hanWithoutKuitan = calculatorWithoutKuitan.calculateHan(hand, testWinCondition);
      const hanWithKuitan = calculatorWithKuitan.calculateHan(hand, testWinCondition);

      expect(hanWithKuitan).toBeGreaterThan(hanWithoutKuitan);
    });

    it('門前の場合、喰いタン設定に関わらずタンヤオが認められる', () => {
      const settingsWithoutKuitan: GameSettings = { redDora: false, kuitan: false, atozuke: true };
      const hand = createTestHand(false, false);

      const calculator = new ScoreCalculator(settingsWithoutKuitan);
      const han = calculator.calculateHan(hand, testWinCondition);

      expect(han).toBeGreaterThanOrEqual(1);
    });
  });

  describe('設定の一貫性', () => {
    it('同じ手牌と設定で計算した場合、常に同じ結果を返す', () => {
      const settings: GameSettings = { redDora: true, kuitan: true, atozuke: true };
      const hand = createTestHand(true, false);

      const calculator = new ScoreCalculator(settings);

      const fu1 = calculator.calculateFu(hand, testWinCondition);
      const han1 = calculator.calculateHan(hand, testWinCondition);
      const score1 = calculator.calculateScore(fu1, han1, false, 'tsumo');

      const fu2 = calculator.calculateFu(hand, testWinCondition);
      const han2 = calculator.calculateHan(hand, testWinCondition);
      const score2 = calculator.calculateScore(fu2, han2, false, 'tsumo');

      expect(fu1).toBe(fu2);
      expect(han1).toBe(han2);
      expect(score1).toBe(score2);
    });
  });
});
