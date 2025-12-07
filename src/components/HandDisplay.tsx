import React, { useMemo } from 'react';
import type { Hand, Tile, Meld } from '../types';
import { sortTiles } from '../utils/tileSorter';
import { formatScore } from '../utils/scoreFormatter';
import { StatusBadge, type HandStatus } from './StatusBadge';

/**
 * HandDisplayコンポーネントのProps
 */
interface HandDisplayProps {
  hand: Hand;
  winningTile?: Tile;
  /** 正解の点数（表示用、オプション） */
  correctScore?: number;
}

/**
 * 牌を表示するための文字列を取得
 */
const getTileDisplay = (tile: Tile): string => {
  if (tile.type === 'honor') {
    const honorMap: Record<string, string> = {
      east: '東',
      south: '南',
      west: '西',
      north: '北',
      white: '白',
      green: '發',
      red: '中',
    };
    return honorMap[tile.honor!];
  }

  const typeMap: Record<string, string> = {
    man: '萬',
    pin: '筒',
    sou: '索',
  };

  return `${tile.value}${typeMap[tile.type]}`;
};

/**
 * 牌を表示するコンポーネント
 * 要件 5.1: モバイル端末で画面幅に応じて牌のサイズを調整
 */
const TileComponent: React.FC<{
  tile: Tile;
  isWinning?: boolean;
  className?: string;
}> = ({ tile, isWinning, className = '' }) => {
  const baseClasses = 'tile-component inline-flex items-center justify-center min-w-[2.5rem] h-14 px-2 border-2 rounded text-lg font-bold transition-all';
  const colorClasses = tile.isRed
    ? 'bg-red-50 border-red-400 text-red-700'
    : 'bg-white border-gray-400 text-gray-800';
  const winningClasses = isWinning
    ? 'ring-4 ring-yellow-400 shadow-lg scale-110'
    : '';

  return (
    <div className={`${baseClasses} ${colorClasses} ${winningClasses} ${className}`}>
      {getTileDisplay(tile)}
    </div>
  );
};

/**
 * 鳴きを表示するコンポーネント
 */
const MeldComponent: React.FC<{ meld: Meld }> = ({ meld }) => {
  const meldTypeMap: Record<string, string> = {
    chi: 'チー',
    pon: 'ポン',
    kan: '明カン',
    ankan: '暗カン',
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex gap-1">
        {meld.tiles.map((tile, index) => (
          <TileComponent key={index} tile={tile} className="scale-90" />
        ))}
      </div>
      <span className="text-xs text-gray-600 font-medium">
        {meldTypeMap[meld.type]}
      </span>
    </div>
  );
};

/**
 * 手牌の状態を判定する関数
 * 要件 13.1, 13.2, 13.3: 立直、鳴き、門前の状態を判定
 */
const determineHandStatus = (hand: Hand): HandStatus[] => {
  const statuses: HandStatus[] = [];
  
  // 鳴きの有無を判定（要件 13.2）
  const hasOpenMelds = hand.melds.length > 0;
  
  if (hasOpenMelds) {
    // 鳴きがある場合
    statuses.push('open');
  } else {
    // 門前の場合（要件 13.3）
    statuses.push('menzen');
  }
  
  // 注: 立直、一発、ダブル立直の情報は現在のHand型に含まれていないため、
  // 将来的にHand型が拡張された際に対応可能
  
  return statuses;
};

/**
 * 手牌を視覚的に表示するコンポーネント
 * 要件 2.1, 2.5, 11.1, 11.2, 12.1, 13.1, 13.3 を満たす
 */
export const HandDisplay: React.FC<HandDisplayProps> = ({ hand, winningTile, correctScore }) => {
  const actualWinningTile = winningTile || hand.winningTile;

  // 牌をソート（要件 12.1: 萬子→筒子→索子→風牌→役牌の順序）
  const sortedClosedTiles = useMemo(() => sortTiles(hand.closedTiles), [hand.closedTiles]);

  // 点数をフォーマット（要件 11.1, 11.2: 適切な形式で表示）
  const formattedScore = useMemo(() => {
    if (correctScore !== undefined) {
      return formatScore({
        isDealer: hand.isDealer,
        winType: hand.winType,
        score: correctScore,
      });
    }
    return null;
  }, [correctScore, hand.isDealer, hand.winType]);

  // 手牌の状態を判定（要件 13.1, 13.3）
  const handStatus = useMemo(() => determineHandStatus(hand), [hand]);

  return (
    <div className="hand-display-container w-full max-w-4xl mx-auto p-4 bg-gradient-to-b from-green-50 to-green-100 rounded-lg shadow-md" role="region" aria-label="手牌情報">
      {/* 状態バッジ（要件 13.1: 目立つ位置に表示） */}
      <div className="mb-3">
        <StatusBadge status={handStatus} size="medium" />
      </div>

      {/* 手牌情報 */}
      <div className="mb-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-700">家:</span>
          <span className="px-2 py-1 bg-white rounded border border-gray-300" role="status" aria-label={`家: ${hand.isDealer ? '親' : '子'}`}>
            {hand.isDealer ? '親' : '子'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-700">和了:</span>
          <span className="px-2 py-1 bg-white rounded border border-gray-300" role="status" aria-label={`和了: ${hand.winType === 'tsumo' ? 'ツモ' : 'ロン'}`}>
            {hand.winType === 'tsumo' ? 'ツモ' : 'ロン'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-700">場風:</span>
          <span className="px-2 py-1 bg-white rounded border border-gray-300" role="status" aria-label={`場風: ${hand.prevalentWind === 'east' ? '東' : hand.prevalentWind === 'south' ? '南' : hand.prevalentWind === 'west' ? '西' : '北'}`}>
            {hand.prevalentWind === 'east' ? '東' : hand.prevalentWind === 'south' ? '南' : hand.prevalentWind === 'west' ? '西' : '北'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-700">自風:</span>
          <span className="px-2 py-1 bg-white rounded border border-gray-300" role="status" aria-label={`自風: ${hand.seatWind === 'east' ? '東' : hand.seatWind === 'south' ? '南' : hand.seatWind === 'west' ? '西' : '北'}`}>
            {hand.seatWind === 'east' ? '東' : hand.seatWind === 'south' ? '南' : hand.seatWind === 'west' ? '西' : '北'}
          </span>
        </div>
        {/* 点数表示（要件 11.1, 11.2: 子のツモは「1300-2600」形式、親のツモは「2000オール」形式） */}
        {formattedScore && (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">点数:</span>
            <span className="px-2 py-1 bg-blue-50 rounded border border-blue-300 text-blue-700 font-semibold" role="status" aria-label={`点数: ${formattedScore.display}`}>
              {formattedScore.display}
            </span>
            {/* 詳細な支払い内訳を表示（子のツモ時） */}
            {formattedScore.nonDealerPayment && formattedScore.dealerPayment && (
              <span className="text-xs text-gray-600" aria-label={`子の支払い: ${formattedScore.nonDealerPayment}点、親の支払い: ${formattedScore.dealerPayment}点`}>
                （子: {formattedScore.nonDealerPayment}点 / 親: {formattedScore.dealerPayment}点）
              </span>
            )}
          </div>
        )}
      </div>

      {/* 手牌表示 */}
      <div className="space-y-4">
        {/* 鳴き */}
        {hand.melds.length > 0 && (
          <div className="flex flex-wrap gap-3 pb-3 border-b border-green-300" role="group" aria-label="鳴き">
            <span className="text-sm font-semibold text-gray-700 self-center">鳴き:</span>
            {hand.melds.map((meld, index) => (
              <MeldComponent key={index} meld={meld} />
            ))}
          </div>
        )}

        {/* 手牌（ソート済み - 要件 12.1） */}
        <div className="flex flex-wrap gap-2" role="group" aria-label="手牌">
          <span className="text-sm font-semibold text-gray-700 self-center">手牌:</span>
          {sortedClosedTiles.map((tile, index) => (
            <TileComponent key={index} tile={tile} />
          ))}
        </div>

        {/* 和了牌 */}
        <div className="flex flex-wrap gap-2 items-center pt-2 border-t border-green-300" role="group" aria-label="和了牌">
          <span className="text-sm font-semibold text-gray-700">和了牌:</span>
          <TileComponent tile={actualWinningTile} isWinning={true} />
        </div>

        {/* ドラ表示 */}
        {hand.dora.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center pt-2 border-t border-green-300" role="group" aria-label="ドラ表示牌">
            <span className="text-sm font-semibold text-gray-700">ドラ表示牌:</span>
            {hand.dora.map((tile, index) => (
              <TileComponent key={index} tile={tile} className="bg-yellow-50 border-yellow-400" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
