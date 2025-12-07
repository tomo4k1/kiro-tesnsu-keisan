import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DetailedStatistics } from './DetailedStatistics';
import type { ExtendedStatistics } from '../types';

describe('DetailedStatistics', () => {
  const mockStatistics: ExtendedStatistics = {
    totalAnswered: 20,
    correctCount: 15,
    incorrectCount: 5,
    correctRate: 75,
    byDifficulty: {
      easy: { total: 8, correct: 7, rate: 87.5 },
      medium: { total: 7, correct: 5, rate: 71.4 },
      hard: { total: 5, correct: 3, rate: 60 },
    },
    recentTen: [true, true, false, true, true, true, false, true, true, true],
    currentStreak: 3,
    bestStreak: 5,
    totalStudyTime: 3665, // 1時間1分5秒
    sessionStartTime: Date.now(),
  };

  it('基本統計情報を表示する', () => {
    render(<DetailedStatistics statistics={mockStatistics} />);

    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('75.0%')).toBeInTheDocument();
  });

  it('難易度別統計を表示する (要件 3.1)', () => {
    render(<DetailedStatistics statistics={mockStatistics} />);

    expect(screen.getByText('初級')).toBeInTheDocument();
    expect(screen.getByText('中級')).toBeInTheDocument();
    expect(screen.getByText('上級')).toBeInTheDocument();
    expect(screen.getByText('87.5%')).toBeInTheDocument();
    expect(screen.getByText('71.4%')).toBeInTheDocument();
    expect(screen.getByText('60.0%')).toBeInTheDocument();
  });

  it('最近10問の結果を表示する (要件 3.2)', () => {
    render(<DetailedStatistics statistics={mockStatistics} />);

    const recentResults = screen.getAllByTitle(/正解|不正解/);
    expect(recentResults).toHaveLength(10);

    // 正解数を確認
    const correctResults = screen.getAllByTitle('正解');
    expect(correctResults).toHaveLength(8);

    // 不正解数を確認
    const incorrectResults = screen.getAllByTitle('不正解');
    expect(incorrectResults).toHaveLength(2);
  });

  it('連続正解数を表示する (要件 3.3)', () => {
    render(<DetailedStatistics statistics={mockStatistics} />);

    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('現在の連続正解数')).toBeInTheDocument();
    expect(screen.getByText('最高連続正解数')).toBeInTheDocument();
  });

  it('学習時間を表示する (要件 3.4)', () => {
    render(<DetailedStatistics statistics={mockStatistics} />);

    expect(screen.getByText('1時間1分')).toBeInTheDocument();
    expect(screen.getByText('学習時間')).toBeInTheDocument();
  });

  it('学習時間を適切にフォーマットする - 秒のみ', () => {
    const stats = { ...mockStatistics, totalStudyTime: 45 };
    render(<DetailedStatistics statistics={stats} />);

    expect(screen.getByText('45秒')).toBeInTheDocument();
  });

  it('学習時間を適切にフォーマットする - 分と秒', () => {
    const stats = { ...mockStatistics, totalStudyTime: 125 };
    render(<DetailedStatistics statistics={stats} />);

    expect(screen.getByText('2分5秒')).toBeInTheDocument();
  });

  it('学習時間を適切にフォーマットする - 分のみ', () => {
    const stats = { ...mockStatistics, totalStudyTime: 180 };
    render(<DetailedStatistics statistics={stats} />);

    expect(screen.getByText('3分')).toBeInTheDocument();
  });

  it('学習時間を適切にフォーマットする - 時間のみ', () => {
    const stats = { ...mockStatistics, totalStudyTime: 7200 };
    render(<DetailedStatistics statistics={stats} />);

    expect(screen.getByText('2時間')).toBeInTheDocument();
  });

  it('リセットボタンを表示し、クリックできる', () => {
    const onReset = vi.fn();
    render(<DetailedStatistics statistics={mockStatistics} onReset={onReset} />);

    const resetButton = screen.getByRole('button', { name: /リセット/i });
    expect(resetButton).toBeInTheDocument();

    resetButton.click();
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('回答がない場合はリセットボタンを表示しない', () => {
    const emptyStats: ExtendedStatistics = {
      ...mockStatistics,
      totalAnswered: 0,
      correctCount: 0,
      incorrectCount: 0,
      correctRate: 0,
      recentTen: [],
    };
    const onReset = vi.fn();
    render(<DetailedStatistics statistics={emptyStats} onReset={onReset} />);

    expect(screen.queryByRole('button', { name: /リセット/i })).not.toBeInTheDocument();
  });

  it('回答がない場合はメッセージを表示する', () => {
    const emptyStats: ExtendedStatistics = {
      ...mockStatistics,
      totalAnswered: 0,
      correctCount: 0,
      incorrectCount: 0,
      correctRate: 0,
      recentTen: [],
    };
    render(<DetailedStatistics statistics={emptyStats} />);

    expect(screen.getByText('問題に回答すると詳細な統計情報が表示されます')).toBeInTheDocument();
  });

  it('正解率に応じて適切なメッセージを表示する - 80%以上', () => {
    const highStats = { ...mockStatistics, correctRate: 85 };
    render(<DetailedStatistics statistics={highStats} />);

    expect(screen.getByText(/素晴らしい成績です/)).toBeInTheDocument();
  });

  it('正解率に応じて適切なメッセージを表示する - 60-80%', () => {
    const goodStats = { ...mockStatistics, correctRate: 70 };
    render(<DetailedStatistics statistics={goodStats} />);

    expect(screen.getByText(/良い調子です/)).toBeInTheDocument();
  });

  it('正解率に応じて適切なメッセージを表示する - 40-60%', () => {
    const okStats = { ...mockStatistics, correctRate: 50 };
    render(<DetailedStatistics statistics={okStats} />);

    expect(screen.getByText(/もう少し頑張りましょう/)).toBeInTheDocument();
  });

  it('正解率に応じて適切なメッセージを表示する - 40%未満', () => {
    const lowStats = { ...mockStatistics, correctRate: 30 };
    render(<DetailedStatistics statistics={lowStats} />);

    expect(screen.getByText(/練習を続けましょう/)).toBeInTheDocument();
  });

  it('最近10問の正解率を計算して表示する', () => {
    render(<DetailedStatistics statistics={mockStatistics} />);

    // 10問中8問正解 = 80%
    expect(screen.getByText(/80\.0%/)).toBeInTheDocument();
    expect(screen.getByText(/8 \/ 10 問/)).toBeInTheDocument();
  });

  it('アクセシビリティ: ARIAラベルが適切に設定されている', () => {
    render(<DetailedStatistics statistics={mockStatistics} />);

    const resetButton = screen.queryByRole('button', { name: /統計をリセット/i });
    if (resetButton) {
      expect(resetButton).toHaveAttribute('aria-label', '統計をリセット');
    }

    // 最近10問の各結果にARIAラベルがあることを確認
    const results = screen.getAllByLabelText(/問題\d+:/);
    expect(results.length).toBeGreaterThan(0);
  });
});
