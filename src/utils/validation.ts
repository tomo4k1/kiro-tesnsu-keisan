import type { Hand, Tile, Problem } from '../types';
import { InvalidHandError, InvalidSelectionError } from '../types/errors';

/**
 * 手牌の妥当性を検証
 * @param hand 検証する手牌
 * @throws InvalidHandError 手牌が無効な場合
 */
export function validateHand(hand: Hand): void {
  // 牌数のチェック（13枚 + 和了牌1枚 = 14枚）
  const totalTiles = hand.closedTiles.length + 1; // +1 for winningTile
  const meldTiles = hand.melds.reduce((sum, meld) => sum + meld.tiles.length, 0);
  const total = totalTiles + meldTiles;
  
  if (total !== 14) {
    throw new InvalidHandError(
      `手牌の牌数が正しくありません（現在: ${total}枚、必要: 14枚）`
    );
  }
  
  // 和了牌の存在チェック
  if (!hand.winningTile) {
    throw new InvalidHandError('和了牌が指定されていません');
  }
  
  // 各牌の妥当性チェック
  const allTiles = [...hand.closedTiles, hand.winningTile];
  for (const meld of hand.melds) {
    allTiles.push(...meld.tiles);
  }
  
  for (const tile of allTiles) {
    validateTile(tile);
  }
  
  // ドラの妥当性チェック
  for (const dora of hand.dora) {
    validateTile(dora);
  }
}

/**
 * 牌の妥当性を検証
 * @param tile 検証する牌
 * @throws InvalidHandError 牌が無効な場合
 */
export function validateTile(tile: Tile): void {
  if (!tile.type) {
    throw new InvalidHandError('牌の種類が指定されていません');
  }
  
  if (tile.type === 'honor') {
    if (!tile.honor) {
      throw new InvalidHandError('字牌の種類が指定されていません');
    }
    const validHonors = ['east', 'south', 'west', 'north', 'white', 'green', 'red'];
    if (!validHonors.includes(tile.honor)) {
      throw new InvalidHandError(`無効な字牌: ${tile.honor}`);
    }
  } else {
    if (tile.value === undefined) {
      throw new InvalidHandError('数牌の値が指定されていません');
    }
    if (tile.value < 1 || tile.value > 9) {
      throw new InvalidHandError(`無効な数牌の値: ${tile.value}`);
    }
  }
}

/**
 * 問題データの妥当性を検証
 * @param problem 検証する問題
 * @throws InvalidHandError 問題が無効な場合
 */
export function validateProblem(problem: Problem): void {
  // 手牌の検証
  validateHand(problem.hand);
  
  // 符の検証
  if (problem.correctFu < 20 || problem.correctFu > 110) {
    throw new InvalidHandError(`無効な符の値: ${problem.correctFu}`);
  }
  
  // 飜数の検証
  if (problem.correctHan < 1 || problem.correctHan > 100) {
    throw new InvalidHandError(`無効な飜数の値: ${problem.correctHan}`);
  }
  
  // 点数の検証
  if (problem.correctScore < 1000) {
    throw new InvalidHandError(`無効な点数の値: ${problem.correctScore}`);
  }
  
  // 選択肢の検証
  if (problem.fuOptions.length === 0) {
    throw new InvalidHandError('符の選択肢が存在しません');
  }
  if (problem.hanOptions.length === 0) {
    throw new InvalidHandError('飜数の選択肢が存在しません');
  }
  if (problem.scoreOptions.length === 0) {
    throw new InvalidHandError('点数の選択肢が存在しません');
  }
  
  // 正解が選択肢に含まれているか検証
  if (!problem.fuOptions.includes(problem.correctFu)) {
    throw new InvalidHandError('符の正解が選択肢に含まれていません');
  }
  if (!problem.hanOptions.includes(problem.correctHan)) {
    throw new InvalidHandError('飜数の正解が選択肢に含まれていません');
  }
  if (!problem.scoreOptions.includes(problem.correctScore)) {
    throw new InvalidHandError('点数の正解が選択肢に含まれていません');
  }
}

/**
 * 選択値が選択肢に含まれているか検証
 * @param value 選択された値
 * @param options 選択肢の配列
 * @param type 選択肢の種類（エラーメッセージ用）
 * @throws InvalidSelectionError 選択が無効な場合
 */
export function validateSelection(
  value: number,
  options: number[],
  type: '符' | '飜数' | '点数'
): void {
  if (!options.includes(value)) {
    throw new InvalidSelectionError(
      `無効な${type}の選択です: ${value}（選択肢: ${options.join(', ')}）`
    );
  }
}

/**
 * 計算結果の妥当性を検証
 * @param value 計算結果
 * @param min 最小値
 * @param max 最大値
 * @param name 値の名前（エラーメッセージ用）
 * @throws Error 計算結果が範囲外の場合
 */
export function validateCalculationResult(
  value: number,
  min: number,
  max: number,
  name: string
): void {
  if (isNaN(value) || !isFinite(value)) {
    throw new Error(`${name}の計算結果が無効です: ${value}`);
  }
  
  if (value < min || value > max) {
    throw new Error(
      `${name}の計算結果が範囲外です: ${value}（範囲: ${min}〜${max}）`
    );
  }
}
