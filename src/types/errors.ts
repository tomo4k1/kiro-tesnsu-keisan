/**
 * エラー種別の定義
 */
export enum ErrorType {
  INVALID_HAND = 'INVALID_HAND',
  CALCULATION_ERROR = 'CALCULATION_ERROR',
  STORAGE_ERROR = 'STORAGE_ERROR',
  GENERATION_ERROR = 'GENERATION_ERROR',
  INVALID_SELECTION = 'INVALID_SELECTION',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * エラーの重要度
 */
export type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';

/**
 * エラー情報
 */
export interface ErrorInfo {
  code: string;
  message: string;
  suggestion: string;
  severity: ErrorSeverity;
  timestamp: number;
  context?: Record<string, unknown>;
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

/**
 * エラーハンドラークラス
 * エラーの記録、表示、回復を管理
 */
export class ErrorHandler {
  private errorLog: ErrorInfo[] = [];
  private maxLogSize = 100;
  private onErrorCallback?: (error: ErrorInfo) => void;

  /**
   * エラーコールバックを設定
   */
  setErrorCallback(callback: (error: ErrorInfo) => void): void {
    this.onErrorCallback = callback;
  }

  /**
   * エラーを記録
   */
  logError(error: ErrorInfo): void {
    // エラーログに追加
    this.errorLog.push(error);
    
    // ログサイズを制限
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog.shift();
    }

    // コンソールに出力
    const logMethod = error.severity === 'critical' || error.severity === 'error' 
      ? console.error 
      : error.severity === 'warning' 
      ? console.warn 
      : console.info;

    logMethod(`[${error.severity.toUpperCase()}] ${error.code}: ${error.message}`);
    if (error.context) {
      console.log('Context:', error.context);
    }
  }

  /**
   * エラーメッセージを表示
   */
  showError(error: ErrorInfo): void {
    // エラーを記録
    this.logError(error);

    // コールバックを呼び出し
    if (this.onErrorCallback) {
      this.onErrorCallback(error);
    }
  }

  /**
   * エラーから回復
   */
  recover(error: ErrorInfo): void {
    console.log(`Recovering from error: ${error.code}`);
    // 回復処理は呼び出し側で実装
  }

  /**
   * 再試行
   */
  async retry<T>(
    action: () => Promise<T>,
    maxAttempts: number = 3,
    delayMs: number = 1000
  ): Promise<T> {
    let lastError: unknown;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await action();
      } catch (error) {
        lastError = error;
        console.warn(`Attempt ${attempt}/${maxAttempts} failed:`, error);

        if (attempt < maxAttempts) {
          // 次の試行前に待機
          await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
        }
      }
    }

    throw lastError;
  }

  /**
   * エラーログを取得
   */
  getErrorLog(): ErrorInfo[] {
    return [...this.errorLog];
  }

  /**
   * エラーログをクリア
   */
  clearErrorLog(): void {
    this.errorLog = [];
  }

  /**
   * エラー情報を作成
   */
  createErrorInfo(
    code: string,
    message: string,
    suggestion: string,
    severity: ErrorSeverity = 'error',
    context?: Record<string, unknown>
  ): ErrorInfo {
    return {
      code,
      message,
      suggestion,
      severity,
      timestamp: Date.now(),
      context,
    };
  }

  /**
   * 既知のエラータイプからErrorInfoを作成
   */
  fromAppError(error: AppError): ErrorInfo {
    const errorMap: Record<ErrorType, { message: string; suggestion: string; severity: ErrorSeverity }> = {
      [ErrorType.INVALID_HAND]: {
        message: '手牌データが無効です',
        suggestion: '新しい問題を生成してください',
        severity: 'error',
      },
      [ErrorType.CALCULATION_ERROR]: {
        message: '点数計算でエラーが発生しました',
        suggestion: '問題をスキップして次の問題に進んでください',
        severity: 'error',
      },
      [ErrorType.STORAGE_ERROR]: {
        message: '設定の保存に失敗しました',
        suggestion: 'ブラウザのストレージ設定を確認してください',
        severity: 'warning',
      },
      [ErrorType.GENERATION_ERROR]: {
        message: '問題の生成に失敗しました',
        suggestion: 'もう一度お試しください。問題が続く場合はページを再読み込みしてください',
        severity: 'error',
      },
      [ErrorType.INVALID_SELECTION]: {
        message: '無効な選択です',
        suggestion: '符・飜数・点数のすべてを選択してください',
        severity: 'warning',
      },
      [ErrorType.NETWORK_ERROR]: {
        message: 'ネットワークエラーが発生しました',
        suggestion: 'インターネット接続を確認して、再試行してください',
        severity: 'error',
      },
      [ErrorType.UNKNOWN_ERROR]: {
        message: '予期しないエラーが発生しました',
        suggestion: 'ページを再読み込みしてください。問題が続く場合はサポートにお問い合わせください',
        severity: 'critical',
      },
    };

    const errorInfo = errorMap[error.type] || errorMap[ErrorType.UNKNOWN_ERROR];

    return this.createErrorInfo(
      error.type,
      error.message || errorInfo.message,
      errorInfo.suggestion,
      errorInfo.severity,
      error.originalError ? { originalError: String(error.originalError) } : undefined
    );
  }

  /**
   * 不明なエラーからErrorInfoを作成
   */
  fromUnknownError(error: unknown, context?: Record<string, unknown>): ErrorInfo {
    if (error instanceof AppError) {
      return this.fromAppError(error);
    }

    const message = error instanceof Error ? error.message : '予期しないエラーが発生しました';
    
    return this.createErrorInfo(
      ErrorType.UNKNOWN_ERROR,
      message,
      'ページを再読み込みしてください。問題が続く場合はサポートにお問い合わせください',
      'error',
      context
    );
  }
}

// グローバルなエラーハンドラーインスタンス
export const errorHandler = new ErrorHandler();
