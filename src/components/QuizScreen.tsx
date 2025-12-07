import React, { useEffect, useState, useMemo } from 'react';
import { useQuiz } from '../context';
import { HandDisplay } from './HandDisplay';
import { AnswerSelector } from './AnswerSelector';
import { StatisticsDisplay } from './StatisticsDisplay';
import { SettingsPanel } from './SettingsPanel';
import { ResultModal } from './ResultModal';
import { ErrorAlert } from './ErrorAlert';
import { LoadingSpinner } from './LoadingSpinner';
import { Tooltip } from './Tooltip';
import { TutorialOverlay } from './TutorialOverlay';
import { HelpModal } from './HelpModal';
import { useKeyboardShortcuts, type KeyboardShortcut } from '../hooks/useKeyboardShortcuts';
import { useTutorial } from '../hooks/useTutorial';
import type { Answer, TutorialStep } from '../types';

/**
 * QuizScreenコンポーネントのProps
 */
interface QuizScreenProps {
  onExit?: () => void;
}

/**
 * チュートリアルステップの定義（要件 10.1）
 */
const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: '麻雀点数計算クイズへようこそ！',
    description: 'このアプリでは、麻雀の点数計算を楽しく学習できます。手牌を見て、符・飜数・点数を選択して回答しましょう。',
    position: 'center',
  },
  {
    id: 'hand-display',
    title: '手牌の確認',
    description: 'ここに問題の手牌が表示されます。牌は自動的に整列され、立直や鳴きなどの状態もバッジで表示されます。',
    targetElement: '.hand-display',
    position: 'bottom',
  },
  {
    id: 'answer-selection',
    title: '回答の選択',
    description: '符・飜数・点数をそれぞれ選択してください。数字キー（1-9）でも選択できます。',
    targetElement: '[aria-label*="符を選択"]',
    position: 'top',
  },
  {
    id: 'submit-answer',
    title: '回答の送信',
    description: 'すべて選択したら「回答を送信」ボタンをクリックします。Enterキーでも送信できます。',
    targetElement: '[aria-label="回答を送信"]',
    position: 'top',
  },
  {
    id: 'statistics',
    title: '統計情報',
    description: 'ここで学習の進捗を確認できます。正解率や連続正解数などが表示されます。',
    targetElement: '.statistics-display',
    position: 'bottom',
  },
  {
    id: 'settings',
    title: '設定のカスタマイズ',
    description: '設定ボタンから、アニメーション速度、音声、フォントサイズなどをカスタマイズできます。',
    targetElement: '[aria-label="設定を開く"]',
    position: 'bottom',
  },
  {
    id: 'keyboard-shortcuts',
    title: 'キーボードショートカット',
    description: '数字キーで選択、Enterで送信、Spaceで次の問題、Escapeでモーダルを閉じることができます。効率的に学習しましょう！',
    position: 'center',
  },
];

/**
 * メインのクイズ画面コンポーネント
 * すべてのサブコンポーネントを統合し、クイズの全体フローを管理
 * 要件 1.1, 1.2, 1.3, 1.4, 1.5, 4.1, 4.2, 4.3, 4.4, 10.1, 10.5 を満たす
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // チュートリアル管理（要件 10.1, 10.5）
  const {
    currentStep,
    isVisible: isTutorialVisible,
    handleNext: handleTutorialNext,
    handlePrevious: handleTutorialPrevious,
    handleSkip: handleTutorialSkip,
    handleComplete: handleTutorialComplete,
  } = useTutorial(tutorialSteps);

  // 初回マウント時に問題を生成（要件 1.1）
  useEffect(() => {
    if (!state.currentProblem) {
      generateNewProblem();
    }
  }, []);

  /**
   * キーボードショートカットの設定（要件 4.1, 4.2, 4.3, 4.4）
   */
  const shortcuts = useMemo<KeyboardShortcut[]>(() => {
    const currentProblem = state.currentProblem;
    if (!currentProblem) return [];

    const shortcuts: KeyboardShortcut[] = [];

    // 要件 4.1: 数字キー（1-9）で選択肢を選択
    // 符の選択（1-9キー）
    currentProblem.fuOptions.forEach((option, index) => {
      if (index < 9) {
        shortcuts.push({
          key: String(index + 1),
          action: () => {
            if (!state.isAnswered) {
              updateUserAnswer({ fu: option });
            }
          },
          description: `符の選択肢${index + 1}を選択`,
          enabled: !state.isAnswered,
        });
      }
    });

    // 要件 4.2: Enterキーで回答を送信
    shortcuts.push({
      key: 'Enter',
      action: () => {
        if (!state.isAnswered && 
            state.userAnswer.fu !== undefined &&
            state.userAnswer.han !== undefined &&
            state.userAnswer.score !== undefined) {
          handleSubmit();
        }
      },
      description: '回答を送信',
      enabled: !state.isAnswered &&
               state.userAnswer.fu !== undefined &&
               state.userAnswer.han !== undefined &&
               state.userAnswer.score !== undefined,
    });

    // 要件 4.3: Spaceキーで次の問題に進む
    shortcuts.push({
      key: ' ',
      action: () => {
        if (state.isAnswered) {
          handleNext();
        }
      },
      description: '次の問題に進む',
      enabled: state.isAnswered,
    });

    // 要件 4.4: Escapeキーでモーダルを閉じる
    shortcuts.push({
      key: 'Escape',
      action: () => {
        if (showResultModal) {
          setShowResultModal(false);
        } else if (showExitConfirm) {
          cancelExit();
        } else if (showSettings) {
          setShowSettings(false);
        }
      },
      description: 'モーダルを閉じる',
      enabled: showResultModal || showExitConfirm || showSettings,
    });

    return shortcuts;
  }, [
    state.currentProblem,
    state.isAnswered,
    state.userAnswer,
    showResultModal,
    showExitConfirm,
    showSettings,
  ]);

  // キーボードショートカットを有効化
  useKeyboardShortcuts(shortcuts, true);

  /**
   * 回答を送信（要件 1.5）
   */
  const handleSubmit = () => {
    // ローディング状態を表示
    setIsSubmitting(true);
    
    // 少し遅延を入れてローディングアニメーションを見せる
    setTimeout(() => {
      // 回答を判定（要件 1.4）
      // エラーチェックはsubmitAnswer内で行われる
      const result = submitAnswer();
      
      setIsSubmitting(false);
      
      // エラーがない場合のみ結果モーダルを表示
      if (!error) {
        setIsCorrect(result);
        setShowResultModal(true);
      }
    }, 300);
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

  // 問題が存在しない場合のローディング表示（要件 1.5）
  if (!state.currentProblem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce-slow">🀄</div>
          <div className="text-xl font-semibold text-gray-700 mb-6">問題を生成中...</div>
          <LoadingSpinner size="large" variant="dots" />
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
    <div className="landscape-container min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-6 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* ヘッダー（要件 5.1, 5.2: モバイル最適化） */}
        <header className="bg-white rounded-lg shadow-md p-4">
          <div className="header-container flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🀄</span>
              <div>
                <h1 className="header-title text-2xl font-bold text-gray-800">
                  麻雀点数計算クイズ
                </h1>
                <p className="header-subtitle text-sm text-gray-600">
                  符・飜数・点数を選択して回答しましょう
                </p>
              </div>
            </div>
            <div className="header-buttons flex gap-2">
              <Tooltip tooltip="アプリケーションの使い方や各機能の説明を確認できます">
                <button
                  onClick={() => setShowHelp(true)}
                  className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="ヘルプを開く"
                >
                  <span aria-hidden="true">❓</span>
                  <span>ヘルプ</span>
                </button>
              </Tooltip>
              <Tooltip tooltip="ルール設定、アニメーション速度、音声、フォントサイズなどを変更できます">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="設定を開く"
                  aria-expanded={showSettings}
                >
                  <span aria-hidden="true">⚙️</span>
                  <span>設定</span>
                </button>
              </Tooltip>
              <Tooltip tooltip="統計情報をリセットして最初からやり直します。この操作は取り消せません">
                <button
                  onClick={handleResetSession}
                  className="px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                  aria-label="統計情報をリセット"
                >
                  <span aria-hidden="true">🔄</span>
                  <span>リセット</span>
                </button>
              </Tooltip>
              <Tooltip tooltip="クイズを終了して最終結果を確認します">
                <button
                  onClick={handleExit}
                  className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  aria-label="クイズを終了"
                >
                  <span aria-hidden="true">🚪</span>
                  <span>終了</span>
                </button>
              </Tooltip>
            </div>
          </div>
        </header>

        {/* 統計情報 */}
        <div className="statistics-display">
          <StatisticsDisplay
            totalAnswered={state.statistics.totalAnswered}
            correctCount={state.statistics.correctCount}
            incorrectCount={state.statistics.incorrectCount}
          />
        </div>

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
        <div className="hand-display">
          <HandDisplay hand={currentProblem.hand} />
        </div>

        {/* 回答選択エリア（要件 5.1, 5.2: モバイル最適化） */}
        <div className="answer-selector-container bg-white rounded-lg shadow-md p-6 space-y-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
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

          {/* 符の選択（要件 1.2, 1.3, 1.4, 2.2, 2.3, 2.4） */}
          <AnswerSelector
            type="fu"
            options={currentProblem.fuOptions}
            selectedValue={userAnswer.fu ?? null}
            correctValue={isAnswered ? currentProblem.correctFu : null}
            isAnswered={isAnswered}
            onSelect={(value) => updateUserAnswer({ fu: value })}
            isSubmitting={isSubmitting}
          />

          {/* 飜数の選択（要件 1.2, 1.3, 1.4, 2.2, 2.3, 2.4） */}
          <AnswerSelector
            type="han"
            options={currentProblem.hanOptions}
            selectedValue={userAnswer.han ?? null}
            correctValue={isAnswered ? currentProblem.correctHan : null}
            isAnswered={isAnswered}
            onSelect={(value) => updateUserAnswer({ han: value })}
            isSubmitting={isSubmitting}
          />

          {/* 点数の選択（要件 1.2, 1.3, 1.4, 2.2, 2.3, 2.4） */}
          <AnswerSelector
            type="score"
            options={currentProblem.scoreOptions}
            selectedValue={userAnswer.score ?? null}
            correctValue={isAnswered ? currentProblem.correctScore : null}
            isAnswered={isAnswered}
            onSelect={(value) => updateUserAnswer({ score: value })}
            isSubmitting={isSubmitting}
          />

          {/* アクションボタン */}
          <div className="flex gap-4 pt-4 border-t border-gray-200">
            {!isAnswered ? (
              <Tooltip 
                tooltip={
                  userAnswer.fu !== undefined &&
                  userAnswer.han !== undefined &&
                  userAnswer.score !== undefined
                    ? '符・飜数・点数の回答を送信します（Enterキーでも送信できます）'
                    : '符・飜数・点数をすべて選択してから送信してください'
                }
                disabled={isSubmitting}
              >
                <button
                  onClick={handleSubmit}
                  disabled={
                    isSubmitting ||
                    userAnswer.fu === undefined ||
                    userAnswer.han === undefined ||
                    userAnswer.score === undefined
                  }
                  className={`
                    flex-1 py-4 font-bold rounded-lg transition-all duration-200 shadow-md flex items-center justify-center gap-2
                    ${
                      userAnswer.fu !== undefined &&
                      userAnswer.han !== undefined &&
                      userAnswer.score !== undefined &&
                      !isSubmitting
                        ? 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }
                  `}
                  aria-label={
                    isSubmitting
                      ? '回答を送信中'
                      : userAnswer.fu !== undefined &&
                        userAnswer.han !== undefined &&
                        userAnswer.score !== undefined
                      ? '回答を送信'
                      : 'すべての選択肢を選んでください'
                  }
                  aria-disabled={
                    isSubmitting ||
                    userAnswer.fu === undefined ||
                    userAnswer.han === undefined ||
                    userAnswer.score === undefined
                  }
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="small" variant="spinner" />
                      <span>送信中...</span>
                    </>
                  ) : userAnswer.fu !== undefined &&
                    userAnswer.han !== undefined &&
                    userAnswer.score !== undefined ? (
                    '回答を送信'
                  ) : (
                    'すべて選択してください'
                  )}
                </button>
              </Tooltip>
            ) : (
              <Tooltip tooltip="次の問題に進みます（Spaceキーでも進めます）">
                <button
                  onClick={handleNext}
                  className="flex-1 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  aria-label="次の問題へ進む"
                >
                  次の問題へ →
                </button>
              </Tooltip>
            )}
          </div>
        </div>

        {/* フッター */}
        <footer className="text-center text-sm text-gray-600 py-4">
          <p>© 2024 麻雀点数計算クイズ</p>
        </footer>
      </div>

      {/* 結果モーダル（要件 1.4, 1.5, 2.1, 2.4, 4.1） */}
      {showResultModal && (
        <ResultModal
          isCorrect={isCorrect}
          userAnswer={userAnswer as Answer}
          correctAnswer={correctAnswer}
          hand={currentProblem.hand}
          onNext={handleNext}
        />
      )}

      {/* 終了確認モーダル（要件 4.3, 4.4, 5.4: レスポンシブ対応） */}
      {showExitConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="modal-container bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
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
                className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                aria-label="終了をキャンセル"
              >
                キャンセル
              </button>
              <button
                onClick={confirmExit}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                aria-label="クイズを終了する"
              >
                終了する
              </button>
            </div>
          </div>
        </div>
      )}

      {/* チュートリアルオーバーレイ（要件 10.1, 10.5） */}
      <TutorialOverlay
        steps={tutorialSteps}
        currentStep={currentStep}
        onNext={handleTutorialNext}
        onPrevious={handleTutorialPrevious}
        onSkip={handleTutorialSkip}
        onComplete={handleTutorialComplete}
        isVisible={isTutorialVisible}
      />

      {/* ヘルプモーダル（要件 10.2） */}
      <HelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
      />
    </div>
  );
};
