import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
  build: {
    // パフォーマンス最適化: ビルド設定
    rollupOptions: {
      output: {
        // コード分割の最適化
        manualChunks: {
          // Reactライブラリを別チャンクに分離
          'react-vendor': ['react', 'react-dom'],
        },
      },
    },
    // チャンクサイズ警告の閾値を調整
    chunkSizeWarningLimit: 1000,
    // ソースマップを無効化して本番ビルドを高速化
    sourcemap: false,
  },
  // 開発サーバーの最適化
  server: {
    // HMRの最適化
    hmr: {
      overlay: true,
    },
  },
})
