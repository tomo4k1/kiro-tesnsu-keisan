import { describe, it, expect } from 'vitest';
import { ProblemGenerator } from './ProblemGenerator';
import type { GameSettings } from '../types';

describe('ProblemGenerator', () => {
  const defaultSettings: GameSettings = {
    redDora: true,
    kuitan: true,
    atozuke: true,
  };

  describe('generate', () => {
    it('生成された問題は有効な手牌を持つ（14枚）', () => {
      const generator = new ProblemGenerator(defaultSettings);
      const problem = generator.generate();

      const totalTiles = problem.hand.closedTiles.length + 1; // +1 for winningTile
      expect(totalTiles).toBe(14);
    });

    it('生成された問題は符・飜数・点数の選択肢を持つ', () => {
      const generator = new ProblemGenerator(defaultSettings);
      const problem = generator.generate();

      expect(problem.fuOptions.length).toBeGreaterThanOrEqual(4);
      expect(problem.hanOptions.length).toBeGreaterThanOrEqual(4);
      expect(problem.scoreOptions.length).toBeGreaterThanOrEqual(4);
    });

    it('符の選択肢に正解が含まれる', () => {
      const generator = new ProblemGenerator(defaultSettings);
      const problem = generator.generate();

      expect(problem.fuOptions).toContain(problem.correctFu);
    });

    it('飜数の選択肢に正解が含まれる', () => {
      const generator = new ProblemGenerator(defaultSettings);
      const problem = generator.generate();

      expect(problem.hanOptions).toContain(problem.correctHan);
    });

    it('点数の選択肢に正解が含まれる', () => {
      const generator = new ProblemGenerator(defaultSettings);
      const problem = generator.generate();

      expect(problem.scoreOptions).toContain(problem.correctScore);
    });

    it('指定した難易度で問題を生成できる', () => {
      const generator = new ProblemGenerator(defaultSettings);
      
      const easyProblem = generator.generate('easy');
      expect(easyProblem.difficulty).toBe('easy');

      const mediumProblem = generator.generate('medium');
      expect(mediumProblem.difficulty).toBe('medium');

      const hardProblem = generator.generate('hard');
      expect(hardProblem.difficulty).toBe('hard');
    });

    it('問題IDはユニークである', () => {
      const generator = new ProblemGenerator(defaultSettings);
      const problem1 = generator.generate();
      const problem2 = generator.generate();

      expect(problem1.id).not.toBe(problem2.id);
    });

    it('手牌の牌はすべて有効な牌である', () => {
      const generator = new ProblemGenerator(defaultSettings);
      const problem = generator.generate();

      const allTiles = [...problem.hand.closedTiles, problem.hand.winningTile];
      
      for (const tile of allTiles) {
        expect(['man', 'pin', 'sou', 'honor']).toContain(tile.type);
        
        if (tile.type !== 'honor') {
          expect(tile.value).toBeGreaterThanOrEqual(1);
          expect(tile.value).toBeLessThanOrEqual(9);
        } else {
          expect(['east', 'south', 'west', 'north', 'white', 'green', 'red']).toContain(tile.honor);
        }
      }
    });
  });

  describe('generateOptions', () => {
    it('符の選択肢は有効な符の値である', () => {
      const generator = new ProblemGenerator(defaultSettings);
      const options = generator.generateOptions(30, 'fu');

      const validFu = [20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 110];
      for (const option of options) {
        expect(validFu).toContain(option);
      }
    });

    it('飜数の選択肢は1-13の範囲である', () => {
      const generator = new ProblemGenerator(defaultSettings);
      const options = generator.generateOptions(3, 'han');

      for (const option of options) {
        expect(option).toBeGreaterThanOrEqual(1);
        expect(option).toBeLessThanOrEqual(13);
      }
    });

    it('点数の選択肢は100点単位である', () => {
      const generator = new ProblemGenerator(defaultSettings);
      const options = generator.generateOptions(3900, 'score');

      for (const option of options) {
        expect(option % 100).toBe(0);
      }
    });

    it('選択肢はソートされている', () => {
      const generator = new ProblemGenerator(defaultSettings);
      const options = generator.generateOptions(30, 'fu');

      const sorted = [...options].sort((a, b) => a - b);
      expect(options).toEqual(sorted);
    });
  });
});
