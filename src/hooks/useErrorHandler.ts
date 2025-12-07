import { useState, useCallback, useEffect } from 'react';
import { errorHandler, type ErrorInfo } from '../types/errors';

/**
 * エラーハンドラーフックの戻り値
 */
interface UseErrorHandlerReturn {
  currentError: ErrorInfo | null;
  showError: (error: ErrorInfo) => void;
  clearError: () => void;
  retryAction: (() => void) | null;
  setRetryAction: (action: (() => void) | null) => void;
}

/**
 * エラーハンドリングを管理するカスタムフック
 * 
 * ErrorHandlerクラスと連携して、エラーの表示・記録・自動消去を管理します。
 */
export function useErrorHandler(): UseErrorHandlerReturn {
  const [currentError, setCurrentError] = useState<ErrorInfo | null>(null);
  const [retryAction, setRetryAction] = useState<(() => void) | null>(null);

  // ErrorHandlerのコールバックを設定
  useEffect(() => {
    errorHandler.setErrorCallback((error: ErrorInfo) => {
      setCurrentError(error);
    });
  }, []);

  /**
   * エラーを表示
   */
  const showError = useCallback((error: ErrorInfo) => {
    errorHandler.showError(error);
  }, []);

  /**
   * エラーをクリア
   */
  const clearError = useCallback(() => {
    setCurrentError(null);
    setRetryAction(null);
  }, []);

  return {
    currentError,
    showError,
    clearError,
    retryAction,
    setRetryAction,
  };
}
