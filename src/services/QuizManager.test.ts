import { describe, it, expect, beforeEach } from 'vitest';
import { QuizManager } from './QuizManager';
import type { GameSettings, Answer } from '../types';

describe('QuizManager', () => {
  let quizManager: QuizManager;
  const defaultSettings: GameSettings = {
    redDora: true,
    kuitan: true,
    atozuke: true,
  };

  beforeEach(() => {
    quizManager = new QuizManager(defaultSettings);
  });

  describe('generateProblem', () => {
    it('問題を生成できること', () => {
      const problem = quizManager.generateProblem();
      
      expect(problem).toBeDefined();
      expect(problem.id).toBeDefined();
      expect(problem.hand).toBeDefined();
      expect(problem.correctFu).toBeGreaterThan(0);
      expect(problem.correctHan).toBeGreaterThan(0);
      expect(problem.correctScore).toBeGreaterThan(0);
      expect(problem.fuOptions).toContain(problem.correctFu);
      expect(problem.hanOptions).toContain(problem.correctHan);
      expect(problem.scoreOptions).toContain(problem.correctScore);
    });

    it('指定した難易度の問題を生成できること', () => {
      const easyProblem = quizManager.generateProblem('easy');
      expect(easyProblem.difficulty).toBe('easy');

      const mediumProblem = quizManager.generateProblem('medium');
      expect(mediumProblem.difficulty).toBe('medium');

      const hardProblem = quizManager.generateProblem('hard');
      expect(hardProblem.difficulty).toBe('hard');
    });

    it('連続して生成される問題のIDが異なること（要件 4.2）', () => {
      const problem1 = quizManager.generateProblem();
      const problem2 = quizManager.generateProblem();
      
      expect(problem1.id).not.toBe(problem2.id);
    });
  });

  describe('checkAnswer', () => {
    it('正解の回答を正しく判定できること（要件 1.4）', () => {
      const problem = quizManager.generateProblem();
      const correctAnswer: Answer = {
        fu: problem.correctFu,
        han: problem.correctHan,
        score: problem.correctScore,
      };

      const result = quizManager.checkAnswer(problem, correctAnswer);
      expect(result).toBe(true);
    });

    it('符が間違っている場合は不正解と判定すること', () => {
      const problem = quizManager.generateProblem();
      const wrongAnswer: Answer = {
        fu: problem.correctFu + 10,
        han: problem.correctHan,
        score: problem.correctScore,
      };

      const result = quizManager.checkAnswer(problem, wrongAnswer);
      expect(result).toBe(false);
    });

    it('飜数が間違っている場合は不正解と判定すること', () => {
      const problem = quizManager.generateProblem();
      const wrongAnswer: Answer = {
        fu: problem.correctFu,
        han: problem.correctHan + 1,
        score: problem.correctScore,
      };

      const result = quizManager.checkAnswer(problem, wrongAnswer);
      expect(result).toBe(false);
    });

    it('点数が間違っている場合は不正解と判定すること', () => {
      const problem = quizManager.generateProblem();
      const wrongAnswer: Answer = {
        fu: problem.correctFu,
        han: problem.correctHan,
        score: problem.correctScore + 1000,
      };

      const result = quizManager.checkAnswer(problem, wrongAnswer);
      expect(result).toBe(false);
    });
  });

  describe('getStatistics', () => {
    it('初期状態の統計情報を取得できること', () => {
      const stats = quizManager.getStatistics();
      
      expect(stats.totalAnswered).toBe(0);
      expect(stats.correctCount).toBe(0);
      expect(stats.incorrectCount).toBe(0);
      expect(stats.correctRate).toBe(0);
    });

    it('正解後に統計情報が更新されること（要件 3.1, 3.2）', () => {
      const problem = quizManager.generateProblem();
      const correctAnswer: Answer = {
        fu: problem.correctFu,
        han: problem.correctHan,
        score: problem.correctScore,
      };

      quizManager.checkAnswer(problem, correctAnswer);
      const stats = quizManager.getStatistics();

      expect(stats.totalAnswered).toBe(1);
      expect(stats.correctCount).toBe(1);
      expect(stats.incorrectCount).toBe(0);
      expect(stats.correctRate).toBe(100);
    });

    it('不正解後に統計情報が更新されること（要件 3.1, 3.2）', () => {
      const problem = quizManager.generateProblem();
      const wrongAnswer: Answer = {
        fu: problem.correctFu + 10,
        han: problem.correctHan,
        score: problem.correctScore,
      };

      quizManager.checkAnswer(problem, wrongAnswer);
      const stats = quizManager.getStatistics();

      expect(stats.totalAnswered).toBe(1);
      expect(stats.correctCount).toBe(0);
      expect(stats.incorrectCount).toBe(1);
      expect(stats.correctRate).toBe(0);
    });

    it('正解率が正しく計算されること（要件 3.3）', () => {
      const problem1 = quizManager.generateProblem();
      const problem2 = quizManager.generateProblem();
      const problem3 = quizManager.generateProblem();

      // 1問目: 正解
      quizManager.checkAnswer(problem1, {
        fu: problem1.correctFu,
        han: problem1.correctHan,
        score: problem1.correctScore,
      });

      // 2問目: 不正解
      quizManager.checkAnswer(problem2, {
        fu: problem2.correctFu + 10,
        han: problem2.correctHan,
        score: problem2.correctScore,
      });

      // 3問目: 正解
      quizManager.checkAnswer(problem3, {
        fu: problem3.correctFu,
        han: problem3.correctHan,
        score: problem3.correctScore,
      });

      const stats = quizManager.getStatistics();
      expect(stats.totalAnswered).toBe(3);
      expect(stats.correctCount).toBe(2);
      expect(stats.incorrectCount).toBe(1);
      expect(stats.correctRate).toBeCloseTo(66.67, 1);
    });

    it('回答数が正解数と不正解数の合計と一致すること（要件 3.1, 3.2）', () => {
      const problem1 = quizManager.generateProblem();
      const problem2 = quizManager.generateProblem();

      quizManager.checkAnswer(problem1, {
        fu: problem1.correctFu,
        han: problem1.correctHan,
        score: problem1.correctScore,
      });

      quizManager.checkAnswer(problem2, {
        fu: problem2.correctFu + 10,
        han: problem2.correctHan,
        score: problem2.correctScore,
      });

      const stats = quizManager.getStatistics();
      expect(stats.totalAnswered).toBe(stats.correctCount + stats.incorrectCount);
    });
  });

  describe('resetSession', () => {
    it('セッションをリセットできること', () => {
      // いくつか問題を解く
      const problem1 = quizManager.generateProblem();
      quizManager.checkAnswer(problem1, {
        fu: problem1.correctFu,
        han: problem1.correctHan,
        score: problem1.correctScore,
      });

      const problem2 = quizManager.generateProblem();
      quizManager.checkAnswer(problem2, {
        fu: problem2.correctFu + 10,
        han: problem2.correctHan,
        score: problem2.correctScore,
      });

      // リセット
      quizManager.resetSession();

      // 統計情報がクリアされていることを確認
      const stats = quizManager.getStatistics();
      expect(stats.totalAnswered).toBe(0);
      expect(stats.correctCount).toBe(0);
      expect(stats.incorrectCount).toBe(0);
      expect(stats.correctRate).toBe(0);
    });
  });
});
