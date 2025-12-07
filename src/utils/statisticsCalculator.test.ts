import { describe, it, expect } from 'vitest';
import { 
  calculateExtendedStatistics, 
  type AnswerHistory 
} from './statisticsCalculator';

describe('calculateExtendedStatistics', () => {
  it('空の履歴に対して正しい初期値を返す', () => {
    const history: AnswerHistory[] = [];
    const stats = calculateExtendedStatistics(history);
    
    expect(stats.totalAnswered).toBe(0);
    expect(stats.correctCount).toBe(0);
    expect(stats.incorrectCount).toBe(0);
    expect(stats.correctRate).toBe(0);
    expect(stats.currentStreak).toBe(0);
    expect(stats.bestStreak).toBe(0);
    expect(stats.totalStudyTime).toBe(0);
    expect(stats.recentTen).toEqual([]);
    expect(stats.byDifficulty.easy.total).toBe(0);
    expect(stats.byDifficulty.medium.total).toBe(0);
    expect(stats.byDifficulty.hard.total).toBe(0);
  });

  it('基本統計を正しく計算する', () => {
    const history: AnswerHistory[] = [
      { isCorrect: true, difficulty: 'easy', timestamp: 1000, problemId: '1' },
      { isCorrect: false, difficulty: 'easy', timestamp: 2000, problemId: '2' },
      { isCorrect: true, difficulty: 'medium', timestamp: 3000, problemId: '3' },
      { isCorrect: true, difficulty: 'hard', timestamp: 4000, problemId: '4' },
    ];
    
    const stats = calculateExtendedStatistics(history);
    
    expect(stats.totalAnswered).toBe(4);
    expect(stats.correctCount).toBe(3);
    expect(stats.incorrectCount).toBe(1);
    expect(stats.correctRate).toBe(75);
  });

  it('難易度別統計を正しく計算する（要件 3.1）', () => {
    const history: AnswerHistory[] = [
      { isCorrect: true, difficulty: 'easy', timestamp: 1000, problemId: '1' },
      { isCorrect: true, difficulty: 'easy', timestamp: 2000, problemId: '2' },
      { isCorrect: false, difficulty: 'easy', timestamp: 3000, problemId: '3' },
      { isCorrect: true, difficulty: 'medium', timestamp: 4000, problemId: '4' },
      { isCorrect: false, difficulty: 'medium', timestamp: 5000, problemId: '5' },
      { isCorrect: true, difficulty: 'hard', timestamp: 6000, problemId: '6' },
    ];
    
    const stats = calculateExtendedStatistics(history);
    
    // Easy: 2/3 = 66.67%
    expect(stats.byDifficulty.easy.total).toBe(3);
    expect(stats.byDifficulty.easy.correct).toBe(2);
    expect(stats.byDifficulty.easy.rate).toBeCloseTo(66.67, 1);
    
    // Medium: 1/2 = 50%
    expect(stats.byDifficulty.medium.total).toBe(2);
    expect(stats.byDifficulty.medium.correct).toBe(1);
    expect(stats.byDifficulty.medium.rate).toBe(50);
    
    // Hard: 1/1 = 100%
    expect(stats.byDifficulty.hard.total).toBe(1);
    expect(stats.byDifficulty.hard.correct).toBe(1);
    expect(stats.byDifficulty.hard.rate).toBe(100);
  });

  it('最近10問の正誤を正しく取得する（要件 3.2）', () => {
    const history: AnswerHistory[] = Array.from({ length: 15 }, (_, i) => ({
      isCorrect: i % 2 === 0,
      difficulty: 'easy' as const,
      timestamp: 1000 + i * 1000,
      problemId: `${i}`,
    }));
    
    const stats = calculateExtendedStatistics(history);
    
    // 最後の10問のみ取得される
    expect(stats.recentTen).toHaveLength(10);
    // インデックス5-14の正誤パターン: false, true, false, true, false, true, false, true, false, true
    expect(stats.recentTen).toEqual([
      false, true, false, true, false, true, false, true, false, true
    ]);
  });

  it('10問未満の場合は全履歴を返す（要件 3.2）', () => {
    const history: AnswerHistory[] = [
      { isCorrect: true, difficulty: 'easy', timestamp: 1000, problemId: '1' },
      { isCorrect: false, difficulty: 'easy', timestamp: 2000, problemId: '2' },
      { isCorrect: true, difficulty: 'easy', timestamp: 3000, problemId: '3' },
    ];
    
    const stats = calculateExtendedStatistics(history);
    
    expect(stats.recentTen).toHaveLength(3);
    expect(stats.recentTen).toEqual([true, false, true]);
  });

  it('現在の連続正解数を正しく計算する（要件 3.3）', () => {
    const history: AnswerHistory[] = [
      { isCorrect: true, difficulty: 'easy', timestamp: 1000, problemId: '1' },
      { isCorrect: false, difficulty: 'easy', timestamp: 2000, problemId: '2' },
      { isCorrect: true, difficulty: 'easy', timestamp: 3000, problemId: '3' },
      { isCorrect: true, difficulty: 'easy', timestamp: 4000, problemId: '4' },
      { isCorrect: true, difficulty: 'easy', timestamp: 5000, problemId: '5' },
    ];
    
    const stats = calculateExtendedStatistics(history);
    
    // 最後の3問が連続正解
    expect(stats.currentStreak).toBe(3);
  });

  it('全問正解の場合の連続正解数（要件 3.3）', () => {
    const history: AnswerHistory[] = [
      { isCorrect: true, difficulty: 'easy', timestamp: 1000, problemId: '1' },
      { isCorrect: true, difficulty: 'easy', timestamp: 2000, problemId: '2' },
      { isCorrect: true, difficulty: 'easy', timestamp: 3000, problemId: '3' },
    ];
    
    const stats = calculateExtendedStatistics(history);
    
    expect(stats.currentStreak).toBe(3);
    expect(stats.bestStreak).toBe(3);
  });

  it('最高連続正解数を正しく計算する（要件 3.3）', () => {
    const history: AnswerHistory[] = [
      { isCorrect: true, difficulty: 'easy', timestamp: 1000, problemId: '1' },
      { isCorrect: true, difficulty: 'easy', timestamp: 2000, problemId: '2' },
      { isCorrect: true, difficulty: 'easy', timestamp: 3000, problemId: '3' },
      { isCorrect: true, difficulty: 'easy', timestamp: 4000, problemId: '4' },
      { isCorrect: false, difficulty: 'easy', timestamp: 5000, problemId: '5' },
      { isCorrect: true, difficulty: 'easy', timestamp: 6000, problemId: '6' },
      { isCorrect: true, difficulty: 'easy', timestamp: 7000, problemId: '7' },
    ];
    
    const stats = calculateExtendedStatistics(history);
    
    // 最高連続正解数は4（最初の4問）
    expect(stats.bestStreak).toBe(4);
    // 現在の連続正解数は2（最後の2問）
    expect(stats.currentStreak).toBe(2);
  });

  it('学習時間を正しく計算する（要件 3.4）', () => {
    const history: AnswerHistory[] = [
      { isCorrect: true, difficulty: 'easy', timestamp: 1000, problemId: '1' },
      { isCorrect: false, difficulty: 'easy', timestamp: 2000, problemId: '2' },
      { isCorrect: true, difficulty: 'easy', timestamp: 6000, problemId: '3' },
    ];
    
    const stats = calculateExtendedStatistics(history);
    
    // 1000ms から 6000ms = 5000ms = 5秒
    expect(stats.totalStudyTime).toBe(5);
  });

  it('連続不正解の場合の連続正解数は0（要件 3.3）', () => {
    const history: AnswerHistory[] = [
      { isCorrect: false, difficulty: 'easy', timestamp: 1000, problemId: '1' },
      { isCorrect: false, difficulty: 'easy', timestamp: 2000, problemId: '2' },
      { isCorrect: false, difficulty: 'easy', timestamp: 3000, problemId: '3' },
    ];
    
    const stats = calculateExtendedStatistics(history);
    
    expect(stats.currentStreak).toBe(0);
    expect(stats.bestStreak).toBe(0);
  });

  it('難易度が存在しない場合は0を返す', () => {
    const history: AnswerHistory[] = [
      { isCorrect: true, difficulty: 'easy', timestamp: 1000, problemId: '1' },
    ];
    
    const stats = calculateExtendedStatistics(history);
    
    expect(stats.byDifficulty.medium.total).toBe(0);
    expect(stats.byDifficulty.medium.correct).toBe(0);
    expect(stats.byDifficulty.medium.rate).toBe(0);
    expect(stats.byDifficulty.hard.total).toBe(0);
    expect(stats.byDifficulty.hard.correct).toBe(0);
    expect(stats.byDifficulty.hard.rate).toBe(0);
  });

  it('sessionStartTimeが設定される', () => {
    const history: AnswerHistory[] = [
      { isCorrect: true, difficulty: 'easy', timestamp: 1000, problemId: '1' },
    ];
    
    const beforeTime = Date.now();
    const stats = calculateExtendedStatistics(history);
    const afterTime = Date.now();
    
    expect(stats.sessionStartTime).toBeGreaterThanOrEqual(beforeTime);
    expect(stats.sessionStartTime).toBeLessThanOrEqual(afterTime);
  });
});
