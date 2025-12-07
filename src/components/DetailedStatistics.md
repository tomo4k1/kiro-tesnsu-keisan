# DetailedStatistics コンポーネント

## 概要

DetailedStatisticsコンポーネントは、麻雀点数計算クイズアプリケーションの詳細な統計情報を表示するコンポーネントです。

## 機能

### 実装された要件

- **要件 3.1**: 難易度別の正解率を表示
- **要件 3.2**: 最近の10問の正解率を表示
- **要件 3.3**: 連続正解数を表示
- **要件 3.4**: 学習時間を表示
- **要件 3.5**: アニメーション付きで統計の変化を表示

### 主な特徴

1. **基本統計情報**
   - 回答数
   - 正解数
   - 正解率
   - 学習時間（人間が読みやすい形式）

2. **難易度別統計**
   - 初級、中級、上級それぞれの正解率
   - 各難易度の回答数と正解数
   - プログレスバーによる視覚的表示

3. **連続正解数**
   - 現在の連続正解数
   - 最高連続正解数

4. **最近10問の結果**
   - 視覚的な○×表示
   - 最近10問の正解率

5. **励ましメッセージ**
   - 正解率に応じた適切なメッセージ表示

6. **アニメーション効果**
   - フェードインアニメーション
   - ホバー時のシャドウ効果
   - スムーズなトランジション

## 使用方法

### 基本的な使用例

```tsx
import { DetailedStatistics } from './components/DetailedStatistics';
import type { ExtendedStatistics } from './types';

function App() {
  const statistics: ExtendedStatistics = {
    totalAnswered: 20,
    correctCount: 15,
    incorrectCount: 5,
    correctRate: 75,
    byDifficulty: {
      easy: { total: 8, correct: 7, rate: 87.5 },
      medium: { total: 7, correct: 5, rate: 71.4 },
      hard: { total: 5, correct: 3, rate: 60 },
    },
    recentTen: [true, true, false, true, true, true, false, true, true, true],
    currentStreak: 3,
    bestStreak: 5,
    totalStudyTime: 1845, // 秒単位
    sessionStartTime: Date.now(),
  };

  const handleReset = () => {
    // 統計をリセットする処理
  };

  return (
    <DetailedStatistics 
      statistics={statistics} 
      onReset={handleReset} 
    />
  );
}
```

### Props

```typescript
interface DetailedStatisticsProps {
  statistics: ExtendedStatistics;  // 必須: 表示する統計情報
  onReset?: () => void;            // オプション: リセットボタンのハンドラー
}
```

### ExtendedStatistics 型

```typescript
interface ExtendedStatistics {
  // 基本統計
  totalAnswered: number;
  correctCount: number;
  incorrectCount: number;
  correctRate: number;
  
  // 難易度別統計
  byDifficulty: {
    easy: DifficultyStats;
    medium: DifficultyStats;
    hard: DifficultyStats;
  };
  
  // 最近10問の正誤
  recentTen: boolean[];
  
  // 連続正解数
  currentStreak: number;
  bestStreak: number;
  
  // 学習時間（秒）
  totalStudyTime: number;
  sessionStartTime: number;
}

interface DifficultyStats {
  total: number;
  correct: number;
  rate: number;
}
```

## 学習時間のフォーマット

学習時間は自動的に人間が読みやすい形式に変換されます：

- 60秒未満: "45秒"
- 60秒以上1時間未満: "2分5秒" または "3分"
- 1時間以上: "1時間30分" または "2時間"

## スタイリング

コンポーネントはTailwind CSSを使用してスタイリングされています。以下のカスタマイズが可能です：

- 色: 各統計カードの背景色とテキスト色
- アニメーション: `animate-fade-in` クラスによるフェードイン効果
- レスポンシブ: モバイル、タブレット、デスクトップに対応

## アクセシビリティ

- リセットボタンに適切な `aria-label` を設定
- 最近10問の各結果に `aria-label` を設定
- キーボードナビゲーションに対応
- 色以外の情報提供（アイコン、テキスト）

## テスト

18個のユニットテストが実装されており、すべての機能が正しく動作することを確認しています：

```bash
npm test -- DetailedStatistics.test.tsx
```

## 例

実際の動作を確認するには、`DetailedStatisticsExample.tsx` を参照してください。このファイルには、インタラクティブなデモが含まれています。

## 統合

このコンポーネントは、次のタスク（タスク11）でQuizContextに統合される予定です。統合後は、アプリケーション全体で統計情報が自動的に追跡され、このコンポーネントで表示されます。
