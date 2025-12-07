import React, { useState } from 'react';

/**
 * AnswerSelectorコンポーネントのProps
 */
interface AnswerSelectorProps {
  type: 'fu' | 'han' | 'score';
  options: number[];
  selectedValue: number | null;
  correctValue: number | null;
  isAnswered: boolean;
  onSelect: (value: number) => void;
  isSubmitting?: boolean; // ローディング状態（要件 1.4）
}

/**
 * 選択肢のタイプに応じたラベルを取得
 */
const getTypeLabel = (type: 'fu' | 'han' | 'score'): string => {
  const labels = {
    fu: '符',
    han: '飜',
    score: '点',
  };
  return labels[type];
};

/**
 * 選択肢のボタンスタイルを取得
 * 要件 1.3: ホバー時の視覚的フィードバック強化
 * 要件 1.4: 選択時のアニメーション追加
 */
const getButtonClasses = (
  value: number,
  selectedValue: number | null,
  correctValue: number | null,
  isAnswered: boolean,
  isSubmitting: boolean,
  isHovered: boolean
): string => {
  const baseClasses = 'px-4 py-3 rounded-lg font-semibold transition-all duration-300 border-2 min-w-[5rem] relative overflow-hidden';
  
  // 回答前の状態
  if (!isAnswered) {
    if (value === selectedValue) {
      // 選択済みの状態（要件 1.4: 選択時のアニメーション）
      const submittingClasses = isSubmitting 
        ? 'animate-pulse-slow cursor-wait' 
        : 'cursor-pointer';
      return `${baseClasses} bg-blue-500 text-white border-blue-600 shadow-lg scale-105 transform ${submittingClasses} ring-4 ring-blue-300 animate-select-bounce`;
    }
    
    // 未選択の状態（要件 1.3: ホバー時のフィードバック強化）
    const hoverClasses = isHovered && !isSubmitting
      ? 'bg-blue-100 border-blue-400 shadow-md scale-105 transform ring-2 ring-blue-200'
      : 'bg-white border-gray-300 shadow-sm';
    
    const cursorClasses = isSubmitting ? 'cursor-wait opacity-70' : 'cursor-pointer hover:shadow-lg';
    
    return `${baseClasses} text-gray-700 ${hoverClasses} ${cursorClasses} active:scale-95 hover-lift`;
  }
  
  // 回答後の状態
  const isCorrect = value === correctValue;
  const isSelected = value === selectedValue;
  
  if (isCorrect) {
    // 正解の選択肢
    return `${baseClasses} bg-green-500 text-white border-green-600 shadow-md ${isSelected ? 'ring-4 ring-green-300 animate-correct-shake' : 'animate-fadeIn'}`;
  }
  
  if (isSelected && !isCorrect) {
    // 選択したが不正解の選択肢
    return `${baseClasses} bg-red-500 text-white border-red-600 shadow-md ring-4 ring-red-300 animate-incorrect-shake`;
  }
  
  // その他の選択肢
  return `${baseClasses} bg-gray-100 text-gray-500 border-gray-300 opacity-60 animate-fadeIn`;
};

/**
 * 選択肢のアイコンを取得
 */
const getButtonIcon = (
  value: number,
  selectedValue: number | null,
  correctValue: number | null,
  isAnswered: boolean
): string | null => {
  if (!isAnswered) {
    return null;
  }
  
  const isCorrect = value === correctValue;
  const isSelected = value === selectedValue;
  
  if (isCorrect) {
    return '✓';
  }
  
  if (isSelected && !isCorrect) {
    return '✗';
  }
  
  return null;
};

/**
 * 符・飜数・点数の選択肢を表示するコンポーネント
 * 要件 1.2, 1.3, 1.4, 2.2, 2.3, 2.4 を満たす
 */
export const AnswerSelector: React.FC<AnswerSelectorProps> = ({
  type,
  options,
  selectedValue,
  correctValue,
  isAnswered,
  onSelect,
  isSubmitting = false,
}) => {
  const label = getTypeLabel(type);
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);

  return (
    <div className="w-full" role="group" aria-labelledby={`${type}-label`}>
      {/* ラベル */}
      <div className="mb-3">
        <h3 id={`${type}-label`} className="text-lg font-bold text-gray-800 flex items-center gap-2">
          {label}
          {selectedValue !== null && !isAnswered && (
            <span className="text-sm font-normal text-blue-600 animate-fadeIn" aria-live="polite">
              ({selectedValue}{label} を選択中)
            </span>
          )}
          {isSubmitting && (
            <span className="text-sm font-normal text-gray-500 animate-pulse-slow" aria-live="polite">
              (送信中...)
            </span>
          )}
        </h3>
      </div>

      {/* 選択肢ボタン（要件 5.2: モバイルで押しやすいサイズ） */}
      <div className="answer-selector-buttons flex flex-wrap gap-2" role="radiogroup" aria-labelledby={`${type}-label`}>
        {options.map((value) => {
          const isHovered = hoveredValue === value;
          const buttonClasses = getButtonClasses(value, selectedValue, correctValue, isAnswered, isSubmitting, isHovered);
          const icon = getButtonIcon(value, selectedValue, correctValue, isAnswered);

          return (
            <button
              key={value}
              onClick={() => !isAnswered && !isSubmitting && onSelect(value)}
              onMouseEnter={() => !isAnswered && !isSubmitting && setHoveredValue(value)}
              onMouseLeave={() => setHoveredValue(null)}
              disabled={isAnswered || isSubmitting}
              className={buttonClasses}
              role="radio"
              aria-checked={value === selectedValue}
              aria-label={`${value}${label}を選択${isAnswered ? (value === correctValue ? '（正解）' : value === selectedValue ? '（不正解）' : '') : ''}`}
              aria-disabled={isAnswered || isSubmitting}
              aria-busy={isSubmitting && value === selectedValue}
            >
              {/* ホバー時のシャインエフェクト（要件 1.3） */}
              {isHovered && !isAnswered && !isSubmitting && (
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer pointer-events-none" aria-hidden="true" />
              )}
              
              <span className="flex items-center justify-center gap-2 relative z-10">
                {icon && <span className="text-xl" aria-hidden="true">{icon}</span>}
                <span>{value}{label}</span>
                {isSubmitting && value === selectedValue && (
                  <span className="animate-spin ml-1" aria-hidden="true">⟳</span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* 回答後のフィードバック */}
      {isAnswered && (
        <div className="mt-3 animate-slideUp" role="status" aria-live="polite">
          {selectedValue === correctValue ? (
            <div className="flex items-center gap-2 text-green-700 font-semibold">
              <span className="text-2xl" aria-hidden="true">✓</span>
              <span>正解です！</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-red-700 font-semibold">
              <span className="text-2xl" aria-hidden="true">✗</span>
              <span>
                不正解です。正解は {correctValue}{label} です。
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
