import React, { useState, useEffect, useRef } from 'react';
import type { TutorialStep } from '../types';

export interface TutorialOverlayProps {
  steps: TutorialStep[];
  currentStep: number;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  onComplete: () => void;
  isVisible: boolean;
}

/**
 * チュートリアルオーバーレイコンポーネント
 * ステップバイステップのガイドを表示
 */
export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({
  steps,
  currentStep,
  onNext,
  onPrevious,
  onSkip,
  onComplete,
  isVisible,
}) => {
  const [highlightPosition, setHighlightPosition] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);
  
  const tooltipRef = useRef<HTMLDivElement>(null);

  const step = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  // ターゲット要素の位置を計算してハイライト
  useEffect(() => {
    if (!isVisible || !step?.targetElement) {
      setHighlightPosition(null);
      return;
    }

    const updatePosition = () => {
      const element = document.querySelector(step.targetElement!);
      if (element) {
        const rect = element.getBoundingClientRect();
        setHighlightPosition({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        });
      } else {
        setHighlightPosition(null);
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [isVisible, step?.targetElement]);

  // ツールチップの位置を計算
  const getTooltipStyle = (): React.CSSProperties => {
    if (!highlightPosition || !step) {
      // 中央配置
      return {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      };
    }

    const padding = 16;
    const style: React.CSSProperties = {
      position: 'fixed',
    };

    switch (step.position) {
      case 'top':
        style.top = highlightPosition.top - padding;
        style.left = highlightPosition.left + highlightPosition.width / 2;
        style.transform = 'translate(-50%, -100%)';
        break;
      case 'bottom':
        style.top = highlightPosition.top + highlightPosition.height + padding;
        style.left = highlightPosition.left + highlightPosition.width / 2;
        style.transform = 'translateX(-50%)';
        break;
      case 'left':
        style.top = highlightPosition.top + highlightPosition.height / 2;
        style.left = highlightPosition.left - padding;
        style.transform = 'translate(-100%, -50%)';
        break;
      case 'right':
        style.top = highlightPosition.top + highlightPosition.height / 2;
        style.left = highlightPosition.left + highlightPosition.width + padding;
        style.transform = 'translateY(-50%)';
        break;
      case 'center':
      default:
        style.top = '50%';
        style.left = '50%';
        style.transform = 'translate(-50%, -50%)';
        break;
    }

    return style;
  };

  const handleNext = () => {
    if (step?.action) {
      step.action();
    }
    
    if (isLastStep) {
      onComplete();
    } else {
      onNext();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onSkip();
    } else if (e.key === 'ArrowRight' && !isLastStep) {
      handleNext();
    } else if (e.key === 'ArrowLeft' && !isFirstStep) {
      onPrevious();
    }
  };

  if (!isVisible || !step) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50"
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="tutorial-title"
      aria-describedby="tutorial-description"
    >
      {/* 背景オーバーレイ */}
      <div className="absolute inset-0 bg-black bg-opacity-75 transition-opacity" />

      {/* ハイライト領域 */}
      {highlightPosition && (
        <div
          className="absolute border-4 border-blue-500 rounded-lg pointer-events-none transition-all duration-300"
          style={{
            top: highlightPosition.top - 4,
            left: highlightPosition.left - 4,
            width: highlightPosition.width + 8,
            height: highlightPosition.height + 8,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.75)',
          }}
        />
      )}

      {/* ツールチップ */}
      <div
        ref={tooltipRef}
        className="bg-white rounded-lg shadow-2xl p-6 max-w-md w-full mx-4 transition-all duration-300"
        style={getTooltipStyle()}
      >
        {/* ヘッダー */}
        <div className="flex items-start justify-between mb-4">
          <h2
            id="tutorial-title"
            className="text-xl font-bold text-gray-900 flex-1"
          >
            {step.title}
          </h2>
          <button
            onClick={onSkip}
            className="text-gray-400 hover:text-gray-600 transition-colors ml-2"
            aria-label="チュートリアルをスキップ"
          >
            <svg
              className="w-6 h-6"
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
        </div>

        {/* 説明 */}
        <p
          id="tutorial-description"
          className="text-gray-700 mb-6 leading-relaxed"
        >
          {step.description}
        </p>

        {/* プログレスインジケーター */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              ステップ {currentStep + 1} / {steps.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentStep + 1) / steps.length) * 100}%`,
              }}
              role="progressbar"
              aria-valuenow={currentStep + 1}
              aria-valuemin={0}
              aria-valuemax={steps.length}
            />
          </div>
        </div>

        {/* ナビゲーションボタン */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={onSkip}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            aria-label="チュートリアルをスキップ"
          >
            スキップ
          </button>

          <div className="flex gap-2">
            {!isFirstStep && (
              <button
                onClick={onPrevious}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                aria-label="前のステップへ"
              >
                戻る
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              aria-label={isLastStep ? 'チュートリアルを完了' : '次のステップへ'}
            >
              {isLastStep ? '完了' : '次へ'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
