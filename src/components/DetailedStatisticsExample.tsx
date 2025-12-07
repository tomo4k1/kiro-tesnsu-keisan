import React, { useState } from 'react';
import { DetailedStatistics } from './DetailedStatistics';
import type { ExtendedStatistics } from '../types';

/**
 * DetailedStatisticsコンポーネントの使用例
 * 
 * このコンポーネントは開発時のプレビューとテスト用です
 */
export const DetailedStatisticsExample: React.FC = () => {
  const [statistics, setStatistics] = useState<ExtendedStatistics>({
    totalAnswered: 25,
    correctCount: 18,
    incorrectCount: 7,
    correctRate: 72,
    byDifficulty: {
      easy: { total: 10, correct: 9, rate: 90 },
      medium: { total: 10, correct: 7, rate: 70 },
      hard: { total: 5, correct: 2, rate: 40 },
    },
    recentTen: [true, false, true, true, false, true, true, true, false, true],
    currentStreak: 2,
    bestStreak: 5,
    totalStudyTime: 1845, // 30分45秒
    sessionStartTime: Date.now(),
  });

  const handleReset = () => {
    setStatistics({
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
    });
  };

  const addCorrectAnswer = (difficulty: 'easy' | 'medium' | 'hard') => {
    setStatistics((prev) => {
      const newRecentTen = [...prev.recentTen, true].slice(-10);
      const newCorrectCount = prev.correctCount + 1;
      const newTotalAnswered = prev.totalAnswered + 1;
      const newCorrectRate = (newCorrectCount / newTotalAnswered) * 100;

      const newDifficultyStats = {
        ...prev.byDifficulty[difficulty],
        total: prev.byDifficulty[difficulty].total + 1,
        correct: prev.byDifficulty[difficulty].correct + 1,
      };
      newDifficultyStats.rate = (newDifficultyStats.correct / newDifficultyStats.total) * 100;

      const newCurrentStreak = prev.currentStreak + 1;
      const newBestStreak = Math.max(prev.bestStreak, newCurrentStreak);

      return {
        ...prev,
        totalAnswered: newTotalAnswered,
        correctCount: newCorrectCount,
        incorrectCount: prev.incorrectCount,
        correctRate: newCorrectRate,
        byDifficulty: {
          ...prev.byDifficulty,
          [difficulty]: newDifficultyStats,
        },
        recentTen: newRecentTen,
        currentStreak: newCurrentStreak,
        bestStreak: newBestStreak,
        totalStudyTime: prev.totalStudyTime + 30, // 30秒追加
      };
    });
  };

  const addIncorrectAnswer = (difficulty: 'easy' | 'medium' | 'hard') => {
    setStatistics((prev) => {
      const newRecentTen = [...prev.recentTen, false].slice(-10);
      const newIncorrectCount = prev.incorrectCount + 1;
      const newTotalAnswered = prev.totalAnswered + 1;
      const newCorrectRate = (prev.correctCount / newTotalAnswered) * 100;

      const newDifficultyStats = {
        ...prev.byDifficulty[difficulty],
        total: prev.byDifficulty[difficulty].total + 1,
      };
      newDifficultyStats.rate = (newDifficultyStats.correct / newDifficultyStats.total) * 100;

      return {
        ...prev,
        totalAnswered: newTotalAnswered,
        correctCount: prev.correctCount,
        incorrectCount: newIncorrectCount,
        correctRate: newCorrectRate,
        byDifficulty: {
          ...prev.byDifficulty,
          [difficulty]: newDifficultyStats,
        },
        recentTen: newRecentTen,
        currentStreak: 0, // 連続正解がリセット
        totalStudyTime: prev.totalStudyTime + 30, // 30秒追加
      };
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          DetailedStatistics コンポーネント例
        </h1>

        {/* コントロールパネル */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            テストコントロール
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <button
              onClick={() => addCorrectAnswer('easy')}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              初級正解を追加
            </button>
            <button
              onClick={() => addCorrectAnswer('medium')}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              中級正解を追加
            </button>
            <button
              onClick={() => addCorrectAnswer('hard')}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              上級正解を追加
            </button>
            <button
              onClick={() => addIncorrectAnswer('easy')}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              初級不正解を追加
            </button>
            <button
              onClick={() => addIncorrectAnswer('medium')}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              中級不正解を追加
            </button>
            <button
              onClick={() => addIncorrectAnswer('hard')}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              上級不正解を追加
            </button>
          </div>
        </div>

        {/* DetailedStatistics コンポーネント */}
        <DetailedStatistics statistics={statistics} onReset={handleReset} />

        {/* 説明 */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            コンポーネントの特徴
          </h3>
          <ul className="list-disc list-inside text-blue-700 space-y-1">
            <li>難易度別の正解率を表示（要件 3.1）</li>
            <li>最近10問の結果を視覚的に表示（要件 3.2）</li>
            <li>現在の連続正解数と最高連続正解数を表示（要件 3.3）</li>
            <li>学習時間を人間が読みやすい形式で表示（要件 3.4）</li>
            <li>アニメーション付きで統計の変化を表示（要件 3.5）</li>
            <li>正解率に応じた励ましメッセージを表示</li>
            <li>レスポンシブデザインでモバイルにも対応</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
