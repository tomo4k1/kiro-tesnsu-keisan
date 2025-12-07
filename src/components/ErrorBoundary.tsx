import { Component, type ErrorInfo, type ReactNode } from 'react';
import { logError } from '../types/errors';

/**
 * ErrorBoundaryのProps
 */
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * ErrorBoundaryのState
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Reactエラーバウンダリーコンポーネント
 * 子コンポーネントでエラーが発生した場合にキャッチして、
 * アプリケーション全体がクラッシュするのを防ぐ
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  /**
   * エラーが発生したときに呼ばれる
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  /**
   * エラー情報をログに記録
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logError(error, 'ErrorBoundary');
    console.error('Component stack:', errorInfo.componentStack);
  }

  /**
   * エラー状態をリセット
   */
  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // カスタムフォールバックが提供されている場合はそれを使用
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // デフォルトのエラー表示
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-8">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">⚠️</div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                エラーが発生しました
              </h1>
              <p className="text-gray-600">
                申し訳ございません。予期しないエラーが発生しました。
              </p>
            </div>

            {this.state.error && (
              <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
                <h2 className="font-semibold text-red-800 mb-2">エラー詳細:</h2>
                <p className="text-sm text-red-700 font-mono break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={this.handleReset}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                再試行
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors duration-200"
              >
                ページを再読み込み
              </button>
            </div>

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>問題が解決しない場合は、ブラウザのキャッシュをクリアしてください。</p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
