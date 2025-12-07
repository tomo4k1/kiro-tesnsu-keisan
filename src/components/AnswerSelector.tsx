import React from 'react';

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
 */
const getButtonClasses = (
  value: number,
  selectedValue: number | null,
  correctValue: number | null,
  isAnswered: boolean
): string => {
  const baseClasses = 'px-4 py-3 rounded-lg font-semibold transition-all duration-200 border-2 min-w-[5rem]';
  
  // 回答前の状態
  if (!isAnswered) {
    if (value === selectedValue) {
      return `${baseClasses} bg-blue-500 text-white border-blue-600 shadow-md scale-105`;
    }
    return `${baseClasses} bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300 hover:scale-105 active:scale-95`;
  }
  
  // 回答後の状態
  const isCorrect = value === correctValue;
  const isSelected = value === selectedValue;
  
  if (isCorrect) {
    // 正解の選択肢
    return `${baseClasses} bg-green-500 text-white border-green-600 shadow-md ${isSelected ? 'ring-4 ring-green-300' : ''}`;
  }
  
  if (isSelected && !isCorrect) {
    // 選択したが不正解の選択肢
    return `${baseClasses} bg-red-500 text-white border-red-600 shadow-md ring-4 ring-red-300`;
  }
  
  // その他の選択肢
  return `${baseClasses} bg-gray-100 text-gray-500 border-gray-300 opacity-60`;
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
 * 要件 1.2, 2.2, 2.3, 2.4 を満たす
 */
export const AnswerSelector: React.FC<AnswerSelectorProps> = ({
  type,
  options,
  selectedValue,
  correctValue,
  isAnswered,
  onSelect,
}) => {
  const label = getTypeLabel(type);

  return (
    <div className="w-full">
      {/* ラベル */}
      <div className="mb-3">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          {label}
          {selectedValue !== null && !isAnswered && (
            <span className="text-sm font-normal text-blue-600">
              ({selectedValue}{label} を選択中)
            </span>
          )}
        </h3>
      </div>

      {/* 選択肢ボタン */}
      <div className="flex flex-wrap gap-2">
        {options.map((value) => {
          const buttonClasses = getButtonClasses(value, selectedValue, correctValue, isAnswered);
          const icon = getButtonIcon(value, selectedValue, correctValue, isAnswered);

          return (
            <button
              key={value}
              onClick={() => !isAnswered && onSelect(value)}
              disabled={isAnswered}
              className={buttonClasses}
              aria-label={`${value}${label}を選択`}
              aria-pressed={value === selectedValue}
            >
              <span className="flex items-center justify-center gap-2">
                {icon && <span className="text-xl">{icon}</span>}
                <span>{value}{label}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* 回答後のフィードバック */}
      {isAnswered && (
        <div className="mt-3">
          {selectedValue === correctValue ? (
            <div className="flex items-center gap-2 text-green-700 font-semibold">
              <span className="text-2xl">✓</span>
              <span>正解です！</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-red-700 font-semibold">
              <span className="text-2xl">✗</span>
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
