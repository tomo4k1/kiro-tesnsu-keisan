import { lazy, Suspense } from 'react'
import './App.css'
import { ErrorBoundary } from './components/ErrorBoundary'

/**
 * パフォーマンス最適化: QuizScreenを遅延読み込み
 * 初回読み込み時間を短縮（要件 9.3）
 */
const QuizScreen = lazy(() => import('./components/QuizScreen').then(module => ({ default: module.QuizScreen })))

/**
 * ローディング中の表示コンポーネント
 */
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
      <p className="text-lg text-gray-700">読み込み中...</p>
    </div>
  </div>
)

function App() {
  return (
    <ErrorBoundary>
      <div className="App">
        <Suspense fallback={<LoadingFallback />}>
          <QuizScreen />
        </Suspense>
      </div>
    </ErrorBoundary>
  )
}

export default App
