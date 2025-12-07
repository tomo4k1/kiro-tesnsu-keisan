import React from 'react';
import { Tooltip } from './Tooltip';

/**
 * StatisticsDisplayコンポーネントのProps
 */
interface StatisticsDisplayProps {
  totalAnswered: number;
  correctCount: number;
  incorrectCount: number;
}

/**
 * 統計情報を表示するコンポーネント
 * 要件 3.1, 3.2, 3.3, 3.5 を満たす
 */
export const StatisticsDisplay: React.FC<StatisticsDisplayProps> = ({
  totalAnswered,
  correctCount,
  incorrectCount,
}) => {
  // 正解率を計算（要件 3.3）
  const correctRate = totalAnswered > 0 ? (correctCount / totalAnswered) * 100 : 0;
  
  // 前回の値を保持して変更を検出（要件 3.5）
  const [prevTotalAnswered, setPrevTotalAnswered] = React.useState(totalAnswered);
  const [prevCorrectCount, setPrevCorrectCount] = React.useState(correctCount);
  const [prevIncorrectCount, setPrevIncorrectCount] = React.useState(incorrectCount);
  
  // 値が変更されたかを判定
  const totalChanged = totalAnswered !== prevTotalAnswered;
  const correctChanged = correctCount !== prevCorrectCount;
  const incorrectChanged = incorrectCount !== prevIncorrectCount;
  
  // 値が変更されたら前回の値を更新
  React.useEffect(() => {
    if (totalChanged) {
      const timer = setTimeout(() => setPrevTotalAnswered(totalAnswered), 400);
      return () => clearTimeout(timer);
    }
  }, [totalAnswered, totalChanged]);
  
  React.useEffect(() => {
    if (correctChanged) {
      const timer = setTimeout(() => setPrevCorrectCount(correctCount), 400);
      return () => clearTimeout(timer);
    }
  }, [correctCount, correctChanged]);
  
  React.useEffect(() => {
    if (incorrectChanged) {
      const timer = setTimeout(() => setPrevIncorrectCount(incorrectCount), 400);
      return () => clearTimeout(timer);
    }
  }, [incorrectCount, incorrectChanged]);

  return (
    <div className="w-full max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-md border border-gray-200" role="region" aria-label="統計情報">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span className="text-2xl" aria-hidden="true">📊</span>
        <span>統計情報</span>
      </h2>

      {/* 要件 5.3: モバイルで統計情報を縦方向に配置 */}
      <div className="statistics-grid grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* 回答数 */}
        <Tooltip tooltip="これまでに回答した問題の総数です。多く解くほど上達します。">
          <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg border border-blue-200" role="status" aria-label="回答数">
            <div className={`text-3xl font-bold text-blue-600 ${totalChanged ? 'animate-stat-update' : ''}`} aria-live="polite">
              {totalAnswered}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              回答数
            </div>
          </div>
        </Tooltip>

        {/* 正解数 */}
        <Tooltip tooltip="正しく回答できた問題の数です。この数値を増やすことが目標です。">
          <div className="flex flex-col items-center p-3 bg-green-50 rounded-lg border border-green-200" role="status" aria-label="正解数">
            <div className={`text-3xl font-bold text-green-600 ${correctChanged ? 'animate-stat-update' : ''}`} aria-live="polite">
              {correctCount}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              正解数
            </div>
          </div>
        </Tooltip>

        {/* 不正解数 */}
        <Tooltip tooltip="間違えた問題の数です。間違いから学ぶことで確実に成長できます。">
          <div className="flex flex-col items-center p-3 bg-red-50 rounded-lg border border-red-200" role="status" aria-label="不正解数">
            <div className={`text-3xl font-bold text-red-600 ${incorrectChanged ? 'animate-stat-update' : ''}`} aria-live="polite">
              {incorrectCount}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              不正解数
            </div>
          </div>
        </Tooltip>

        {/* 正解率 */}
        <Tooltip tooltip="全体の正解率です。60%以上を目指しましょう。80%以上なら優秀です！">
          <div className="flex flex-col items-center p-3 bg-purple-50 rounded-lg border border-purple-200" role="status" aria-label="正解率">
            <div className={`text-3xl font-bold text-purple-600 ${totalChanged ? 'animate-stat-update' : ''}`} aria-live="polite">
              {correctRate.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 mt-1">
              正解率
            </div>
          </div>
        </Tooltip>
      </div>

      {/* プログレスバー */}
      {totalAnswered > 0 && (
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>正解率の推移</span>
            <span>{correctCount} / {totalAnswered}</span>
          </div>
          <div 
            className="w-full h-4 bg-gray-200 rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={correctRate}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`正解率 ${correctRate.toFixed(1)}%`}
          >
            <div
              className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500 ease-out"
              style={{ width: `${correctRate}%` }}
            />
          </div>
        </div>
      )}

      {/* メッセージ */}
      {totalAnswered === 0 && (
        <div className="mt-4 text-center text-gray-500 text-sm">
          問題に回答すると統計情報が表示されます
        </div>
      )}

      {totalAnswered > 0 && (
        <div className="mt-4 text-center">
          {correctRate >= 80 ? (
            <div className="text-green-600 font-semibold">
              🎉 素晴らしい成績です！
            </div>
          ) : correctRate >= 60 ? (
            <div className="text-blue-600 font-semibold">
              👍 良い調子です！
            </div>
          ) : correctRate >= 40 ? (
            <div className="text-yellow-600 font-semibold">
              💪 もう少し頑張りましょう！
            </div>
          ) : (
            <div className="text-orange-600 font-semibold">
              📚 練習を続けましょう！
            </div>
          )}
        </div>
      )}
    </div>
  );
};
