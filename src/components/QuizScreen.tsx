import React, { useEffect, useState } from 'react';
import { useQuiz } from '../context';
import { HandDisplay } from './HandDisplay';
import { AnswerSelector } from './AnswerSelector';
import { StatisticsDisplay } from './StatisticsDisplay';
import { SettingsPanel } from './SettingsPanel';
import { ResultModal } from './ResultModal';
import { ErrorAlert } from './ErrorAlert';
import type { Answer } from '../types';

/**
 * QuizScreenコンポーネントのProps
 */
interface QuizScreenProps {
  onExit?: () => void;
}

/**
 * メインのクイズ画面コンポーネント
 * すべてのサブコンポーネントを統合し、クイズの全体フローを管理
 * 要件 1.1, 1.2, 1.3, 1.4, 1.5, 4.1, 4.2, 4.3, 4.4 を満たす
 */
export const QuizScreen: React.FC<QuizScreenProps> = ({ onExit }) => {
  const {
    state,
    error,
    generateNewProblem,
    updateUserAnswer,
    submitAnswer,
    resetAnswer,
    resetSession,
    updateSettings,
    clearError,
  } = useQuiz();

  const [showSettings, setShowSettings] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // 初回マウント時に問題を生成（要件 1.1）
  useEffect(() => {
    if (!state.currentProblem) {
      generateNewProblem();
    }
  }, []);

  /**
   * 回答を送信
   */
  const handleSubmit = () => {
    // 回答を判定（要件 1.4）
    // エラーチェックはsubmitAnswer内で行われる
    const result = submitAnswer();
    
    // エラーがない場合のみ結果モーダルを表示
    if (!error) {
      setIsCorrect(result);
      setShowResultModal(true);
    }
  };

  /**
   * 次の問題へ進む（要件 4.1, 4.2）
   */
  const handleNext = () => {
    setShowResultModal(false);
    resetAnswer();
    generateNewProblem();
  };

  /**
   * セッションを終了（要件 4.3, 4.4）
   */
  const handleExit = () => {
    setShowExitConfirm(true);
  };

  /**
   * セッション終了を確認
   */
  const confirmExit = () => {
    setShowExitConfirm(false);
    if (onExit) {
      onExit();
    }
  };

  /**
   * セッション終了をキャンセル
   */
  const cancelExit = () => {
    setShowExitConfirm(false);
  };

  /**
   * セッションをリセット
   */
  const handleResetSession = () => {
    if (confirm('統計情報をリセットしてもよろしいですか？')) {
      resetSession();
      generateNewProblem();
    }
  };

  // 問題が存在しない場合のローディング表示
  if (!state.currentProblem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🀄</div>
          <div className="text-xl font-semibold text-gray-700">問題を生成中...</div>
        </div>
      </div>
    );
  }

  const { currentProblem, userAnswer, isAnswered } = state;
  const correctAnswer: Answer = {
    fu: currentProblem.correctFu,
    han: currentProblem.correctHan,
    score: currentProblem.correctScore,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-6 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* ヘッダー */}
        <header className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🀄</span>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  麻雀点数計算クイズ
                </h1>
                <p className="text-sm text-gray-600">
                  符・飜数・点数を選択して回答しましょう
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                <span>⚙️</span>
                <span>設定</span>
              </button>
              <button
                onClick={handleResetSession}
                className="px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                <span>🔄</span>
                <span>リセット</span>
              </button>
              <button
                onClick={handleExit}
                className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                <span>🚪</span>
                <span>終了</span>
              </button>
            </div>
          </div>
        </header>

        {/* 統計情報 */}
        <StatisticsDisplay
          totalAnswered={state.statistics.totalAnswered}
          correctCount={state.statistics.correctCount}
          incorrectCount={state.statistics.incorrectCount}
        />

        {/* エラー表示 */}
        {error && (
          <ErrorAlert 
            message={error} 
            onClose={clearError}
            type="error"
          />
        )}

        {/* 設定パネル（トグル表示） */}
        {showSettings && (
          <div className="animate-slideDown">
            <SettingsPanel
              settings={state.settings}
              onSettingsChange={updateSettings}
            />
          </div>
        )}

        {/* 手牌表示（要件 2.1, 2.5） */}
        <HandDisplay hand={currentProblem.hand} />

        {/* 回答選択エリア */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              回答を選択してください
            </h2>
            <div className="text-sm text-gray-600">
              難易度: <span className="font-semibold">
                {currentProblem.difficulty === 'easy' ? '初級' : 
                 currentProblem.difficulty === 'medium' ? '中級' : '上級'}
              </span>
            </div>
          </div>

          {/* 符の選択（要件 1.2, 2.2, 2.3, 2.4） */}
          <AnswerSelector
            type="fu"
            options={currentProblem.fuOptions}
            selectedValue={userAnswer.fu ?? null}
            correctValue={isAnswered ? currentProblem.correctFu : null}
            isAnswered={isAnswered}
            onSelect={(value) => updateUserAnswer({ fu: value })}
          />

          {/* 飜数の選択（要件 1.2, 2.2, 2.3, 2.4） */}
          <AnswerSelector
            type="han"
            options={currentProblem.hanOptions}
            selectedValue={userAnswer.han ?? null}
            correctValue={isAnswered ? currentProblem.correctHan : null}
            isAnswered={isAnswered}
            onSelect={(value) => updateUserAnswer({ han: value })}
          />

          {/* 点数の選択（要件 1.2, 2.2, 2.3, 2.4） */}
          <AnswerSelector
            type="score"
            options={currentProblem.scoreOptions}
            selectedValue={userAnswer.score ?? null}
            correctValue={isAnswered ? currentProblem.correctScore : null}
            isAnswered={isAnswered}
            onSelect={(value) => updateUserAnswer({ score: value })}
          />

          {/* アクションボタン */}
          <div className="flex gap-4 pt-4 border-t border-gray-200">
            {!isAnswered ? (
              <button
                onClick={handleSubmit}
                disabled={
                  userAnswer.fu === undefined ||
                  userAnswer.han === undefined ||
                  userAnswer.score === undefined
                }
                className={`
                  flex-1 py-4 font-bold rounded-lg transition-all duration-200 shadow-md
                  ${
                    userAnswer.fu !== undefined &&
                    userAnswer.han !== undefined &&
                    userAnswer.score !== undefined
                      ? 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg active:scale-95'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                {userAnswer.fu !== undefined &&
                userAnswer.han !== undefined &&
                userAnswer.score !== undefined
                  ? '回答を送信'
                  : 'すべて選択してください'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex-1 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
              >
                次の問題へ →
              </button>
            )}
          </div>
        </div>

        {/* フッター */}
        <footer className="text-center text-sm text-gray-600 py-4">
          <p>© 2024 麻雀点数計算クイズ</p>
        </footer>
      </div>

      {/* 結果モーダル（要件 1.4, 1.5, 4.1） */}
      {showResultModal && (
        <ResultModal
          isCorrect={isCorrect}
          userAnswer={userAnswer as Answer}
          correctAnswer={correctAnswer}
          onNext={handleNext}
        />
      )}

      {/* 終了確認モーダル（要件 4.3, 4.4） */}
      {showExitConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              セッションを終了しますか？
            </h2>
            
            {/* 最終統計情報の表示（要件 4.4） */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-3">最終結果</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">回答数:</span>
                  <span className="font-semibold">{state.statistics.totalAnswered}問</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">正解数:</span>
                  <span className="font-semibold text-green-600">{state.statistics.correctCount}問</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">不正解数:</span>
                  <span className="font-semibold text-red-600">{state.statistics.incorrectCount}問</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="text-gray-600">正解率:</span>
                  <span className="font-bold text-purple-600">{state.statistics.correctRate.toFixed(1)}%</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={cancelExit}
                className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors duration-200"
              >
                キャンセル
              </button>
              <button
                onClick={confirmExit}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                終了する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
