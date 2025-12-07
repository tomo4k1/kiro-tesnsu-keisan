import React from 'react';
import type { ExtendedStatistics } from '../types';
import { Tooltip } from './Tooltip';

/**
 * DetailedStatisticsコンポーネントのProps
 */
interface DetailedStatisticsProps {
  statistics: ExtendedStatistics;
  onReset?: () => void;
}

/**
 * 詳細統計情報を表示するコンポーネント
 * 
 * 要件:
 * - 3.1: 難易度別の正解率を表示
 * - 3.2: 最近の10問の正解率を表示
 * - 3.3: 連続正解数を表示
 * - 3.4: 学習時間を表示
 * - 3.5: アニメーション付きで統計の変化を表示
 */
export const DetailedStatistics: React.FC<DetailedStatisticsProps> = ({
  statistics,
  onReset,
}) => {
  /**
   * 学習時間を人間が読みやすい形式にフォーマット
   */
  const formatStudyTime = (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds}秒`;
    }
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes < 60) {
      return remainingSeconds > 0 
        ? `${minutes}分${remainingSeconds}秒`
        : `${minutes}分`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    return remainingMinutes > 0
      ? `${hours}時間${remainingMinutes}分`
      : `${hours}時間`;
  };

  /**
   * 難易度名を日本語に変換
   */
  const getDifficultyLabel = (difficulty: 'easy' | 'medium' | 'hard'): string => {
    const labels = {
      easy: '初級',
      medium: '中級',
      hard: '上級',
    };
    return labels[difficulty];
  };

  /**
   * 難易度に応じた色を取得
   */
  const getDifficultyColor = (difficulty: 'easy' | 'medium' | 'hard'): string => {
    const colors = {
      easy: 'text-green-600 bg-green-50 border-green-200',
      medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      hard: 'text-red-600 bg-red-50 border-red-200',
    };
    return colors[difficulty];
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-200" role="region" aria-label="詳細統計情報">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <span className="text-3xl" aria-hidden="true">📊</span>
          <span>詳細統計</span>
        </h2>
        {onReset && statistics.totalAnswered > 0 && (
          <button
            onClick={onReset}
            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            aria-label="統計をリセット"
          >
            リセット
          </button>
        )}
      </div>

      {/* 基本統計 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* 回答数 */}
        <Tooltip tooltip="これまでに回答した問題の総数です。継続的に学習することが上達の鍵です。">
          <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg border border-blue-200 transition-all duration-500 hover:shadow-md">
            <div className="text-4xl font-bold text-blue-600 animate-fade-in">
              {statistics.totalAnswered}
            </div>
            <div className="text-sm text-gray-600 mt-2">
              回答数
            </div>
          </div>
        </Tooltip>

        {/* 正解数 */}
        <Tooltip tooltip="正しく回答できた問題の数です。この数値を着実に増やしていきましょう。">
          <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg border border-green-200 transition-all duration-500 hover:shadow-md">
            <div className="text-4xl font-bold text-green-600 animate-fade-in">
              {statistics.correctCount}
            </div>
            <div className="text-sm text-gray-600 mt-2">
              正解数
            </div>
          </div>
        </Tooltip>

        {/* 正解率 */}
        <Tooltip tooltip="全体の正解率です。60%以上で良好、80%以上で優秀と言えます。">
          <div className="flex flex-col items-center p-4 bg-purple-50 rounded-lg border border-purple-200 transition-all duration-500 hover:shadow-md">
            <div className="text-4xl font-bold text-purple-600 animate-fade-in">
              {statistics.correctRate.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 mt-2">
              正解率
            </div>
          </div>
        </Tooltip>

        {/* 学習時間 (要件 3.4) */}
        <Tooltip tooltip="このセッションでの累計学習時間です。定期的に学習することで確実に上達します。">
          <div className="flex flex-col items-center p-4 bg-indigo-50 rounded-lg border border-indigo-200 transition-all duration-500 hover:shadow-md">
            <div className="text-4xl font-bold text-indigo-600 animate-fade-in">
              ⏱️
            </div>
            <div className="text-sm font-semibold text-indigo-600 mt-2">
              {formatStudyTime(statistics.totalStudyTime)}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              学習時間
            </div>
          </div>
        </Tooltip>
      </div>

      {/* 難易度別統計 (要件 3.1) */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span>📈</span>
          <span>難易度別正解率</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['easy', 'medium', 'hard'] as const).map((difficulty) => {
            const stats = statistics.byDifficulty[difficulty];
            const tooltips = {
              easy: '初級問題の正解率です。基本的な役と点数計算を扱います。',
              medium: '中級問題の正解率です。複数の役や複雑な符計算を含みます。',
              hard: '上級問題の正解率です。高度な役の組み合わせや特殊な状況を扱います。',
            };
            
            return (
              <Tooltip key={difficulty} tooltip={tooltips[difficulty]}>
                <div
                  className={`p-4 rounded-lg border ${getDifficultyColor(difficulty)} transition-all duration-500 hover:shadow-md`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">
                      {getDifficultyLabel(difficulty)}
                    </span>
                    <span className="text-2xl font-bold">
                      {stats.rate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-sm opacity-75">
                    {stats.correct} / {stats.total} 問
                  </div>
                  {/* プログレスバー */}
                  {stats.total > 0 && (
                    <div className="mt-2 w-full h-2 bg-white bg-opacity-50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-current transition-all duration-500 ease-out"
                        style={{ width: `${stats.rate}%` }}
                      />
                    </div>
                  )}
                </div>
              </Tooltip>
            );
          })}
        </div>
      </div>

      {/* 連続正解数 (要件 3.3) */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span>🔥</span>
          <span>連続正解</span>
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <Tooltip tooltip="現在連続で正解している問題数です。連続正解を維持して記録を伸ばしましょう！">
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200 transition-all duration-500 hover:shadow-md">
              <div className="text-3xl font-bold text-orange-600 animate-fade-in">
                {statistics.currentStreak}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                現在の連続正解数
              </div>
            </div>
          </Tooltip>
          <Tooltip tooltip="これまでの最高連続正解記録です。この記録を更新することを目標にしましょう！">
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 transition-all duration-500 hover:shadow-md">
              <div className="text-3xl font-bold text-amber-600 animate-fade-in">
                {statistics.bestStreak}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                最高連続正解数
              </div>
            </div>
          </Tooltip>
        </div>
      </div>

      {/* 最近10問 (要件 3.2) */}
      <div className="mb-6">
        <Tooltip tooltip="直近10問の正誤を時系列で表示します。○が正解、×が不正解です。最近の傾向を把握できます。">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span aria-hidden="true">📝</span>
            <span>最近10問の結果</span>
          </h3>
        </Tooltip>
        {statistics.recentTen.length > 0 ? (
          <div>
            <div className="flex gap-2 flex-wrap mb-2" role="list" aria-label="最近10問の結果">
              {statistics.recentTen.map((isCorrect, index) => (
                <div
                  key={index}
                  role="listitem"
                  className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold text-white transition-all duration-300 hover:scale-110 ${
                    isCorrect
                      ? 'bg-green-500 animate-fade-in'
                      : 'bg-red-500 animate-fade-in'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                  title={isCorrect ? '正解' : '不正解'}
                  aria-label={`問題${index + 1}: ${isCorrect ? '正解' : '不正解'}`}
                >
                  {isCorrect ? '○' : '×'}
                </div>
              ))}
            </div>
            <div className="text-sm text-gray-600" role="status" aria-live="polite">
              正解率: {' '}
              {statistics.recentTen.length > 0
                ? ((statistics.recentTen.filter(Boolean).length / statistics.recentTen.length) * 100).toFixed(1)
                : 0}%
              {' '}({statistics.recentTen.filter(Boolean).length} / {statistics.recentTen.length} 問)
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-4">
            まだ回答がありません
          </div>
        )}
      </div>

      {/* メッセージ */}
      {statistics.totalAnswered > 0 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <div className="text-center">
            {statistics.correctRate >= 80 ? (
              <div className="text-green-600 font-semibold text-lg animate-fade-in">
                🎉 素晴らしい成績です！この調子で頑張りましょう！
              </div>
            ) : statistics.correctRate >= 60 ? (
              <div className="text-blue-600 font-semibold text-lg animate-fade-in">
                👍 良い調子です！さらに上を目指しましょう！
              </div>
            ) : statistics.correctRate >= 40 ? (
              <div className="text-yellow-600 font-semibold text-lg animate-fade-in">
                💪 もう少し頑張りましょう！練習を続ければ必ず上達します！
              </div>
            ) : (
              <div className="text-orange-600 font-semibold text-lg animate-fade-in">
                📚 練習を続けましょう！一歩ずつ確実に進んでいきましょう！
              </div>
            )}
          </div>
        </div>
      )}

      {statistics.totalAnswered === 0 && (
        <div className="text-center text-gray-500 py-8">
          問題に回答すると詳細な統計情報が表示されます
        </div>
      )}
    </div>
  );
};
