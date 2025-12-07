import React from 'react';
import type { Hand, Answer } from '../types';
import { generateExplanation, type Explanation } from '../utils/explanationGenerator';

/**
 * ExplanationPanelコンポーネントのProps
 */
export interface ExplanationPanelProps {
  hand: Hand;
  correctAnswer: Answer;
  isVisible: boolean;
  onClose: () => void;
}

/**
 * 解説を表示するモーダルコンポーネント
 * 要件 2.1, 2.2, 2.3, 2.4, 2.5 を満たす
 */
export const ExplanationPanel: React.FC<ExplanationPanelProps> = ({
  hand,
  correctAnswer,
  isVisible,
  onClose,
}) => {
  if (!isVisible) return null;

  const explanation: Explanation = generateExplanation(hand, correctAnswer);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="explanation-title"
    >
      <div 
        className="modal-container bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 id="explanation-title" className="text-2xl font-bold text-gray-800">解説</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded"
            aria-label="解説を閉じる"
          >
            <svg 
              className="w-6 h-6" 
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
        </div>

        {/* スクロール可能なコンテンツ領域 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 符の内訳セクション */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <span className="w-1 h-6 bg-blue-500 mr-2"></span>
              符の内訳
            </h3>
            <div className="bg-blue-50 rounded-lg p-4 space-y-2">
              {explanation.fuBreakdown.map((item, index) => (
                <div 
                  key={index}
                  className="flex justify-between items-start p-2 bg-white rounded border border-blue-100"
                >
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">{item.source}</div>
                    <div className="text-sm text-gray-600 mt-1">{item.description}</div>
                  </div>
                  <div className="text-lg font-bold text-blue-600 ml-4">
                    {item.fu > 0 ? `+${item.fu}` : item.fu}符
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center p-3 bg-blue-100 rounded font-bold text-gray-800 mt-3">
                <span>合計</span>
                <span className="text-xl text-blue-700">{explanation.totalFu}符</span>
              </div>
            </div>
          </section>

          {/* 役の一覧セクション */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <span className="w-1 h-6 bg-green-500 mr-2"></span>
              役の一覧
            </h3>
            <div className="bg-green-50 rounded-lg p-4 space-y-2">
              {explanation.yaku.length === 0 ? (
                <div className="text-center text-gray-500 py-4">
                  役なし
                </div>
              ) : (
                <>
                  {explanation.yaku.map((item, index) => (
                    <div 
                      key={index}
                      className="flex justify-between items-start p-2 bg-white rounded border border-green-100"
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">{item.name}</div>
                        <div className="text-sm text-gray-600 mt-1">{item.description}</div>
                      </div>
                      <div className="text-lg font-bold text-green-600 ml-4">
                        {item.han}飜
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between items-center p-3 bg-green-100 rounded font-bold text-gray-800 mt-3">
                    <span>合計</span>
                    <span className="text-xl text-green-700">{explanation.totalHan}飜</span>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* 計算過程セクション */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <span className="w-1 h-6 bg-purple-500 mr-2"></span>
              計算過程
            </h3>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="bg-white rounded border border-purple-100 p-4 font-mono text-sm space-y-1">
                {explanation.calculationSteps.map((step, index) => (
                  <div 
                    key={index}
                    className={`${
                      step === '' 
                        ? 'h-2' 
                        : step.startsWith('【') 
                          ? 'font-bold text-purple-700 mt-2' 
                          : 'text-gray-700'
                    }`}
                  >
                    {step}
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-purple-100 rounded-lg">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">最終結果</div>
                  <div className="text-3xl font-bold text-purple-700">
                    {explanation.finalScore}点
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {explanation.totalFu}符 {explanation.totalHan}飜
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* フッター */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            aria-label="解説を閉じる"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
