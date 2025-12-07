import React, { useState } from 'react';
import { ExplanationPanel } from './ExplanationPanel';
import type { Hand, Answer } from '../types';

/**
 * ExplanationPanelの使用例を示すコンポーネント
 */
export const ExplanationPanelExample: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  // サンプルの手牌データ
  const sampleHand: Hand = {
    closedTiles: [
      { type: 'man', value: 2 },
      { type: 'man', value: 3 },
      { type: 'man', value: 4 },
      { type: 'pin', value: 5 },
      { type: 'pin', value: 5 },
      { type: 'pin', value: 5 },
      { type: 'sou', value: 7 },
      { type: 'sou', value: 8 },
      { type: 'sou', value: 9 },
      { type: 'honor', honor: 'white' },
      { type: 'honor', honor: 'white' },
    ],
    melds: [
      {
        type: 'pon',
        tiles: [
          { type: 'honor', honor: 'red' },
          { type: 'honor', honor: 'red' },
          { type: 'honor', honor: 'red' },
        ],
      },
    ],
    winningTile: { type: 'honor', honor: 'white' },
    isDealer: false,
    winType: 'ron',
    prevalentWind: 'east',
    seatWind: 'south',
    dora: [{ type: 'man', value: 1 }],
  };

  const sampleAnswer: Answer = {
    fu: 40,
    han: 2,
    score: 2600,
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          ExplanationPanel コンポーネント例
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            解説パネルのデモ
          </h2>
          <p className="text-gray-600 mb-6">
            ボタンをクリックして解説パネルを表示します。
            符の内訳、役の一覧、計算過程が表示されます。
          </p>

          <button
            onClick={() => setIsVisible(true)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors duration-200"
          >
            解説を表示
          </button>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">サンプルデータ:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 符: {sampleAnswer.fu}符</li>
              <li>• 飜: {sampleAnswer.han}飜</li>
              <li>• 点数: {sampleAnswer.score}点</li>
              <li>• 和了方法: {sampleHand.winType === 'ron' ? 'ロン' : 'ツモ'}</li>
              <li>• 鳴き: {sampleHand.melds.length > 0 ? 'あり' : 'なし'}</li>
            </ul>
          </div>
        </div>

        <ExplanationPanel
          hand={sampleHand}
          correctAnswer={sampleAnswer}
          isVisible={isVisible}
          onClose={() => setIsVisible(false)}
        />
      </div>
    </div>
  );
};
