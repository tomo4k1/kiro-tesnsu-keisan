import { describe, it, expect } from 'vitest';
import { formatScore, type ScoreFormatOptions } from './scoreFormatter';

describe('scoreFormatter', () => {
  describe('formatScore - ロン（Ron）', () => {
    it('子のロンの場合、単一の数値を表示する', () => {
      const options: ScoreFormatOptions = {
        isDealer: false,
        winType: 'ron',
        score: 3900,
      };

      const result = formatScore(options);

      expect(result.display).toBe('3900');
      expect(result.totalScore).toBe(3900);
      expect(result.dealerPayment).toBeUndefined();
      expect(result.nonDealerPayment).toBeUndefined();
    });

    it('親のロンの場合、単一の数値を表示する', () => {
      const options: ScoreFormatOptions = {
        isDealer: true,
        winType: 'ron',
        score: 12000,
      };

      const result = formatScore(options);

      expect(result.display).toBe('12000');
      expect(result.totalScore).toBe(12000);
      expect(result.dealerPayment).toBeUndefined();
      expect(result.nonDealerPayment).toBeUndefined();
    });
  });

  describe('formatScore - 親のツモ（Dealer Tsumo）', () => {
    it('親のツモの場合、"オール"形式で表示する', () => {
      const options: ScoreFormatOptions = {
        isDealer: true,
        winType: 'tsumo',
        score: 6000,
      };

      const result = formatScore(options);

      expect(result.display).toBe('2000オール');
      expect(result.dealerPayment).toBe(2000);
      expect(result.totalScore).toBe(6000);
      expect(result.nonDealerPayment).toBeUndefined();
    });

    it('親のツモで100の位を切り上げる', () => {
      const options: ScoreFormatOptions = {
        isDealer: true,
        winType: 'tsumo',
        score: 3900,
      };

      const result = formatScore(options);

      // 3900 / 3 = 1300
      expect(result.display).toBe('1300オール');
      expect(result.dealerPayment).toBe(1300);
      expect(result.totalScore).toBe(3900);
    });
  });

  describe('formatScore - 子のツモ（Non-dealer Tsumo）', () => {
    it('子のツモの場合、"子の支払い-親の支払い"形式で表示する', () => {
      const options: ScoreFormatOptions = {
        isDealer: false,
        winType: 'tsumo',
        score: 5200,
      };

      const result = formatScore(options);

      // 5200 / 4 = 1300 (子の支払い)
      // 1300 * 2 = 2600 (親の支払い)
      expect(result.display).toBe('1300-2600');
      expect(result.nonDealerPayment).toBe(1300);
      expect(result.dealerPayment).toBe(2600);
      expect(result.totalScore).toBe(5200);
    });

    it('子のツモで100の位を切り上げる', () => {
      const options: ScoreFormatOptions = {
        isDealer: false,
        winType: 'tsumo',
        score: 2000,
      };

      const result = formatScore(options);

      // 2000 / 4 = 500 (子の支払い)
      // 500 * 2 = 1000 (親の支払い)
      expect(result.display).toBe('500-1000');
      expect(result.nonDealerPayment).toBe(500);
      expect(result.dealerPayment).toBe(1000);
      expect(result.totalScore).toBe(2000);
    });

    it('子のツモで端数がある場合、100の位で切り上げる', () => {
      const options: ScoreFormatOptions = {
        isDealer: false,
        winType: 'tsumo',
        score: 2600,
      };

      const result = formatScore(options);

      // 2600 / 4 = 650 → 700に切り上げ (子の支払い)
      // 700 * 2 = 1400 (親の支払い)
      expect(result.display).toBe('700-1400');
      expect(result.nonDealerPayment).toBe(700);
      expect(result.dealerPayment).toBe(1400);
      expect(result.totalScore).toBe(2600);
    });
  });

  describe('formatScore - 実際の点数例', () => {
    it('1000点（30符1飜子ロン）', () => {
      const result = formatScore({
        isDealer: false,
        winType: 'ron',
        score: 1000,
      });

      expect(result.display).toBe('1000');
    });

    it('1500点（30符1飜親ロン）', () => {
      const result = formatScore({
        isDealer: true,
        winType: 'ron',
        score: 1500,
      });

      expect(result.display).toBe('1500');
    });

    it('8000点（満貫子ロン）', () => {
      const result = formatScore({
        isDealer: false,
        winType: 'ron',
        score: 8000,
      });

      expect(result.display).toBe('8000');
    });

    it('12000点（満貫親ロン）', () => {
      const result = formatScore({
        isDealer: true,
        winType: 'ron',
        score: 12000,
      });

      expect(result.display).toBe('12000');
    });

    it('8000点（満貫子ツモ）', () => {
      const result = formatScore({
        isDealer: false,
        winType: 'tsumo',
        score: 8000,
      });

      // 8000 / 4 = 2000 (子), 4000 (親)
      expect(result.display).toBe('2000-4000');
    });

    it('12000点（満貫親ツモ）', () => {
      const result = formatScore({
        isDealer: true,
        winType: 'tsumo',
        score: 12000,
      });

      // 12000 / 3 = 4000
      expect(result.display).toBe('4000オール');
    });
  });
});
