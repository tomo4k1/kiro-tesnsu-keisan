import React from 'react';

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
 * 要件 3.1, 3.2, 3.3 を満たす
 */
export const StatisticsDisplay: React.FC<StatisticsDisplayProps> = ({
  totalAnswered,
  correctCount,
  incorrectCount,
}) => {
  // 正解率を計算（要件 3.3）
  const correctRate = totalAnswered > 0 ? (correctCount / totalAnswered) * 100 : 0;

  return (
    <div className="w-full max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span className="text-2xl">📊</span>
        <span>統計情報</span>
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* 回答数 */}
        <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-3xl font-bold text-blue-600">
            {totalAnswered}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            回答数
          </div>
        </div>

        {/* 正解数 */}
        <div className="flex flex-col items-center p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="text-3xl font-bold text-green-600">
            {correctCount}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            正解数
          </div>
        </div>

        {/* 不正解数 */}
        <div className="flex flex-col items-center p-3 bg-red-50 rounded-lg border border-red-200">
          <div className="text-3xl font-bold text-red-600">
            {incorrectCount}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            不正解数
          </div>
        </div>

        {/* 正解率 */}
        <div className="flex flex-col items-center p-3 bg-purple-50 rounded-lg border border-purple-200">
          <div className="text-3xl font-bold text-purple-600">
            {correctRate.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600 mt-1">
            正解率
          </div>
        </div>
      </div>

      {/* プログレスバー */}
      {totalAnswered > 0 && (
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>正解率の推移</span>
            <span>{correctCount} / {totalAnswered}</span>
          </div>
          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
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
