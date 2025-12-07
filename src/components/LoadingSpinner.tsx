import React from 'react';

/**
 * LoadingSpinnerコンポーネントのProps
 */
interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  variant?: 'spinner' | 'dots' | 'pulse';
}

/**
 * ローディング状態を表示するコンポーネント
 * 要件 1.5 を満たす
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  message,
  variant = 'spinner',
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  const renderSpinner = () => {
    switch (variant) {
      case 'spinner':
        return (
          <div
            className={`${sizeClasses[size]} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin`}
            role="status"
            aria-label="読み込み中"
          />
        );
      
      case 'dots':
        return (
          <div className="flex gap-2" role="status" aria-label="読み込み中">
            <div className={`${sizeClasses[size]} bg-blue-500 rounded-full animate-bounce-slow`} style={{ animationDelay: '0s' }} />
            <div className={`${sizeClasses[size]} bg-blue-500 rounded-full animate-bounce-slow`} style={{ animationDelay: '0.2s' }} />
            <div className={`${sizeClasses[size]} bg-blue-500 rounded-full animate-bounce-slow`} style={{ animationDelay: '0.4s' }} />
          </div>
        );
      
      case 'pulse':
        return (
          <div
            className={`${sizeClasses[size]} bg-blue-500 rounded-full animate-pulse-slow`}
            role="status"
            aria-label="読み込み中"
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      {renderSpinner()}
      {message && (
        <div className="text-sm text-gray-600 font-medium animate-fadeIn">
          {message}
        </div>
      )}
    </div>
  );
};
