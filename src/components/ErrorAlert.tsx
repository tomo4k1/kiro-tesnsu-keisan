import React, { useEffect, useRef } from 'react';
import type { ErrorInfo, ErrorSeverity } from '../types/errors';

/**
 * ErrorAlertのProps
 */
interface ErrorAlertProps {
  message: string;
  onClose?: () => void;
  type?: 'error' | 'warning' | 'info';
  suggestion?: string;
  autoDismiss?: boolean;
  autoDismissDelay?: number;
  onRetry?: () => void;
}

/**
 * ErrorInfoを使用したErrorAlertのProps
 */
interface ErrorAlertWithInfoProps {
  errorInfo: ErrorInfo;
  onClose?: () => void;
  autoDismiss?: boolean;
  autoDismissDelay?: number;
  onRetry?: () => void;
}

/**
 * エラーメッセージを表示するアラートコンポーネント
 * 
 * 要件9.1: 具体的なエラーメッセージを表示
 * 要件9.2: 推奨される対処法を提示
 * 要件9.4: ネットワークエラー時に再試行オプションを提供
 * 要件9.5: 5秒後に自動的に閉じる（重大でないエラー）
 */
export const ErrorAlert: React.FC<ErrorAlertProps> = ({ 
  message, 
  onClose,
  type = 'error',
  suggestion,
  autoDismiss = false,
  autoDismissDelay = 5000,
  onRetry,
}) => {
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // 自動消去が有効で、criticalでない場合（要件9.5）
    if (autoDismiss && onClose && type !== 'error') {
      timerRef.current = window.setTimeout(() => {
        onClose();
      }, autoDismissDelay);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [autoDismiss, autoDismissDelay, onClose, type]);

  const styles = {
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: '❌',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: '⚠️',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: 'ℹ️',
    },
  };

  const style = styles[type];

  return (
    <div 
      className={`${style.bg} ${style.border} border rounded-lg p-4 mb-4 animate-slideDown`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0" aria-hidden="true">{style.icon}</span>
        <div className="flex-1">
          {/* 要件9.1: 具体的なエラーメッセージ */}
          <p className={`${style.text} font-medium mb-1`}>
            {message}
          </p>
          {/* 要件9.2: 推奨される対処法 */}
          {suggestion && (
            <p className={`${style.text} text-sm mt-2 opacity-90`}>
              💡 {suggestion}
            </p>
          )}
          {/* 要件9.4: ネットワークエラー時の再試行オプション */}
          {onRetry && (
            <button
              onClick={onRetry}
              className={`mt-3 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                type === 'error' 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : type === 'warning'
                  ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                type === 'error' ? 'focus:ring-red-500' : 
                type === 'warning' ? 'focus:ring-yellow-500' : 
                'focus:ring-blue-500'
              }`}
              aria-label="再試行"
            >
              🔄 再試行
            </button>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`${style.text} hover:opacity-70 transition-opacity flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded ${
              type === 'error' ? 'focus:ring-red-500' : 
              type === 'warning' ? 'focus:ring-yellow-500' : 
              'focus:ring-blue-500'
            }`}
            aria-label="アラートを閉じる"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * ErrorInfo型を使用したエラーアラートコンポーネント
 * 
 * ErrorHandlerクラスと統合し、エラーの自動記録と表示を管理します。
 * 要件9.1-9.5のすべてを満たします。
 */
export const ErrorAlertWithInfo: React.FC<ErrorAlertWithInfoProps> = ({
  errorInfo,
  onClose,
  autoDismiss = true,
  autoDismissDelay = 5000,
  onRetry,
}) => {
  const severityToType = (severity: ErrorSeverity): 'error' | 'warning' | 'info' => {
    if (severity === 'critical' || severity === 'error') return 'error';
    if (severity === 'warning') return 'warning';
    return 'info';
  };

  // criticalエラーとerrorは自動消去しない（要件9.5）
  const shouldAutoDismiss = autoDismiss && 
                           errorInfo.severity !== 'critical' && 
                           errorInfo.severity !== 'error';

  return (
    <ErrorAlert
      message={errorInfo.message}
      type={severityToType(errorInfo.severity)}
      suggestion={errorInfo.suggestion}
      onClose={onClose}
      autoDismiss={shouldAutoDismiss}
      autoDismissDelay={autoDismissDelay}
      onRetry={onRetry}
    />
  );
};
