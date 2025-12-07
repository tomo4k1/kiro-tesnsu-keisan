import React, { createContext, useContext, useState, useCallback, useMemo, useRef, useEffect } from 'react';
import type { SessionState, Answer, Statistics, GameSettings, Difficulty, ExtendedStatistics } from '../types';
import { QuizManager } from '../services/QuizManager';
import { SettingsManager } from '../services/SettingsManager';
import { measurePerformance, validatePerformanceRequirement, PERFORMANCE_THRESHOLDS } from '../utils/performance';
import { 
  GenerationError, 
  CalculationError, 
  StorageError, 
  getErrorMessage, 
  logError,
  ERROR_MESSAGES 
} from '../types/errors';

/**
 * クイズコンテキストの型定義
 */
interface QuizContextType {
  // 状態
  state: SessionState;
  error: string | null;
  
  // アクション
  generateNewProblem: (difficulty?: Difficulty) => void;
  updateUserAnswer: (answer: Partial<Answer>) => void;
  submitAnswer: () => boolean;
  resetAnswer: () => void;
  resetSession: () => void;
  updateSettings: (settings: GameSettings) => void;
  clearError: () => void;
}

/**
 * デフォルトの統計情報
 */
const defaultStatistics: Statistics = {
  totalAnswered: 0,
  correctCount: 0,
  incorrectCount: 0,
  correctRate: 0,
};

/**
 * デフォルトの拡張統計情報
 */
const defaultExtendedStatistics: ExtendedStatistics = {
  totalAnswered: 0,
  correctCount: 0,
  incorrectCount: 0,
  correctRate: 0,
  byDifficulty: {
    easy: { total: 0, correct: 0, rate: 0 },
    medium: { total: 0, correct: 0, rate: 0 },
    hard: { total: 0, correct: 0, rate: 0 },
  },
  recentTen: [],
  currentStreak: 0,
  bestStreak: 0,
  totalStudyTime: 0,
  sessionStartTime: Date.now(),
};

/**
 * 初期セッション状態を作成
 */
const createInitialState = (): SessionState => {
  const settings = SettingsManager.loadSettings();
  
  return {
    currentProblem: null,
    userAnswer: {},
    isAnswered: false,
    statistics: { ...defaultStatistics },
    extendedStatistics: { ...defaultExtendedStatistics },
    settings,
  };
};

// コンテキストの作成
const QuizContext = createContext<QuizContextType | undefined>(undefined);

/**
 * クイズコンテキストプロバイダーのProps
 */
interface QuizProviderProps {
  children: React.ReactNode;
}

/**
 * クイズコンテキストプロバイダー
 * アプリケーション全体の状態管理を提供
 */
export const QuizProvider: React.FC<QuizProviderProps> = ({ children }) => {
  const [state, setState] = useState<SessionState>(createInitialState);
  const [error, setError] = useState<string | null>(null);
  
  // QuizManagerのインスタンスをrefで保持（再レンダリング時も同じインスタンスを維持）
  const quizManagerRef = useRef<QuizManager>(new QuizManager(state.settings));

  // 設定が変更されたときにQuizManagerを再作成
  useEffect(() => {
    quizManagerRef.current = new QuizManager(state.settings);
  }, [state.settings]);

  /**
   * エラーをクリア
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * 新しい問題を生成
   * 
   * パフォーマンス測定: 要件 9.2（1秒以内）
   */
  const generateNewProblem = useCallback((difficulty?: Difficulty) => {
    try {
      clearError();
      
      const { result: problem, duration } = measurePerformance(
        () => quizManagerRef.current.generateProblem(difficulty),
        '問題生成'
      );
      
      // パフォーマンス要件を検証
      validatePerformanceRequirement(
        duration,
        PERFORMANCE_THRESHOLDS.PROBLEM_GENERATION,
        '問題生成'
      );
      
      setState(prev => ({
        ...prev,
        currentProblem: problem,
        userAnswer: {},
        isAnswered: false,
      }));
    } catch (err) {
      logError(err, 'QuizContext.generateNewProblem');
      
      if (err instanceof GenerationError) {
        setError(ERROR_MESSAGES.GENERATION_ERROR);
      } else if (err instanceof CalculationError) {
        setError(ERROR_MESSAGES.CALCULATION_ERROR);
      } else {
        setError(getErrorMessage(err));
      }
      
      // エラーが発生しても、可能であれば再試行
      // ただし、無限ループを避けるため、エラー状態を保持
    }
  }, [clearError]);

  /**
   * ユーザーの回答を更新
   */
  const updateUserAnswer = useCallback((answer: Partial<Answer>) => {
    setState(prev => ({
      ...prev,
      userAnswer: {
        ...prev.userAnswer,
        ...answer,
      },
    }));
  }, []);

  /**
   * 回答を送信して判定
   * @returns 正解の場合true、不正解の場合false
   * 
   * パフォーマンス最適化:
   * - 状態参照を最小化
   * - 早期リターンで不要な処理を回避
   * 
   * パフォーマンス測定: 要件 9.1（1秒以内）
   */
  const submitAnswer = useCallback((): boolean => {
    try {
      clearError();
      
      // 現在の状態を直接参照して判定を行う
      const currentProblem = state.currentProblem;
      const currentAnswer = state.userAnswer;
      
      // 早期リターン: 問題がない場合
      if (!currentProblem) {
        setError('問題が読み込まれていません');
        return false;
      }

      // 早期リターン: 符・飜数・点数のすべてが選択されているかチェック（要件 1.3）
      const { fu, han, score } = currentAnswer;
      if (fu === undefined || han === undefined || score === undefined) {
        setError(ERROR_MESSAGES.INVALID_ANSWER);
        return false;
      }

      const answer: Answer = { fu, han, score };
      
      // パフォーマンス測定
      const { result: isCorrect, duration } = measurePerformance(
        () => quizManagerRef.current.checkAnswer(currentProblem, answer),
        '回答判定'
      );
      
      // パフォーマンス要件を検証
      validatePerformanceRequirement(
        duration,
        PERFORMANCE_THRESHOLDS.ANSWER_CHECK,
        '回答判定'
      );
      
      // 統計情報を更新（1回の呼び出しで取得）
      const updatedStatistics = quizManagerRef.current.getStatistics();
      const updatedExtendedStatistics = quizManagerRef.current.getExtendedStatistics();
      
      setState(prev => ({
        ...prev,
        isAnswered: true,
        statistics: updatedStatistics,
        extendedStatistics: updatedExtendedStatistics,
      }));

      return isCorrect;
    } catch (err) {
      logError(err, 'QuizContext.submitAnswer');
      setError(getErrorMessage(err));
      return false;
    }
  }, [state.currentProblem, state.userAnswer, clearError]);

  /**
   * 回答をリセット（次の問題に進む準備）
   */
  const resetAnswer = useCallback(() => {
    setState(prev => ({
      ...prev,
      userAnswer: {},
      isAnswered: false,
    }));
  }, []);

  /**
   * セッションをリセット
   */
  const resetSession = useCallback(() => {
    quizManagerRef.current.resetSession();
    const updatedStatistics = quizManagerRef.current.getStatistics();
    const updatedExtendedStatistics = quizManagerRef.current.getExtendedStatistics();
    
    setState(prev => ({
      ...prev,
      currentProblem: null,
      userAnswer: {},
      isAnswered: false,
      statistics: updatedStatistics,
      extendedStatistics: updatedExtendedStatistics,
    }));
  }, []);

  /**
   * 設定を更新
   */
  const updateSettings = useCallback((settings: GameSettings) => {
    try {
      clearError();
      
      // ローカルストレージに保存（要件 7.5）
      SettingsManager.saveSettings(settings);
      
      setState(prev => ({
        ...prev,
        settings,
      }));
    } catch (err) {
      logError(err, 'QuizContext.updateSettings');
      
      if (err instanceof StorageError) {
        setError(ERROR_MESSAGES.STORAGE_SAVE_ERROR);
      } else {
        setError(getErrorMessage(err));
      }
      
      // エラーが発生しても状態は更新する（ユーザー体験を優先）
      setState(prev => ({
        ...prev,
        settings,
      }));
    }
  }, [clearError]);

  const contextValue = useMemo<QuizContextType>(
    () => ({
      state,
      error,
      generateNewProblem,
      updateUserAnswer,
      submitAnswer,
      resetAnswer,
      resetSession,
      updateSettings,
      clearError,
    }),
    [state, error, generateNewProblem, updateUserAnswer, submitAnswer, resetAnswer, resetSession, updateSettings, clearError]
  );

  return (
    <QuizContext.Provider value={contextValue}>
      {children}
    </QuizContext.Provider>
  );
};

/**
 * クイズコンテキストを使用するカスタムフック
 * @throws コンテキストプロバイダー外で使用された場合はエラー
 */
export const useQuiz = (): QuizContextType => {
  const context = useContext(QuizContext);
  
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  
  return context;
};
