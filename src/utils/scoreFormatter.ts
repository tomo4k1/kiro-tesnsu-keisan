/**
 * 点数表示フォーマッター
 * 
 * 麻雀の点数を適切な形式で表示するためのユーティリティ
 * - 子のツモ: "1300-2600" 形式（子の支払い-親の支払い）
 * - 親のツモ: "2000オール" 形式
 * - ロン: "3900" 形式（単一数値）
 */

/**
 * 点数フォーマットのオプション
 */
export interface ScoreFormatOptions {
  /** 親かどうか */
  isDealer: boolean;
  /** 和了タイプ（ツモ/ロン） */
  winType: 'tsumo' | 'ron';
  /** 合計点数 */
  score: number;
}

/**
 * フォーマット済み点数
 */
export interface FormattedScore {
  /** 表示用文字列 */
  display: string;
  /** 親の支払い（子のツモ時のみ） */
  dealerPayment?: number;
  /** 子の支払い（子のツモ時のみ） */
  nonDealerPayment?: number;
  /** 合計点数 */
  totalScore: number;
}

/**
 * 点数を適切な形式でフォーマット
 * 
 * @param options - フォーマットオプション
 * @returns フォーマット済み点数
 * 
 * @example
 * // 子のツモ
 * formatScore({ isDealer: false, winType: 'tsumo', score: 5200 })
 * // => { display: "1300-2600", nonDealerPayment: 1300, dealerPayment: 2600, totalScore: 5200 }
 * 
 * @example
 * // 親のツモ
 * formatScore({ isDealer: true, winType: 'tsumo', score: 6000 })
 * // => { display: "2000オール", dealerPayment: 2000, totalScore: 6000 }
 * 
 * @example
 * // ロン
 * formatScore({ isDealer: false, winType: 'ron', score: 3900 })
 * // => { display: "3900", totalScore: 3900 }
 */
export function formatScore(options: ScoreFormatOptions): FormattedScore {
  const { isDealer, winType, score } = options;
  
  // ロンの場合は単一の数値
  if (winType === 'ron') {
    return {
      display: score.toString(),
      totalScore: score,
    };
  }
  
  // ツモの場合
  if (isDealer) {
    // 親のツモ: "2000オール"
    // 各子が支払う額（3人分で合計点数）
    const payment = Math.ceil(score / 3 / 100) * 100;
    return {
      display: `${payment}オール`,
      dealerPayment: payment,
      totalScore: score,
    };
  } else {
    // 子のツモ: "1300-2600"
    // 親が支払う額は子の2倍
    // 合計 = 親の支払い + 子の支払い × 2
    const nonDealerPayment = Math.ceil(score / 4 / 100) * 100;
    const dealerPayment = nonDealerPayment * 2;
    
    return {
      display: `${nonDealerPayment}-${dealerPayment}`,
      nonDealerPayment,
      dealerPayment,
      totalScore: score,
    };
  }
}
