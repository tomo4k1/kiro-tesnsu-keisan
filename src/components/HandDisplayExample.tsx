import React from 'react';
import { HandDisplay } from './HandDisplay';
import type { Hand } from '../types';

/**
 * HandDisplayコンポーネントの使用例
 * 状態バッジの統合を示すデモ
 */
export const HandDisplayExample: React.FC = () => {
  // 門前の手牌の例
  const menzenHand: Hand = {
    closedTiles: [
      { type: 'man', value: 1 },
      { type: 'man', value: 2 },
      { type: 'man', value: 3 },
      { type: 'pin', value: 5, isRed: true },
      { type: 'pin', value: 5 },
      { type: 'pin', value: 5 },
      { type: 'sou', value: 7 },
      { type: 'sou', value: 8 },
      { type: 'sou', value: 9 },
      { type: 'honor', honor: 'white' },
      { type: 'honor', honor: 'white' },
      { type: 'honor', honor: 'white' },
    ],
    melds: [],
    winningTile: { type: 'man', value: 1 },
    isDealer: false,
    winType: 'tsumo',
    prevalentWind: 'east',
    seatWind: 'south',
    dora: [{ type: 'man', value: 9 }],
  };

  // 鳴きありの手牌の例
  const openHand: Hand = {
    closedTiles: [
      { type: 'man', value: 2 },
      { type: 'man', value: 3 },
      { type: 'man', value: 4 },
      { type: 'pin', value: 6 },
      { type: 'pin', value: 7 },
      { type: 'pin', value: 8 },
    ],
    melds: [
      {
        type: 'pon',
        tiles: [
          { type: 'honor', honor: 'east' },
          { type: 'honor', honor: 'east' },
          { type: 'honor', honor: 'east' },
        ],
      },
      {
        type: 'chi',
        tiles: [
          { type: 'sou', value: 1 },
          { type: 'sou', value: 2 },
          { type: 'sou', value: 3 },
        ],
      },
    ],
    winningTile: { type: 'man', value: 1 },
    isDealer: true,
    winType: 'ron',
    prevalentWind: 'east',
    seatWind: 'east',
    dora: [{ type: 'pin', value: 5 }],
  };

  return (
    <div className="space-y-8 p-8 bg-gray-50 min-h-screen">
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          HandDisplay with StatusBadge Integration
        </h2>
        <p className="text-gray-600 mb-6">
          要件 13.1, 13.3: 状態バッジが目立つ位置に表示され、手牌の状態を視覚的に示します
        </p>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-3 text-gray-700">
          門前の手牌（「門前」バッジ表示）
        </h3>
        <HandDisplay hand={menzenHand} correctScore={5200} />
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-3 text-gray-700">
          鳴きありの手牌（「鳴き」バッジ表示）
        </h3>
        <HandDisplay hand={openHand} correctScore={7700} />
      </div>
    </div>
  );
};
