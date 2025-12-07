# アニメーション効果の実装

## 概要

タスク15「アニメーション効果の追加」の実装により、以下のアニメーション効果が追加されました。

## 実装された機能

### 1. 正解・不正解時のアニメーション（要件 1.1, 1.2）

#### 正解時のアニメーション
- **animate-correct-shake**: 軽く揺れるアニメーション（0.5秒）
- **animate-correct-glow**: 緑色に光るアニメーション（0.8秒）
- **animate-count-up**: フェードインしながら上に移動（0.3秒）

適用箇所:
- `ResultModal`: 正解モーダルのコンテナとアイコン
- `AnswerSelector`: 正解の選択肢ボタン

#### 不正解時のアニメーション
- **animate-incorrect-shake**: 激しく揺れるアニメーション（0.5秒）
- **animate-incorrect-pulse**: 赤色にパルスするアニメーション（0.8秒）

適用箇所:
- `ResultModal`: 不正解モーダルのコンテナとアイコン
- `AnswerSelector`: 不正解の選択肢ボタン

### 2. 統計更新時のアニメーション（要件 3.5）

#### 統計値の更新アニメーション
- **animate-stat-update**: スケールアニメーション（0.4秒）
  - 値が1.0倍 → 1.1倍 → 1.0倍に変化
- **animate-count-up**: フェードインアニメーション（0.3秒）

適用箇所:
- `StatisticsDisplay`: 回答数、正解数、不正解数、正解率の表示
- 値が変更されたときのみアニメーションが適用される

実装の詳細:
```typescript
// 前回の値を保持して変更を検出
const [prevTotalAnswered, setPrevTotalAnswered] = React.useState(totalAnswered);
const totalChanged = totalAnswered !== prevTotalAnswered;

// 値が変更されたらアニメーションを適用
<div className={`text-3xl font-bold text-blue-600 ${totalChanged ? 'animate-stat-update' : ''}`}>
  {totalAnswered}
</div>
```

### 3. ローディング状態のアニメーション（要件 1.5）

#### LoadingSpinnerコンポーネント
新しく作成された再利用可能なローディングコンポーネント:

**バリエーション:**
1. **spinner**: 回転するスピナー
2. **dots**: バウンスする3つのドット
3. **pulse**: パルスする円

**サイズ:**
- small: 4x4 (1rem)
- medium: 8x8 (2rem)
- large: 12x12 (3rem)

**使用例:**
```typescript
<LoadingSpinner size="large" variant="dots" message="問題を生成中..." />
```

適用箇所:
- `QuizScreen`: 問題生成中のローディング表示
- `QuizScreen`: 回答送信ボタンのローディング状態

#### 回答送信時のローディング
回答送信ボタンに以下の機能を追加:
- 送信中は小さなスピナーを表示
- ボタンのテキストが「送信中...」に変更
- ボタンが無効化される
- 300msの遅延でローディングアニメーションを表示

### 4. 追加のアニメーション

既存のアニメーションも引き続き使用可能:
- **animate-fadeIn**: フェードイン（0.2秒）
- **animate-slideUp**: 下から上にスライド（0.3秒）
- **animate-slideDown**: 上から下にスライド（0.3秒）
- **animate-pulse-slow**: ゆっくりパルス（2秒、無限ループ）
- **animate-bounce-slow**: ゆっくりバウンス（1秒、無限ループ）

## CSSアニメーション定義

### 正解時のキーフレーム
```css
@keyframes correctShake {
  0%, 100% { transform: translateX(0) scale(1); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-2px) scale(1.02); }
  20%, 40%, 60%, 80% { transform: translateX(2px) scale(1.02); }
}

@keyframes correctGlow {
  0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
  50% { box-shadow: 0 0 20px 10px rgba(34, 197, 94, 0.3); }
  100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
}
```

### 不正解時のキーフレーム
```css
@keyframes incorrectShake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
  20%, 40%, 60%, 80% { transform: translateX(10px); }
}

@keyframes incorrectPulse {
  0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
  50% { box-shadow: 0 0 20px 10px rgba(239, 68, 68, 0.3); }
  100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
}
```

### 統計更新のキーフレーム
```css
@keyframes statUpdate {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

@keyframes countUp {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}
```

### ローディングのキーフレーム
```css
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

## デモコンポーネント

`AnimationExample.tsx`ファイルには、すべてのアニメーション効果を視覚的に確認できるデモコンポーネントが含まれています。

使用方法:
```typescript
import { AnimationExample } from './components/AnimationExample';

// アプリケーション内で表示
<AnimationExample />
```

## テスト

すべてのテストが正常に通過しています:
- 140個のテストすべてが成功
- TypeScriptの型エラーなし
- 既存の機能に影響なし

## パフォーマンス

アニメーションは以下の点でパフォーマンスを考慮しています:
- CSS transformとopacityを使用（GPUアクセラレーション）
- アニメーション時間は短く（0.2秒〜1秒）
- 無限ループアニメーションは控えめに使用
- prefers-reduced-motionへの対応準備完了（タスク14で実装済み）

## 今後の拡張

タスク14「アニメーション制御の実装」と統合することで:
- ユーザーがアニメーション速度を調整可能
- prefers-reduced-motionの自動検出
- アニメーションの完全な無効化オプション

## 関連ファイル

- `src/index.css`: アニメーションのキーフレームとクラス定義
- `src/components/LoadingSpinner.tsx`: ローディングコンポーネント
- `src/components/StatisticsDisplay.tsx`: 統計更新アニメーション
- `src/components/ResultModal.tsx`: 正解・不正解アニメーション
- `src/components/AnswerSelector.tsx`: 選択肢のアニメーション
- `src/components/QuizScreen.tsx`: ローディング状態の統合
- `src/components/AnimationExample.tsx`: デモコンポーネント
