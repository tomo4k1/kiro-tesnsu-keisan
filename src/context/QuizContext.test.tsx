import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { QuizProvider, useQuiz } from './QuizContext';
import { SettingsManager } from '../services/SettingsManager';
import type { GameSettings } from '../types';

// SettingsManagerのモック
vi.mock('../services/SettingsManager', () => ({
  SettingsManager: {
    loadSettings: vi.fn(),
    saveSettings: vi.fn(),
    getDefaultSettings: vi.fn(() => ({
      redDora: true,
      kuitan: true,
      atozuke: true,
    })),
  },
}));

describe('QuizContext', () => {
  const defaultSettings: GameSettings = {
    redDora: true,
    kuitan: true,
    atozuke: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(SettingsManager.loadSettings).mockReturnValue(defaultSettings);
  });

  it('初期状態が正しく設定される', () => {
    const { result } = renderHook(() => useQuiz(), {
      wrapper: QuizProvider,
    });

    expect(result.current.state.currentProblem).toBeNull();
    expect(result.current.state.userAnswer).toEqual({});
    expect(result.current.state.isAnswered).toBe(false);
    expect(result.current.state.statistics).toEqual({
      totalAnswered: 0,
      correctCount: 0,
      incorrectCount: 0,
      correctRate: 0,
    });
    expect(result.current.state.settings).toEqual(defaultSettings);
  });

  it('新しい問題を生成できる', () => {
    const { result } = renderHook(() => useQuiz(), {
      wrapper: QuizProvider,
    });

    act(() => {
      result.current.generateNewProblem();
    });

    expect(result.current.state.currentProblem).not.toBeNull();
    expect(result.current.state.currentProblem?.id).toBeDefined();
    expect(result.current.state.userAnswer).toEqual({});
    expect(result.current.state.isAnswered).toBe(false);
  });

  it('ユーザーの回答を更新できる', () => {
    const { result } = renderHook(() => useQuiz(), {
      wrapper: QuizProvider,
    });

    act(() => {
      result.current.updateUserAnswer({ fu: 30 });
    });

    expect(result.current.state.userAnswer.fu).toBe(30);

    act(() => {
      result.current.updateUserAnswer({ han: 3 });
    });

    expect(result.current.state.userAnswer.fu).toBe(30);
    expect(result.current.state.userAnswer.han).toBe(3);

    act(() => {
      result.current.updateUserAnswer({ score: 3900 });
    });

    expect(result.current.state.userAnswer).toEqual({
      fu: 30,
      han: 3,
      score: 3900,
    });
  });

  it('不完全な回答は送信できない', () => {
    const { result } = renderHook(() => useQuiz(), {
      wrapper: QuizProvider,
    });

    act(() => {
      result.current.generateNewProblem();
    });

    // 符のみ選択
    act(() => {
      result.current.updateUserAnswer({ fu: 30 });
    });

    let isCorrect: boolean = false;
    act(() => {
      isCorrect = result.current.submitAnswer();
    });

    expect(isCorrect).toBe(false);
    expect(result.current.state.isAnswered).toBe(false);
  });

  it('完全な回答を送信できる', () => {
    const { result } = renderHook(() => useQuiz(), {
      wrapper: QuizProvider,
    });

    act(() => {
      result.current.generateNewProblem();
    });

    const problem = result.current.state.currentProblem!;

    // 正解を選択
    act(() => {
      result.current.updateUserAnswer({
        fu: problem.correctFu,
        han: problem.correctHan,
        score: problem.correctScore,
      });
    });

    let isCorrect: boolean = false;
    act(() => {
      isCorrect = result.current.submitAnswer();
    });

    expect(isCorrect).toBe(true);
    expect(result.current.state.isAnswered).toBe(true);
    expect(result.current.state.statistics.totalAnswered).toBe(1);
    expect(result.current.state.statistics.correctCount).toBe(1);
    expect(result.current.state.statistics.correctRate).toBe(100);
  });

  it('不正解の回答を送信できる', () => {
    const { result } = renderHook(() => useQuiz(), {
      wrapper: QuizProvider,
    });

    act(() => {
      result.current.generateNewProblem();
    });

    // 不正解を選択
    act(() => {
      result.current.updateUserAnswer({
        fu: 20,
        han: 1,
        score: 1000,
      });
    });

    let isCorrect: boolean = false;
    act(() => {
      isCorrect = result.current.submitAnswer();
    });

    expect(isCorrect).toBe(false);
    expect(result.current.state.isAnswered).toBe(true);
    expect(result.current.state.statistics.totalAnswered).toBe(1);
    expect(result.current.state.statistics.incorrectCount).toBe(1);
    expect(result.current.state.statistics.correctRate).toBe(0);
  });

  it('回答をリセットできる', () => {
    const { result } = renderHook(() => useQuiz(), {
      wrapper: QuizProvider,
    });

    act(() => {
      result.current.generateNewProblem();
      result.current.updateUserAnswer({ fu: 30, han: 3, score: 3900 });
    });

    expect(result.current.state.userAnswer).not.toEqual({});

    act(() => {
      result.current.resetAnswer();
    });

    expect(result.current.state.userAnswer).toEqual({});
    expect(result.current.state.isAnswered).toBe(false);
  });

  it('セッションをリセットできる', () => {
    const { result } = renderHook(() => useQuiz(), {
      wrapper: QuizProvider,
    });

    // 問題を生成して回答
    act(() => {
      result.current.generateNewProblem();
    });

    const problem = result.current.state.currentProblem!;

    act(() => {
      result.current.updateUserAnswer({
        fu: problem.correctFu,
        han: problem.correctHan,
        score: problem.correctScore,
      });
    });

    act(() => {
      result.current.submitAnswer();
    });

    expect(result.current.state.statistics.totalAnswered).toBe(1);

    // セッションをリセット
    act(() => {
      result.current.resetSession();
    });

    expect(result.current.state.currentProblem).toBeNull();
    expect(result.current.state.userAnswer).toEqual({});
    expect(result.current.state.isAnswered).toBe(false);
    expect(result.current.state.statistics).toEqual({
      totalAnswered: 0,
      correctCount: 0,
      incorrectCount: 0,
      correctRate: 0,
    });
  });

  it('設定を更新できる', () => {
    const { result } = renderHook(() => useQuiz(), {
      wrapper: QuizProvider,
    });

    const newSettings: GameSettings = {
      redDora: false,
      kuitan: false,
      atozuke: false,
    };

    act(() => {
      result.current.updateSettings(newSettings);
    });

    expect(result.current.state.settings).toEqual(newSettings);
    expect(SettingsManager.saveSettings).toHaveBeenCalledWith(newSettings);
  });

  it('設定保存エラー時も状態は更新される', () => {
    const { result } = renderHook(() => useQuiz(), {
      wrapper: QuizProvider,
    });

    // 保存エラーをシミュレート
    vi.mocked(SettingsManager.saveSettings).mockImplementation(() => {
      throw new Error('保存エラー');
    });

    const newSettings: GameSettings = {
      redDora: false,
      kuitan: false,
      atozuke: false,
    };

    act(() => {
      result.current.updateSettings(newSettings);
    });

    // エラーが発生しても状態は更新される
    expect(result.current.state.settings).toEqual(newSettings);
  });

  it('統計情報が正しく累積される', () => {
    const { result } = renderHook(() => useQuiz(), {
      wrapper: QuizProvider,
    });

    // 1問目: 正解
    act(() => {
      result.current.generateNewProblem();
    });

    let problem = result.current.state.currentProblem!;

    act(() => {
      result.current.updateUserAnswer({
        fu: problem.correctFu,
        han: problem.correctHan,
        score: problem.correctScore,
      });
    });

    act(() => {
      result.current.submitAnswer();
    });

    expect(result.current.state.statistics.totalAnswered).toBe(1);
    expect(result.current.state.statistics.correctCount).toBe(1);
    expect(result.current.state.statistics.correctRate).toBe(100);

    // 2問目: 不正解
    act(() => {
      result.current.generateNewProblem();
    });

    act(() => {
      result.current.updateUserAnswer({ fu: 20, han: 1, score: 1000 });
    });

    act(() => {
      result.current.submitAnswer();
    });

    expect(result.current.state.statistics.totalAnswered).toBe(2);
    expect(result.current.state.statistics.correctCount).toBe(1);
    expect(result.current.state.statistics.incorrectCount).toBe(1);
    expect(result.current.state.statistics.correctRate).toBe(50);

    // 3問目: 正解
    act(() => {
      result.current.generateNewProblem();
    });

    problem = result.current.state.currentProblem!;

    act(() => {
      result.current.updateUserAnswer({
        fu: problem.correctFu,
        han: problem.correctHan,
        score: problem.correctScore,
      });
    });

    act(() => {
      result.current.submitAnswer();
    });

    expect(result.current.state.statistics.totalAnswered).toBe(3);
    expect(result.current.state.statistics.correctCount).toBe(2);
    expect(result.current.state.statistics.incorrectCount).toBe(1);
    expect(result.current.state.statistics.correctRate).toBeCloseTo(66.67, 1);
  });

  it('プロバイダー外でuseQuizを使用するとエラーが発生する', () => {
    // エラーをキャッチするためにコンソールエラーを抑制
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useQuiz());
    }).toThrow('useQuiz must be used within a QuizProvider');

    consoleError.mockRestore();
  });
});
