import React from 'react';

/**
 * ErrorAlertのProps
 */
interface ErrorAlertProps {
  message: string;
  onClose?: () => void;
  type?: 'error' | 'warning' | 'info';
}

/**
 * エラーメッセージを表示するアラートコンポーネント
 */
export const ErrorAlert: React.FC<ErrorAlertProps> = ({ 
  message, 
  onClose,
  type = 'error' 
}) => {
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
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">{style.icon}</span>
        <div className="flex-1">
          <p className={`${style.text} font-medium`}>
            {message}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`${style.text} hover:opacity-70 transition-opacity flex-shrink-0`}
            aria-label="閉じる"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
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
