# プロジェクト構造

## ディレクトリ構成

```
kiro-tesnsu-keisan/
├── .kiro/
│   └── specs/
│       └── mahjong-score-quiz/
│           ├── requirements.md    # 要件定義書
│           ├── design.md          # 設計書
│           └── tasks.md           # 実装計画
├── src/
│   ├── components/                # UIコンポーネント
│   │   ├── HandDisplay.tsx       # 手牌表示コンポーネント
│   │   ├── AnswerSelector.tsx    # 回答選択コンポーネント
│   │   ├── StatisticsDisplay.tsx # 統計表示コンポーネント
│   │   ├── SettingsPanel.tsx     # 設定パネルコンポーネント
│   │   ├── ResultModal.tsx       # 結果モーダルコンポーネント
│   │   ├── QuizExample.tsx       # クイズ例示コンポーネント
│   │   └── index.ts              # コンポーネントエクスポート
│   ├── context/                   # React Context
│   │   ├── QuizContext.tsx       # クイズ状態管理
│   │   └── index.ts              # コンテキストエクスポート
│   ├── domain/                    # ドメインロジック
│   │   └── ScoreCalculator.ts    # 点数計算ロジック
│   ├── services/                  # サービス層
│   │   ├── ProblemGenerator.ts   # 問題生成サービス
│   │   ├── QuizManager.ts        # クイズ管理サービス
│   │   └── SettingsManager.ts    # 設定管理サービス
│   ├── types/                     # TypeScript型定義
│   │   └── index.ts              # 型定義
│   ├── test/                      # テスト関連
│   │   ├── setup.ts              # テストセットアップ
│   │   ├── setup.test.ts         # セットアップ検証テスト
│   │   └── fast-check.test.ts    # fast-check検証テスト
│   ├── App.tsx                    # メインアプリケーション
│   ├── main.tsx                   # エントリーポイント
│   └── index.css                  # グローバルスタイル
├── public/                        # 静的ファイル
├── dist/                          # ビルド出力
├── node_modules/                  # 依存パッケージ
├── index.html                     # HTMLテンプレート
├── package.json                   # プロジェクト設定
├── tsconfig.json                  # TypeScript設定
├── vite.config.ts                 # Vite設定
├── tailwind.config.js             # Tailwind CSS設定
├── postcss.config.js              # PostCSS設定
└── README.md                      # プロジェクト説明
```

## 主要な設定ファイル

### package.json
プロジェクトの依存関係とスクリプトを定義

### vite.config.ts
Viteのビルド設定とVitest設定を含む

### tailwind.config.js
Tailwind CSSのカスタマイズ設定

### tsconfig.json
TypeScriptのコンパイラオプション

## インストール済みパッケージ

### 本番依存関係
- react: ^19.2.0
- react-dom: ^19.2.0

### 開発依存関係
- vite: ^7.2.4
- typescript: ~5.9.3
- @vitejs/plugin-react: ^5.1.1
- tailwindcss: 最新版
- @tailwindcss/postcss: 最新版
- vitest: 最新版
- @testing-library/react: 最新版
- @testing-library/jest-dom: 最新版
- @testing-library/user-event: 最新版
- fast-check: 最新版
- jsdom: 最新版

## 実装済みの機能

### 完了したタスク
1. ✅ プロジェクトのセットアップと基本構造の構築（タスク1）
2. ✅ データモデルとTypeScript型定義の作成（タスク2）
3. ✅ 麻雀点数計算ロジックの実装（タスク3.1）
4. ✅ ルール設定機能の実装（タスク4.1, 4.3）
5. ✅ 問題生成ロジックの実装（タスク5.1）
6. ✅ クイズ管理ロジックの実装（タスク6.1）
7. ✅ 状態管理の実装（タスク8.1）
8. ✅ UIコンポーネントの実装（タスク9）
   - HandDisplay: 手牌を視覚的に表示
   - AnswerSelector: 符・飜数・点数の選択肢表示
   - StatisticsDisplay: 統計情報表示
   - SettingsPanel: ルール設定パネル
   - ResultModal: 回答結果モーダル

### 次のステップ
1. メインのQuizScreenコンポーネントの実装（タスク10）
2. スタイリングとレスポンシブデザインの実装（タスク11）
3. パフォーマンス最適化（タスク12）
4. エラーハンドリングの実装（タスク13）
