import React from 'react';
import type { Answer } from '../types';

/**
 * ResultModalコンポーネントのProps
 */
interface ResultModalProps {
  isCorrect: boolean;
  userAnswer: Answer;
  correctAnswer: Answer;
  onNext: () => void;
}

/**
 * 回答結果を表示するモーダルコンポーネント
 * 要件 1.4, 1.5, 4.1 を満たす
 */
export const ResultModal: React.FC<ResultModalProps> = ({
  isCorrect,
  userAnswer,
  correctAnswer,
  onNext,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-slideUp">
        {/* ヘッダー */}
        <div className="text-center mb-6">
          {isCorrect ? (
            <>
              <div className="text-6xl mb-3">🎉</div>
              <h2 className="text-3xl font-bold text-green-600">正解！</h2>
              <p className="text-gray-600 mt-2">素晴らしいです！</p>
            </>
          ) : (
            <>
              <div className="text-6xl mb-3">😔</div>
              <h2 className="text-3xl font-bold text-red-600">不正解</h2>
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

        {/* 次の問題ボタン */}
        <button
          onClick={onNext}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg active:scale-95"
        >
          次の問題へ
        </button>
      </div>
    </div>
  );
};
