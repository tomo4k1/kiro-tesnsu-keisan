import React, { useState } from 'react';
import type { Answer, Hand } from '../types';
import { ExplanationPanel } from './ExplanationPanel';

/**
 * ResultModalコンポーネントのProps
 */
interface ResultModalProps {
  isCorrect: boolean;
  userAnswer: Answer;
  correctAnswer: Answer;
  hand: Hand;
  onNext: () => void;
}

/**
 * 回答結果を表示するモーダルコンポーネント
 * 要件 1.4, 1.5, 2.1, 2.4, 4.1 を満たす
 */
export const ResultModal: React.FC<ResultModalProps> = ({
  isCorrect,
  userAnswer,
  correctAnswer,
  hand,
  onNext,
}) => {
  // 解説パネルの表示状態を管理
  // 不正解時は自動表示、正解時はボタンで表示（要件 2.1, 2.4）
  const [showExplanation, setShowExplanation] = useState(!isCorrect);

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn"
        role="dialog"
        aria-modal="true"
        aria-labelledby="result-title"
      >
        <div className={`modal-container bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-slideUp ${
          isCorrect ? 'animate-correct-glow' : 'animate-incorrect-pulse'
        }`}>
        {/* ヘッダー */}
        <div className="text-center mb-6">
          {isCorrect ? (
            <>
              <div className="text-6xl mb-3 animate-correct-shake" aria-hidden="true">🎉</div>
              <h2 id="result-title" className="text-3xl font-bold text-green-600 animate-count-up">正解！</h2>
              <p className="text-gray-600 mt-2">素晴らしいです！</p>
            </>
          ) : (
            <>
              <div className="text-6xl mb-3 animate-incorrect-shake" aria-hidden="true">😔</div>
              <h2 id="result-title" className="text-3xl font-bold text-red-600 animate-count-up">不正解</h2>
              <p className="text-gray-600 mt-2">次は頑張りましょう！</p>
            </>
          )}
        </div>

        {/* 回答の詳細 */}
        <div className="space-y-4 mb-6">
          {/* あなたの回答 */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">あなたの回答</h3>
            <div className="flex justify-around text-center">
              <div>
                <div className={`text-2xl font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {userAnswer.fu}
                </div>
                <div className="text-xs text-gray-600 mt-1">符</div>
              </div>
              <div>
                <div className={`text-2xl font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {userAnswer.han}
                </div>
                <div className="text-xs text-gray-600 mt-1">飜</div>
              </div>
              <div>
                <div className={`text-2xl font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {userAnswer.score}
                </div>
                <div className="text-xs text-gray-600 mt-1">点</div>
              </div>
            </div>
          </div>

          {/* 正解 */}
          {!isCorrect && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">正解</h3>
              <div className="flex justify-around text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {correctAnswer.fu}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">符</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {correctAnswer.han}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">飜</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {correctAnswer.score}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">点</div>
                </div>
              </div>
            </div>
          )}

          {/* 差分表示（不正解の場合） */}
          {!isCorrect && (
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">差分</h3>
              <div className="text-sm text-gray-700 space-y-1">
                {userAnswer.fu !== correctAnswer.fu && (
                  <div className="flex justify-between">
                    <span>符:</span>
                    <span className="font-semibold">
                      {userAnswer.fu} → {correctAnswer.fu}
                      <span className="text-red-600 ml-1">
                        ({userAnswer.fu > correctAnswer.fu ? '-' : '+'}
                        {Math.abs(userAnswer.fu - correctAnswer.fu)})
                      </span>
                    </span>
                  </div>
                )}
                {userAnswer.han !== correctAnswer.han && (
                  <div className="flex justify-between">
                    <span>飜:</span>
                    <span className="font-semibold">
                      {userAnswer.han} → {correctAnswer.han}
                      <span className="text-red-600 ml-1">
                        ({userAnswer.han > correctAnswer.han ? '-' : '+'}
                        {Math.abs(userAnswer.han - correctAnswer.han)})
                      </span>
                    </span>
                  </div>
                )}
                {userAnswer.score !== correctAnswer.score && (
                  <div className="flex justify-between">
                    <span>点:</span>
                    <span className="font-semibold">
                      {userAnswer.score} → {correctAnswer.score}
                      <span className="text-red-600 ml-1">
                        ({userAnswer.score > correctAnswer.score ? '-' : '+'}
                        {Math.abs(userAnswer.score - correctAnswer.score)})
                      </span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* アクションボタン */}
        <div className="space-y-3">
          {/* 解説を見るボタン（要件 2.1, 2.4） */}
          <button
            onClick={() => setShowExplanation(true)}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            aria-label="解説を見る"
          >
            <span aria-hidden="true">📖</span>
            <span>解説を見る</span>
          </button>
          
          {/* 次の問題ボタン */}
          <button
            onClick={onNext}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="次の問題へ進む"
          >
            次の問題へ
          </button>
        </div>
      </div>
    </div>

      {/* 解説パネル（要件 2.1, 2.4） */}
      <ExplanationPanel
        hand={hand}
        correctAnswer={correctAnswer}
        isVisible={showExplanation}
        onClose={() => setShowExplanation(false)}
      />
    </>
  );
};
