/**
 * レスポンシブデザインのテスト・デモ用コンポーネント
 * 
 * このコンポーネントは、実装されたレスポンシブデザイン機能を
 * 視覚的に確認するためのものです。
 */

import React from 'react';

export const ResponsiveExample: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* ヘッダー */}
        <header className="bg-white rounded-lg shadow-md p-4">
          <div className="header-container flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="header-title text-2xl font-bold text-gray-800">
                レスポンシブデザインテスト
              </h1>
              <p className="header-subtitle text-sm text-gray-600">
                画面サイズを変更して動作を確認してください
              </p>
            </div>
            <div className="header-buttons flex gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                ボタン1
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg">
                ボタン2
              </button>
            </div>
          </div>
        </header>

        {/* 統計グリッド */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-bold mb-4">統計情報（要件 5.3）</h2>
          <div className="statistics-grid grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-3xl font-bold text-blue-600">42</div>
              <div className="text-sm text-gray-600 mt-1">回答数</div>
            </div>
            <div className="flex flex-col items-center p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="text-3xl font-bold text-green-600">35</div>
              <div className="text-sm text-gray-600 mt-1">正解数</div>
            </div>
            <div className="flex flex-col items-center p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="text-3xl font-bold text-red-600">7</div>
              <div className="text-sm text-gray-600 mt-1">不正解数</div>
            </div>
            <div className="flex flex-col items-center p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-3xl font-bold text-purple-600">83.3%</div>
              <div className="text-sm text-gray-600 mt-1">正解率</div>
            </div>
          </div>
        </div>

        {/* 牌表示 */}
        <div className="hand-display-container bg-gradient-to-b from-green-50 to-green-100 rounded-lg shadow-md p-4">
          <h2 className="text-xl font-bold mb-4">牌表示（要件 5.1）</h2>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <div
                key={num}
                className="tile-component inline-flex items-center justify-center min-w-[2.5rem] h-14 px-2 border-2 rounded text-lg font-bold bg-white border-gray-400 text-gray-800"
              >
                {num}萬
              </div>
            ))}
          </div>
        </div>

        {/* 回答選択ボタン */}
        <div className="answer-selector-container bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">回答選択（要件 5.2）</h2>
          <div className="answer-selector-buttons flex flex-wrap gap-2">
            {[20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 110].map((fu) => (
              <button
                key={fu}
                className="px-4 py-3 rounded-lg font-semibold border-2 min-w-[5rem] bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300"
              >
                {fu}符
              </button>
            ))}
          </div>
        </div>

        {/* ブレークポイント情報 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">現在のブレークポイント</h2>
          <div className="space-y-2">
            <div className="block sm:hidden p-3 bg-red-100 rounded">
              📱 超小型モバイル（〜640px）
            </div>
            <div className="hidden sm:block md:hidden p-3 bg-yellow-100 rounded">
              📱 モバイル（640px〜768px）
            </div>
            <div className="hidden md:block lg:hidden p-3 bg-green-100 rounded">
              📱 タブレット（768px〜1024px）
            </div>
            <div className="hidden lg:block xl:hidden p-3 bg-blue-100 rounded">
              💻 デスクトップ（1024px〜1280px）
            </div>
            <div className="hidden xl:block p-3 bg-purple-100 rounded">
              🖥️ 大型デスクトップ（1280px〜）
            </div>
          </div>
        </div>

        {/* 横向き表示テスト */}
        <div className="landscape-optimized bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">横向き表示（要件 5.4）</h2>
          <p className="text-gray-600">
            デバイスを横向きにすると、レイアウトが自動的に最適化されます。
          </p>
          <div className="mt-4 p-4 bg-gray-50 rounded">
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
              <li>牌のサイズが縮小されます</li>
              <li>統計情報が横並びになります</li>
              <li>パディングとスペーシングが削減されます</li>
              <li>スクロールが最小化されます</li>
            </ul>
          </div>
        </div>

        {/* テスト手順 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">テスト手順</h2>
          <ol className="list-decimal list-inside space-y-3 text-gray-700">
            <li>
              <strong>モバイル表示:</strong> ブラウザの幅を640px以下にする
              <ul className="list-disc list-inside ml-6 mt-1 text-sm text-gray-600">
                <li>牌のサイズが小さくなることを確認</li>
                <li>統計が2列グリッドになることを確認</li>
                <li>ボタンが押しやすいサイズであることを確認</li>
              </ul>
            </li>
            <li>
              <strong>タブレット表示:</strong> ブラウザの幅を641px〜1024pxにする
              <ul className="list-disc list-inside ml-6 mt-1 text-sm text-gray-600">
                <li>牌のサイズが中間サイズになることを確認</li>
                <li>統計が4列グリッドになることを確認</li>
              </ul>
            </li>
            <li>
              <strong>横向き表示:</strong> デバイスツールバーで回転する
              <ul className="list-disc list-inside ml-6 mt-1 text-sm text-gray-600">
                <li>レイアウトが横向きに最適化されることを確認</li>
                <li>高さが効率的に使用されることを確認</li>
              </ul>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default ResponsiveExample;
