import React from 'react';
import { TutorialOverlay } from './TutorialOverlay';
import { useTutorial } from '../hooks/useTutorial';
import type { TutorialStep } from '../types';

/**
 * チュートリアル機能のデモコンポーネント
 */
export const TutorialExample: React.FC = () => {
  // チュートリアルステップの定義
  const tutorialSteps: TutorialStep[] = [
    {
      id: 'welcome',
      title: 'ようこそ！',
      description: '麻雀点数計算クイズへようこそ！このチュートリアルでは、アプリの使い方を簡単に説明します。',
      position: 'center',
    },
    {
      id: 'hand-display',
      title: '手牌の表示',
      description: 'ここに問題の手牌が表示されます。牌は自動的に整列され、状態バッジで立直や鳴きの有無が分かります。',
      targetElement: '#hand-display-demo',
      position: 'bottom',
    },
    {
      id: 'answer-selector',
      title: '回答の選択',
      description: '符・飜数・点数を選択して回答します。キーボードの数字キーでも選択できます。',
      targetElement: '#answer-selector-demo',
      position: 'top',
    },
    {
      id: 'statistics',
      title: '統計情報',
      description: 'あなたの学習進捗を確認できます。難易度別の正解率や連続正解数が表示されます。',
      targetElement: '#statistics-demo',
      position: 'left',
    },
    {
      id: 'settings',
      title: '設定',
      description: 'アニメーション速度やフォントサイズなど、お好みに合わせてカスタマイズできます。',
      targetElement: '#settings-demo',
      position: 'left',
    },
    {
      id: 'complete',
      title: '準備完了！',
      description: 'これでチュートリアルは完了です。さっそく問題を解いて、麻雀の点数計算をマスターしましょう！',
      position: 'center',
    },
  ];

  const {
    currentStep,
    isVisible,
    settings,
    handleNext,
    handlePrevious,
    handleSkip,
    handleComplete,
    showTutorial,
    resetTutorial,
  } = useTutorial(tutorialSteps);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          チュートリアル機能デモ
        </h1>

        {/* コントロールパネル */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">コントロール</h2>
          <div className="flex gap-4 mb-4">
            <button
              onClick={showTutorial}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              チュートリアルを表示
            </button>
            <button
              onClick={resetTutorial}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              チュートリアルをリセット
            </button>
          </div>
          <div className="text-sm text-gray-600">
            <p>完了状態: {settings.completed ? '完了' : '未完了'}</p>
            <p>スキップ状態: {settings.skipped ? 'スキップ済み' : '未スキップ'}</p>
            <p>バージョン: {settings.lastShownVersion || '未設定'}</p>
          </div>
        </div>

        {/* デモUI要素 */}
        <div className="space-y-6">
          {/* 手牌表示デモ */}
          <div
            id="hand-display-demo"
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-lg font-semibold mb-2">手牌表示</h3>
            <div className="flex gap-2">
              {['🀇', '🀈', '🀉', '🀊', '🀋', '🀌', '🀍', '🀎', '🀏', '🀐', '🀑', '🀒', '🀓'].map((tile, i) => (
                <div
                  key={i}
                  className="w-12 h-16 bg-gray-100 rounded flex items-center justify-center text-2xl"
                >
                  {tile}
                </div>
              ))}
            </div>
          </div>

          {/* 回答選択デモ */}
          <div
            id="answer-selector-demo"
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-lg font-semibold mb-4">回答選択</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">符</label>
                <select className="w-full px-3 py-2 border rounded-lg">
                  <option>30符</option>
                  <option>40符</option>
                  <option>50符</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">飜数</label>
                <select className="w-full px-3 py-2 border rounded-lg">
                  <option>1飜</option>
                  <option>2飜</option>
                  <option>3飜</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">点数</label>
                <select className="w-full px-3 py-2 border rounded-lg">
                  <option>1000点</option>
                  <option>2000点</option>
                  <option>3900点</option>
                </select>
              </div>
            </div>
          </div>

          {/* 統計情報デモ */}
          <div
            id="statistics-demo"
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-lg font-semibold mb-4">統計情報</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">正解率</p>
                <p className="text-2xl font-bold text-green-600">75%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">連続正解</p>
                <p className="text-2xl font-bold text-blue-600">5問</p>
              </div>
            </div>
          </div>

          {/* 設定デモ */}
          <div
            id="settings-demo"
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-lg font-semibold mb-4">設定</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">アニメーション</span>
                <input type="checkbox" className="toggle" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">音声フィードバック</span>
                <input type="checkbox" className="toggle" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* チュートリアルオーバーレイ */}
      <TutorialOverlay
        steps={tutorialSteps}
        currentStep={currentStep}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSkip={handleSkip}
        onComplete={handleComplete}
        isVisible={isVisible}
      />
    </div>
  );
};
