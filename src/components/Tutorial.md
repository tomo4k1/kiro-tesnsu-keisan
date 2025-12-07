# チュートリアル機能

## 概要

チュートリアル機能は、初回訪問時にアプリケーションの使い方をステップバイステップで説明する機能です。ユーザーは各ステップを順番に進めることで、アプリの主要な機能を理解できます。

## 主な機能

### 1. ステップバイステップガイド
- 複数のステップで構成されたチュートリアル
- 各ステップで特定のUI要素をハイライト表示
- わかりやすい説明文とナビゲーション

### 2. スキップ機能
- ユーザーはいつでもチュートリアルをスキップ可能
- スキップ状態はローカルストレージに保存
- 再度表示することも可能

### 3. 完了状態の保存
- チュートリアル完了状態をローカルストレージに永続化
- 完了後は自動的に表示されない
- バージョン管理により、新機能追加時に再表示可能

### 4. キーボード操作
- 矢印キーでステップ間を移動
- Escapeキーでスキップ
- アクセシビリティに配慮した設計

## コンポーネント

### TutorialOverlay

チュートリアルを表示するメインコンポーネント。

```typescript
interface TutorialOverlayProps {
  steps: TutorialStep[];
  currentStep: number;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  onComplete: () => void;
  isVisible: boolean;
}
```

### TutorialStep型

各チュートリアルステップの定義。

```typescript
interface TutorialStep {
  id: string;                    // ステップの一意なID
  title: string;                 // ステップのタイトル
  description: string;           // ステップの説明
  targetElement?: string;        // ハイライトするUI要素のCSSセレクタ
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';  // ツールチップの位置
  action?: () => void;           // ステップ完了時に実行するアクション
}
```

## カスタムフック

### useTutorial

チュートリアルの状態管理を行うカスタムフック。

```typescript
const {
  currentStep,      // 現在のステップ番号
  isVisible,        // チュートリアルの表示状態
  settings,         // チュートリアル設定
  handleNext,       // 次のステップへ
  handlePrevious,   // 前のステップへ
  handleSkip,       // スキップ
  handleComplete,   // 完了
  showTutorial,     // チュートリアルを表示
  resetTutorial,    // チュートリアルをリセット
} = useTutorial(steps);
```

## サービス

### TutorialManager

チュートリアル設定の永続化を管理するサービスクラス。

```typescript
// 設定の保存
TutorialManager.saveSettings(settings);

// 設定の読み込み
const settings = TutorialManager.loadSettings();

// 完了としてマーク
TutorialManager.markAsCompleted();

// スキップとしてマーク
TutorialManager.markAsSkipped();

// 表示すべきかチェック
const shouldShow = TutorialManager.shouldShowTutorial();

// 設定のリセット
TutorialManager.resetSettings();
```

## 使用例

### 基本的な使い方

```typescript
import { TutorialOverlay } from './components/TutorialOverlay';
import { useTutorial } from './hooks/useTutorial';
import type { TutorialStep } from './types';

function App() {
  const steps: TutorialStep[] = [
    {
      id: 'welcome',
      title: 'ようこそ！',
      description: 'このアプリの使い方を説明します。',
      position: 'center',
    },
    {
      id: 'feature1',
      title: '機能1',
      description: 'この機能の使い方です。',
      targetElement: '#feature1',
      position: 'bottom',
    },
    // ... 他のステップ
  ];

  const {
    currentStep,
    isVisible,
    handleNext,
    handlePrevious,
    handleSkip,
    handleComplete,
  } = useTutorial(steps);

  return (
    <div>
      {/* アプリのコンテンツ */}
      
      <TutorialOverlay
        steps={steps}
        currentStep={currentStep}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSkip={handleSkip}
        onComplete={handleComplete}
        isVisible={isVisible}
      />
    </div>
  );
}
```

### 手動でチュートリアルを表示

```typescript
function HelpButton() {
  const { showTutorial } = useTutorial(steps);

  return (
    <button onClick={showTutorial}>
      ヘルプを表示
    </button>
  );
}
```

## スタイリング

チュートリアルオーバーレイは以下の要素で構成されています：

1. **背景オーバーレイ**: 半透明の黒背景
2. **ハイライト領域**: ターゲット要素を囲む青い枠線
3. **ツールチップ**: 白い背景のカード形式
4. **プログレスバー**: 進捗を示す青いバー

すべてTailwind CSSでスタイリングされており、カスタマイズが容易です。

## アクセシビリティ

- `role="dialog"` と `aria-modal="true"` でモーダルダイアログとして認識
- `aria-labelledby` と `aria-describedby` で適切なラベル付け
- キーボード操作に完全対応
- プログレスバーに `role="progressbar"` を設定
- すべてのボタンに `aria-label` を設定

## 永続化

チュートリアル設定は以下のキーでローカルストレージに保存されます：

- キー: `mahjong-quiz-tutorial-settings`
- 形式: JSON

```json
{
  "completed": false,
  "skipped": false,
  "lastShownVersion": "1.0.0"
}
```

## バージョン管理

チュートリアルのバージョンを管理することで、新機能追加時に既存ユーザーにも再度チュートリアルを表示できます。

```typescript
// TutorialManager内で定義
private static readonly CURRENT_VERSION = '1.0.0';
```

バージョンが変更されると、完了済みのユーザーにも再度チュートリアルが表示されます。

## テスト

チュートリアル機能のテストには以下の項目を含めます：

1. **ステップナビゲーション**: 次へ/戻るボタンの動作
2. **スキップ機能**: スキップボタンとEscapeキーの動作
3. **完了機能**: 最後のステップでの完了処理
4. **永続化**: 設定の保存と読み込み
5. **キーボード操作**: 矢印キーでのナビゲーション
6. **ハイライト**: ターゲット要素の正しいハイライト

## 今後の拡張

- アニメーション効果の追加
- ステップのスキップ（特定のステップのみ）
- 条件付きステップ（ユーザーの状態に応じて表示）
- 多言語対応
- カスタムテーマ
