import { useQuiz } from '../context';

/**
 * クイズコンテキストの使用例を示すコンポーネント
 * 実際のUIコンポーネントは後のタスクで実装される
 */
export const QuizExample: React.FC = () => {
  const {
    state,
    generateNewProblem,
    updateUserAnswer,
    submitAnswer,
    resetSession,
    updateSettings,
  } = useQuiz();

  const handleGenerateProblem = () => {
    generateNewProblem();
  };

  const handleSubmit = () => {
    const isCorrect = submitAnswer();
    console.log('回答結果:', isCorrect ? '正解' : '不正解');
  };

  const handleResetSession = () => {
    resetSession();
  };

  const handleToggleRedDora = () => {
    updateSettings({
      ...state.settings,
      redDora: !state.settings.redDora,
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>麻雀点数計算クイズ - 状態管理デモ</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>統計情報</h3>
        <p>回答数: {state.statistics.totalAnswered}</p>
        <p>正解数: {state.statistics.correctCount}</p>
        <p>不正解数: {state.statistics.incorrectCount}</p>
        <p>正解率: {state.statistics.correctRate.toFixed(1)}%</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>設定</h3>
        <label>
          <input
            type="checkbox"
            checked={state.settings.redDora}
            onChange={handleToggleRedDora}
          />
          赤ドラあり
        </label>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>現在の問題</h3>
        {state.currentProblem ? (
          <div>
            <p>問題ID: {state.currentProblem.id}</p>
            <p>難易度: {state.currentProblem.difficulty}</p>
            <p>正解: {state.currentProblem.correctFu}符 {state.currentProblem.correctHan}飜 {state.currentProblem.correctScore}点</p>
            
            {state.isAnswered && (
              <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f0f0f0' }}>
                <p>回答済み</p>
                <p>あなたの回答: {state.userAnswer.fu}符 {state.userAnswer.han}飜 {state.userAnswer.score}点</p>
              </div>
            )}
          </div>
        ) : (
          <p>問題が生成されていません</p>
        )}
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button onClick={handleGenerateProblem}>
          新しい問題を生成
        </button>
        
        {state.currentProblem && !state.isAnswered && (
          <>
            <button onClick={() => updateUserAnswer({ fu: state.currentProblem!.correctFu })}>
              符を選択（正解）
            </button>
            <button onClick={() => updateUserAnswer({ han: state.currentProblem!.correctHan })}>
              飜を選択（正解）
            </button>
            <button onClick={() => updateUserAnswer({ score: state.currentProblem!.correctScore })}>
              点数を選択（正解）
            </button>
            <button 
              onClick={handleSubmit}
              disabled={!state.userAnswer.fu || !state.userAnswer.han || !state.userAnswer.score}
            >
              回答を送信
            </button>
          </>
        )}
        
        <button onClick={handleResetSession}>
          セッションをリセット
        </button>
      </div>
    </div>
  );
};
