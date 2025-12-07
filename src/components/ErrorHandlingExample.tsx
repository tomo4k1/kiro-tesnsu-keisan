/**
 * エラーハンドリングの使用例
 * 
 * このファイルは、新しいエラーハンドリングシステムの使用方法を示すサンプルです。
 */

import React, { useState } from 'react';
import { ErrorAlertWithInfo } from './ErrorAlert';
import { useErrorHandler } from '../hooks/useErrorHandler';
import { 
  errorHandler, 
  InvalidHandError, 
  CalculationError,
  StorageError,
  GenerationError
} from '../types/errors';

/**
 * エラーハンドリングの使用例コンポーネント
 */
export const ErrorHandlingExample: React.FC = () => {
  const { currentError, showError, clearError, retryAction, setRetryAction } = useErrorHandler();
  const [result, setResult] = useState<string>('');

  /**
   * 例1: AppErrorからErrorInfoを作成して表示
   */
  const handleInvalidHandError = () => {
    const appError = new InvalidHandError('手牌データが不正です');
    const errorInfo = errorHandler.fromAppError(appError);
    showError(errorInfo);
  };

  /**
   * 例2: 直接ErrorInfoを作成して表示
   */
  const handleCustomError = () => {
    const errorInfo = errorHandler.createErrorInfo(
      'CUSTOM_ERROR',
      'カスタムエラーが発生しました',
      'この操作を再試行するか、サポートに連絡してください',
      'warning',
      { userId: '123', action: 'custom_action' }
    );
    showError(errorInfo);
  };

  /**
   * 例3: 再試行機能付きエラー
   */
  const handleNetworkError = () => {
    const errorInfo = errorHandler.createErrorInfo(
      'NETWORK_ERROR',
      'ネットワークエラーが発生しました',
      'インターネット接続を確認して、再試行してください',
      'error'
    );
    
    // 再試行アクションを設定
    setRetryAction(() => () => {
      console.log('Retrying network request...');
      setResult('再試行中...');
      clearError();
      
      // 実際の再試行処理をここに実装
      setTimeout(() => {
        setResult('再試行が成功しました！');
      }, 1000);
    });
    
    showError(errorInfo);
  };

  /**
   * 例4: ErrorHandlerのretryメソッドを使用
   */
  const handleRetryExample = async () => {
    try {
      setResult('処理中...');
      
      const result = await errorHandler.retry(
        async () => {
          // ランダムに失敗する処理をシミュレート
          if (Math.random() > 0.5) {
            throw new Error('一時的なエラー');
          }
          return '成功！';
        },
        3, // 最大3回試行
        500 // 500ms待機
      );
      
      setResult(result);
    } catch (error) {
      const errorInfo = errorHandler.fromUnknownError(error);
      showError(errorInfo);
      setResult('失敗しました');
    }
  };

  /**
   * 例5: 異なる重要度のエラー
   */
  const handleInfoMessage = () => {
    const errorInfo = errorHandler.createErrorInfo(
      'INFO',
      '情報メッセージ',
      'これは情報メッセージです。5秒後に自動的に消えます。',
      'info'
    );
    showError(errorInfo);
  };

  const handleWarningMessage = () => {
    const errorInfo = errorHandler.createErrorInfo(
      'WARNING',
      '警告メッセージ',
      'これは警告メッセージです。5秒後に自動的に消えます。',
      'warning'
    );
    showError(errorInfo);
  };

  const handleCriticalError = () => {
    const errorInfo = errorHandler.createErrorInfo(
      'CRITICAL',
      '重大なエラー',
      'これは重大なエラーです。自動的には消えません。',
      'critical'
    );
    showError(errorInfo);
  };

  /**
   * 例6: エラーログの表示
   */
  const showErrorLog = () => {
    const log = errorHandler.getErrorLog();
    console.log('Error Log:', log);
    setResult(`エラーログ: ${log.length}件のエラー`);
  };

  const clearErrorLog = () => {
    errorHandler.clearErrorLog();
    setResult('エラーログをクリアしました');
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">エラーハンドリングの使用例</h1>

      {/* エラー表示エリア */}
      {currentError && (
        <ErrorAlertWithInfo
          errorInfo={currentError}
          onClose={clearError}
          onRetry={retryAction || undefined}
          autoDismiss={true}
          autoDismissDelay={5000}
        />
      )}

      {/* 結果表示 */}
      {result && (
        <div className="mb-4 p-4 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-700">{result}</p>
        </div>
      )}

      {/* 例1: AppErrorからの変換 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">1. AppErrorからErrorInfoへの変換</h2>
        <div className="space-x-2">
          <button
            onClick={handleInvalidHandError}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            InvalidHandError
          </button>
          <button
            onClick={() => {
              const error = new CalculationError();
              showError(errorHandler.fromAppError(error));
            }}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            CalculationError
          </button>
          <button
            onClick={() => {
              const error = new StorageError();
              showError(errorHandler.fromAppError(error));
            }}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            StorageError
          </button>
          <button
            onClick={() => {
              const error = new GenerationError();
              showError(errorHandler.fromAppError(error));
            }}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            GenerationError
          </button>
        </div>
      </section>

      {/* 例2: カスタムエラー */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">2. カスタムエラーの作成</h2>
        <button
          onClick={handleCustomError}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          カスタムエラーを表示
        </button>
      </section>

      {/* 例3: 再試行機能 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">3. 再試行機能付きエラー</h2>
        <button
          onClick={handleNetworkError}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          ネットワークエラー（再試行可能）
        </button>
      </section>

      {/* 例4: 自動再試行 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">4. 自動再試行メソッド</h2>
        <button
          onClick={handleRetryExample}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          自動再試行を実行
        </button>
      </section>

      {/* 例5: 重要度別エラー */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">5. 重要度別エラー</h2>
        <div className="space-x-2">
          <button
            onClick={handleInfoMessage}
            className="px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-500"
          >
            情報メッセージ
          </button>
          <button
            onClick={handleWarningMessage}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            警告メッセージ
          </button>
          <button
            onClick={handleCriticalError}
            className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800"
          >
            重大なエラー
          </button>
        </div>
      </section>

      {/* 例6: エラーログ管理 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">6. エラーログ管理</h2>
        <div className="space-x-2">
          <button
            onClick={showErrorLog}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            エラーログを表示
          </button>
          <button
            onClick={clearErrorLog}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            エラーログをクリア
          </button>
        </div>
      </section>

      {/* 使用方法の説明 */}
      <section className="mt-12 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">使用方法</h2>
        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-semibold mb-2">基本的な使い方:</h3>
            <pre className="bg-gray-800 text-white p-4 rounded overflow-x-auto">
{`import { useErrorHandler } from '../hooks/useErrorHandler';
import { errorHandler } from '../types/errors';

const { currentError, showError, clearError } = useErrorHandler();

// エラーを表示
const errorInfo = errorHandler.createErrorInfo(
  'ERROR_CODE',
  'エラーメッセージ',
  '対処法の提案',
  'error'
);
showError(errorInfo);`}
            </pre>
          </div>

          <div>
            <h3 className="font-semibold mb-2">AppErrorからの変換:</h3>
            <pre className="bg-gray-800 text-white p-4 rounded overflow-x-auto">
{`const appError = new InvalidHandError('エラーメッセージ');
const errorInfo = errorHandler.fromAppError(appError);
showError(errorInfo);`}
            </pre>
          </div>

          <div>
            <h3 className="font-semibold mb-2">再試行機能:</h3>
            <pre className="bg-gray-800 text-white p-4 rounded overflow-x-auto">
{`const result = await errorHandler.retry(
  async () => {
    // 処理
  },
  3, // 最大試行回数
  1000 // 待機時間(ms)
);`}
            </pre>
          </div>
        </div>
      </section>
    </div>
  );
};
