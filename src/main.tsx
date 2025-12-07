import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QuizProvider } from './context'
import { validatePerformanceRequirement, PERFORMANCE_THRESHOLDS } from './utils/performance'

/**
 * 初回読み込み時間の測定（要件 9.3: 3秒以内）
 */
const startTime = performance.now()

// DOMContentLoadedイベントで初回読み込み完了を測定
window.addEventListener('DOMContentLoaded', () => {
  const loadTime = performance.now() - startTime
  validatePerformanceRequirement(
    loadTime,
    PERFORMANCE_THRESHOLDS.INITIAL_LOAD,
    '初回読み込み'
  )
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QuizProvider>
      <App />
    </QuizProvider>
  </StrictMode>,
)
