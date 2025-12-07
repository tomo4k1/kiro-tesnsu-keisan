import type { Difficulty } from '../types';

/**
 * 回答履歴の型定義
 */
export interface AnswerHistory {
  isCorrect: boolean;
  difficulty: Difficulty;
  timestamp: number;
  problemId: string;
}

/**
 * 難易度別統計の型定義
 */
export interface DifficultyStats {
  total: number;
  correct: number;
  rate: number;
}

/**
 * 拡張統計情報の型定義
 */
export interface ExtendedStatistics {
  // 基本統計
  totalAnswered: number;
  correctCount: number;
  incorrectCount: number;
  correctRate: number;
  
  // 難易度別統計
  byDifficulty: {
    easy: DifficultyStats;
    medium: DifficultyStats;
    hard: DifficultyStats;
  };
  
  // 最近10問の正誤
  recentTen: boolean[];
  
  // 連続正解数
  currentStreak: number;
  bestStreak: number;
  
  // 学習時間（秒）
  totalStudyTime: number;
  sessionStartTime: number;
}

/**
 * 難易度別の統計を計算
 */
function calculateDifficultyStats(
  history: AnswerHistory[],
  difficulty: Difficulty
): DifficultyStats {
  const filtered = history.filter(h => h.difficulty === difficulty);
  const total = filtered.length;
  const correct = filtered.filter(h => h.isCorrect).length;
  const rate = total > 0 ? (correct / total) * 100 : 0;
  
  return { total, correct, rate };
}

/**
 * 現在の連続正解数を計算
 */
function calculateCurrentStreak(history: AnswerHistory[]): number {
  let streak = 0;
  
  // 最新の回答から遡って連続正解数をカウント
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].isCorrect) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

/**
 * 最高連続正解数を計算
 */
function calculateBestStreak(history: AnswerHistory[]): number {
  let bestStreak = 0;
  let currentStreak = 0;
  
  for (const answer of history) {
    if (answer.isCorrect) {
      currentStreak++;
      bestStreak = Math.max(bestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }
  
  return bestStreak;
}

/**
 * 学習時間を計算（秒）
 */
function calculateStudyTime(history: AnswerHistory[]): number {
  if (history.length === 0) {
    return 0;
  }
  
  // 最初の回答から最後の回答までの時間を計算
  const firstTimestamp = history[0].timestamp;
  const lastTimestamp = history[history.length - 1].timestamp;
  
  return Math.floor((lastTimestamp - firstTimestamp) / 1000);
}

/**
 * 拡張統計情報を計算
 * 
 * @param history 回答履歴の配列
 * @returns 計算された拡張統計情報
 * 
 * 要件:
 * - 3.1: 難易度別の正解率を表示
 * - 3.2: 最近の10問の正解率を表示
 * - 3.3: 連続正解数を表示
 * - 3.4: 学習時間を表示
 */
export function calculateExtendedStatistics(
  history: AnswerHistory[]
): ExtendedStatistics {
  const total = history.length;
  const correct = history.filter(h => h.isCorrect).length;
  const correctRate = total > 0 ? (correct / total) * 100 : 0;
  
  // 難易度別統計を計算（要件 3.1）
  const byDifficulty = {
    easy: calculateDifficultyStats(history, 'easy'),
    medium: calculateDifficultyStats(history, 'medium'),
    hard: calculateDifficultyStats(history, 'hard'),
  };
  
  // 最近10問の正誤を取得（要件 3.2）
  const recentTen = history
    .slice(-10)
    .map(h => h.isCorrect);
  
  // 連続正解数を計算（要件 3.3）
  const currentStreak = calculateCurrentStreak(history);
  const bestStreak = calculateBestStreak(history);
  
  // 学習時間を計算（要件 3.4）
  const totalStudyTime = calculateStudyTime(history);
  
  return {
    totalAnswered: total,
    correctCount: correct,
    incorrectCount: total - correct,
    correctRate,
    byDifficulty,
    recentTen,
    currentStreak,
    bestStreak,
    totalStudyTime,
    sessionStartTime: Date.now(),
  };
}
