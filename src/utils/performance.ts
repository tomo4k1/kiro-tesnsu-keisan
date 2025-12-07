/**
 * パフォーマンス測定ユーティリティ
 * 
 * 要件 9.1, 9.2, 9.3 のレスポンス時間を測定・検証するためのツール
 */

/**
 * 関数の実行時間を測定する
 * @param fn 測定する関数
 * @param label ラベル（ログ出力用）
 * @returns 関数の実行結果と実行時間（ミリ秒）
 */
export function measurePerformance<T>(
  fn: () => T,
  label: string
): { result: T; duration: number } {
  const startTime = performance.now();
  const result = fn();
  const endTime = performance.now();
  const duration = endTime - startTime;

  // 開発環境でのみログ出力
  if (import.meta.env.DEV) {
    console.log(`[Performance] ${label}: ${duration.toFixed(2)}ms`);
  }

  return { result, duration };
}

/**
 * 非同期関数の実行時間を測定する
 * @param fn 測定する非同期関数
 * @param label ラベル（ログ出力用）
 * @returns 関数の実行結果と実行時間（ミリ秒）
 */
export async function measurePerformanceAsync<T>(
  fn: () => Promise<T>,
  label: string
): Promise<{ result: T; duration: number }> {
  const startTime = performance.now();
  const result = await fn();
  const endTime = performance.now();
  const duration = endTime - startTime;

  // 開発環境でのみログ出力
  if (import.meta.env.DEV) {
    console.log(`[Performance] ${label}: ${duration.toFixed(2)}ms`);
  }

  return { result, duration };
}

/**
 * パフォーマンス要件を検証する
 * @param duration 実行時間（ミリ秒）
 * @param threshold 閾値（ミリ秒）
 * @param label ラベル
 * @returns 要件を満たしている場合true
 */
export function validatePerformanceRequirement(
  duration: number,
  threshold: number,
  label: string
): boolean {
  const isValid = duration <= threshold;

  if (import.meta.env.DEV) {
    if (isValid) {
      console.log(`[Performance] ✓ ${label}: ${duration.toFixed(2)}ms (閾値: ${threshold}ms)`);
    } else {
      console.warn(
        `[Performance] ✗ ${label}: ${duration.toFixed(2)}ms (閾値: ${threshold}ms を超過)`
      );
    }
  }

  return isValid;
}

/**
 * パフォーマンス要件の閾値（ミリ秒）
 */
export const PERFORMANCE_THRESHOLDS = {
  /** 回答判定のレスポンス時間（要件 9.1） */
  ANSWER_CHECK: 1000,
  /** 問題生成のレスポンス時間（要件 9.2） */
  PROBLEM_GENERATION: 1000,
  /** 初回読み込み時間（要件 9.3） */
  INITIAL_LOAD: 3000,
} as const;
