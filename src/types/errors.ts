/**
 * エラー種別の定義
 */
export enum ErrorType {
  INVALID_HAND = 'INVALID_HAND',
  CALCULATION_ERROR = 'CALCULATION_ERROR',
  STORAGE_ERROR = 'STORAGE_ERROR',
  GENERATION_ERROR = 'GENERATION_ERROR',
  INVALID_SELECTION = 'INVALID_SELECTION',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * アプリケーションエラーの基底クラス
 */
export class AppError extends Error {
  constructor(
    public readonly type: ErrorType,
    message: string,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = 'AppError';
    
    // スタックトレースを保持
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

/**
 * 無効な手牌データエラー
 */
export class InvalidHandError extends AppError {
  constructor(message: string = '手牌データが無効です', originalError?: unknown) {
    super(ErrorType.INVALID_HAND, message, originalError);
    this.name = 'InvalidHandError';
  }
}

/**
 * 計算エラー
 */
export class CalculationError extends AppError {
  constructor(message: string = '点数計算でエラーが発生しました', originalError?: unknown) {
    super(ErrorType.CALCULATION_ERROR, message, originalError);
    this.name = 'CalculationError';
  }
}

/**
 * ストレージエラー
 */
export class StorageError extends AppError {
  constructor(message: string = '設定の保存に失敗しました', originalError?: unknown) {
    super(ErrorType.STORAGE_ERROR, message, originalError);
    this.name = 'StorageError';
  }
}

/**
 * 問題生成エラー
 */
export class GenerationError extends AppError {
  constructor(message: string = '問題の生成に失敗しました', originalError?: unknown) {
    super(ErrorType.GENERATION_ERROR, message, originalError);
    this.name = 'GenerationError';
  }
}

/**
 * 無効な選択エラー
 */
export class InvalidSelectionError extends AppError {
  constructor(message: string = '無効な選択です', originalError?: unknown) {
    super(ErrorType.INVALID_SELECTION, message, originalError);
    this.name = 'InvalidSelectionError';
  }
}

/**
 * エラーメッセージの定義
 */
export const ERROR_MESSAGES = {
  INVALID_HAND: '手牌データが無効です。新しい問題を生成します。',
  INVALID_HAND_TILE_COUNT: '手牌の牌数が正しくありません（14枚である必要があります）。',
  CALCULATION_ERROR: '点数計算でエラーが発生しました。',
  CALCULATION_FU_ERROR: '符の計算でエラーが発生しました。',
  CALCULATION_HAN_ERROR: '飜数の計算でエラーが発生しました。',
  CALCULATION_SCORE_ERROR: '点数の計算でエラーが発生しました。',
  STORAGE_ERROR: '設定の保存に失敗しました。デフォルト設定を使用します。',
  STORAGE_LOAD_ERROR: '設定の読み込みに失敗しました。デフォルト設定を使用します。',
  STORAGE_SAVE_ERROR: '設定の保存に失敗しました。',
  GENERATION_ERROR: '問題の生成に失敗しました。もう一度お試しください。',
  GENERATION_RETRY_ERROR: '問題の生成に複数回失敗しました。アプリケーションを再起動してください。',
  INVALID_SELECTION: '無効な選択です。もう一度選択してください。',
  INVALID_ANSWER: '符・飜数・点数のすべてを選択してください。',
  UNKNOWN_ERROR: '予期しないエラーが発生しました。',
} as const;

/**
 * エラーをユーザーフレンドリーなメッセージに変換
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return ERROR_MESSAGES.UNKNOWN_ERROR;
}

/**
 * エラーをコンソールにログ出力
 */
export function logError(error: unknown, context?: string): void {
  const prefix = context ? `[${context}]` : '';
  
  if (error instanceof AppError) {
    console.error(`${prefix} ${error.type}:`, error.message);
    if (error.originalError) {
      console.error('Original error:', error.originalError);
    }
  } else if (error instanceof Error) {
    console.error(`${prefix} Error:`, error.message);
    console.error('Stack:', error.stack);
  } else {
    console.error(`${prefix} Unknown error:`, error);
  }
}
