/**
 * 牌ソート機能
 * 
 * 麻雀の牌を標準的な順序でソートするためのユーティリティ
 * - 萬子 → 筒子 → 索子 → 風牌 → 役牌の順序
 * - 同種牌は数字の昇順
 * - 赤ドラは通常の5と同じ位置に配置
 */

import type { Tile, TileType, HonorType } from '../types';

/**
 * 牌タイプの優先順位
 */
const TILE_TYPE_ORDER: Record<TileType, number> = {
  man: 0,   // 萬子
  pin: 1,   // 筒子
  sou: 2,   // 索子
  honor: 3, // 字牌（風牌・役牌）
};

/**
 * 字牌の優先順位
 * 風牌（東→南→西→北）→ 役牌（白→發→中）
 */
const HONOR_ORDER: Record<HonorType, number> = {
  east: 0,   // 東
  south: 1,  // 南
  west: 2,   // 西
  north: 3,  // 北
  white: 4,  // 白
  green: 5,  // 發
  red: 6,    // 中
};

/**
 * 牌を標準的な順序でソート
 * 
 * ソート順序:
 * 1. 萬子（1-9）
 * 2. 筒子（1-9）
 * 3. 索子（1-9）
 * 4. 風牌（東→南→西→北）
 * 5. 役牌（白→發→中）
 * 
 * 同種の牌は数字の昇順、赤ドラは通常の5と同じ位置に配置
 * 
 * @param tiles - ソート対象の牌の配列
 * @returns ソート済みの牌の配列（元の配列は変更されない）
 * 
 * @example
 * const tiles = [
 *   { type: 'honor', honor: 'white' },
 *   { type: 'man', value: 5, isRed: true },
 *   { type: 'pin', value: 3 },
 *   { type: 'man', value: 1 },
 *   { type: 'honor', honor: 'east' },
 * ];
 * const sorted = sortTiles(tiles);
 * // => [
 * //   { type: 'man', value: 1 },
 * //   { type: 'man', value: 5, isRed: true },
 * //   { type: 'pin', value: 3 },
 * //   { type: 'honor', honor: 'east' },
 * //   { type: 'honor', honor: 'white' },
 * // ]
 */
export function sortTiles(tiles: Tile[]): Tile[] {
  // 元の配列を変更しないようにコピーを作成
  return [...tiles].sort((a, b) => {
    // 1. タイプの優先順位で比較
    const typeCompare = TILE_TYPE_ORDER[a.type] - TILE_TYPE_ORDER[b.type];
    if (typeCompare !== 0) {
      return typeCompare;
    }
    
    // 2. 数牌の場合は数値で比較
    if (a.type !== 'honor') {
      const aValue = a.value || 0;
      const bValue = b.value || 0;
      
      // 数値が同じ場合、赤ドラと通常牌の順序は維持（安定ソート）
      return aValue - bValue;
    }
    
    // 3. 字牌の場合は特定の順序で比較
    const aHonorOrder = HONOR_ORDER[a.honor!];
    const bHonorOrder = HONOR_ORDER[b.honor!];
    return aHonorOrder - bHonorOrder;
  });
}

/**
 * 牌の配列を種類別にグループ化してソート
 * 
 * @param tiles - ソート対象の牌の配列
 * @returns 種類別にグループ化された牌
 * 
 * @example
 * const tiles = [
 *   { type: 'man', value: 5 },
 *   { type: 'pin', value: 3 },
 *   { type: 'honor', honor: 'east' },
 * ];
 * const grouped = groupAndSortTiles(tiles);
 * // => {
 * //   man: [{ type: 'man', value: 5 }],
 * //   pin: [{ type: 'pin', value: 3 }],
 * //   sou: [],
 * //   wind: [{ type: 'honor', honor: 'east' }],
 * //   dragon: [],
 * // }
 */
export function groupAndSortTiles(tiles: Tile[]): {
  man: Tile[];
  pin: Tile[];
  sou: Tile[];
  wind: Tile[];
  dragon: Tile[];
} {
  const sorted = sortTiles(tiles);
  
  const result = {
    man: [] as Tile[],
    pin: [] as Tile[],
    sou: [] as Tile[],
    wind: [] as Tile[],
    dragon: [] as Tile[],
  };
  
  for (const tile of sorted) {
    if (tile.type === 'man') {
      result.man.push(tile);
    } else if (tile.type === 'pin') {
      result.pin.push(tile);
    } else if (tile.type === 'sou') {
      result.sou.push(tile);
    } else if (tile.type === 'honor') {
      // 風牌と役牌を分類
      if (['east', 'south', 'west', 'north'].includes(tile.honor!)) {
        result.wind.push(tile);
      } else {
        result.dragon.push(tile);
      }
    }
  }
  
  return result;
}
