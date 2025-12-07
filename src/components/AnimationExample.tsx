import React, { useState } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

/**
 * アニメーション効果のデモンストレーションコンポーネント
 * 
 * このコンポーネントは、タスク15で実装されたアニメーション効果を
 * 視覚的に確認するためのデモです。
 * 
 * 実装されたアニメーション:
 * - 正解時のアニメーション (animate-correct-shake, animate-correct-glow)
 * - 不正解時のアニメーション (animate-incorrect-shake, animate-incorrect-pulse)
 * - 統計更新時のアニメーション (animate-stat-update, animate-count-up)
 * - ローディングアニメーション (LoadingSpinner component)
 */
export const AnimationExample: React.FC = () => {
  const [showCorrect, setShowCorrect] = useState(false);
  const [showIncorrect, setShowIncorrect] = useState(false);
  const [statValue, setStatValue] = useState(0);
  const [showLoading, setShowLoading] = useState(false);

  const triggerCorrect = () => {
    setShowCorrect(true);
    setTimeout(() => setShowCorrect(false), 1000);
  };

  const triggerIncorrect = () => {
    setShowIncorrect(true);
    setTimeout(() => setShowIncorrect(false), 1000);
  };

  const updateStat = () => {
    setStatValue(prev => prev + 1);
  };

  const toggleLoading = () => {
    setShowLoading(!showLoading);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            アニメーション効果デモ
          </h1>
          <p className="text-gray-600 mb-4">
            タスク15で実装されたアニメーション効果を確認できます。
          </p>
        </div>

        {/* 正解・不正解アニメーション */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            正解・不正解アニメーション
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <button
                onClick={triggerCorrect}
                className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors"
              >
                正解アニメーションを表示
              </button>
              {showCorrect && (
                <div className="mt-4 p-6 bg-green-50 rounded-lg border-2 border-green-500 animate-correct-shake animate-correct-glow">
                  <div className="text-6xl text-center mb-2 animate-correct-shake">🎉</div>
                  <div className="text-2xl font-bold text-green-600 text-center animate-count-up">
                    正解！
                  </div>
                </div>
              )}
            </div>
            <div>
              <button
                onClick={triggerIncorrect}
                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
              >
                不正解アニメーションを表示
              </button>
              {showIncorrect && (
                <div className="mt-4 p-6 bg-red-50 rounded-lg border-2 border-red-500 animate-incorrect-shake animate-incorrect-pulse">
                  <div className="text-6xl text-center mb-2 animate-incorrect-shake">😔</div>
                  <div className="text-2xl font-bold text-red-600 text-center animate-count-up">
                    不正解
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 統計更新アニメーション */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            統計更新アニメーション
          </h2>
          <button
            onClick={updateStat}
            className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors mb-4"
          >
            統計を更新
          </button>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-4xl font-bold text-blue-600 animate-stat-update" key={statValue}>
                {statValue}
              </div>
              <div className="text-sm text-gray-600 mt-1">回答数</div>
            </div>
            <div className="flex flex-col items-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-4xl font-bold text-green-600 animate-count-up" key={statValue}>
                {Math.floor(statValue * 0.7)}
              </div>
              <div className="text-sm text-gray-600 mt-1">正解数</div>
            </div>
            <div className="flex flex-col items-center p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="text-4xl font-bold text-red-600 animate-count-up" key={statValue}>
                {Math.floor(statValue * 0.3)}
              </div>
              <div className="text-sm text-gray-600 mt-1">不正解数</div>
            </div>
            <div className="flex flex-col items-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-4xl font-bold text-purple-600 animate-stat-update" key={statValue}>
                70%
              </div>
              <div className="text-sm text-gray-600 mt-1">正解率</div>
            </div>
          </div>
        </div>

        {/* ローディングアニメーション */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            ローディングアニメーション
          </h2>
          <button
            onClick={toggleLoading}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors mb-4"
          >
            {showLoading ? 'ローディングを停止' : 'ローディングを表示'}
          </button>
          {showLoading && (
            <div className="space-y-6">
              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">スピナー</h3>
                <div className="flex justify-around">
                  <LoadingSpinner size="small" variant="spinner" />
                  <LoadingSpinner size="medium" variant="spinner" />
                  <LoadingSpinner size="large" variant="spinner" />
                </div>
              </div>
              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">ドット</h3>
                <div className="flex justify-around">
                  <LoadingSpinner size="small" variant="dots" />
                  <LoadingSpinner size="medium" variant="dots" />
                  <LoadingSpinner size="large" variant="dots" />
                </div>
              </div>
              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">パルス</h3>
                <div className="flex justify-around">
                  <LoadingSpinner size="small" variant="pulse" />
                  <LoadingSpinner size="medium" variant="pulse" />
                  <LoadingSpinner size="large" variant="pulse" />
                </div>
              </div>
              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">メッセージ付き</h3>
                <div className="flex justify-center">
                  <LoadingSpinner size="large" variant="spinner" message="問題を生成中..." />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* アニメーション一覧 */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            実装されたアニメーション一覧
          </h2>
          <div className="space-y-3 text-sm">
            <div className="p-3 bg-green-50 rounded border border-green-200">
              <strong className="text-green-700">正解時:</strong>
              <ul className="list-disc list-inside mt-2 text-gray-700">
                <li>animate-correct-shake: 揺れるアニメーション</li>
                <li>animate-correct-glow: 光るアニメーション</li>
                <li>animate-count-up: カウントアップアニメーション</li>
              </ul>
            </div>
            <div className="p-3 bg-red-50 rounded border border-red-200">
              <strong className="text-red-700">不正解時:</strong>
              <ul className="list-disc list-inside mt-2 text-gray-700">
                <li>animate-incorrect-shake: 激しく揺れるアニメーション</li>
                <li>animate-incorrect-pulse: パルスアニメーション</li>
              </ul>
            </div>
            <div className="p-3 bg-purple-50 rounded border border-purple-200">
              <strong className="text-purple-700">統計更新時:</strong>
              <ul className="list-disc list-inside mt-2 text-gray-700">
                <li>animate-stat-update: スケールアニメーション</li>
                <li>animate-count-up: フェードインアニメーション</li>
              </ul>
            </div>
            <div className="p-3 bg-blue-50 rounded border border-blue-200">
              <strong className="text-blue-700">ローディング:</strong>
              <ul className="list-disc list-inside mt-2 text-gray-700">
                <li>LoadingSpinner: 3種類のバリエーション（spinner, dots, pulse）</li>
                <li>animate-spin: 回転アニメーション</li>
                <li>animate-bounce-slow: バウンスアニメーション</li>
                <li>animate-pulse-slow: パルスアニメーション</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
