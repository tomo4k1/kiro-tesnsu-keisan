# 設計書

## 概要

麻雀点数計算学習アプリケーションは、クイズ形式で麻雀の点数計算（符・飜数・点数）を学習できるWebアプリケーションです。シンプルで直感的なUIを提供し、ユーザーは提示された手牌に対して正しい符・飜数・点数を選択肢から選んで回答します。将来的なAndroid移行を見据え、ビジネスロジックとUI層を明確に分離した設計とします。

## アーキテクチャ

### 技術スタック

- **フロントエンド**: React + TypeScript
- **状態管理**: React Context API または Zustand
- **スタイリング**: Tailwind CSS（レスポンシブデザイン対応）
- **ビルドツール**: Vite
- **テスト**: Vitest（ユニットテスト）、fast-check（プロパティベーステスト）

### アーキテクチャパターン

レイヤードアーキテクチャを採用し、以下の層に分離します：

1. **プレゼンテーション層（UI層）**
   - Reactコンポーネント
   - ユーザーインタラクションの処理
   - 状態の表示

2. **アプリケーション層**
   - クイズロジック（問題生成、回答判定、統計計算）
   - 状態管理
   - ルール設定管理

3. **ドメイン層**
   - 麻雀点数計算ロジック
   - 手牌データモデル
   - ルール定義

4. **データ層**
   - 問題データの管理
   - ローカルストレージへの設定保存

```
┌─────────────────────────────────────┐
│      プレゼンテーション層            │
│  (React Components)                 │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│      アプリケーション層              │
│  (Quiz Logic, State Management)     │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│         ドメイン層                   │
│  (Score Calculation, Models)        │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│         データ層                     │
│  (Problem Data, LocalStorage)       │
└─────────────────────────────────────┘
```

## コンポーネントとインターフェース

### UIコンポーネント

#### 1. QuizScreen
メインのクイズ画面コンポーネント

**責務:**
- 問題の表示
- 選択肢の表示と選択状態の管理
- 回答ボタンと次の問題ボタンの表示
- 統計情報の表示

**Props:**
```typescript
interface QuizScreenProps {
  onExit: () => void;
}
```

#### 2. HandDisplay
手牌を表示するコンポーネント

**責務:**
- 牌を視覚的にわかりやすく表示
- 鳴きや和了牌の強調表示

**Props:**
```typescript
interface HandDisplayProps {
  hand: Hand;
  winningTile?: Tile;
}
```

#### 3. AnswerSelector
符・飜数・点数の選択肢を表示するコンポーネント

**責務:**
- 選択肢のボタン表示
- 選択状態の視覚的フィードバック
- 正解・不正解の表示

**Props:**
```typescript
interface AnswerSelectorProps {
  type: 'fu' | 'han' | 'score';
  options: number[];
  selectedValue: number | null;
  correctValue: number | null;
  isAnswered: boolean;
  onSelect: (value: number) => void;
}
```

#### 4. StatisticsDisplay
統計情報を表示するコンポーネント

**責務:**
- 回答数、正解数、不正解数の表示
- 正解率の表示

**Props:**
```typescript
interface StatisticsDisplayProps {
  totalAnswered: number;
  correctCount: number;
  incorrectCount: number;
}
```

#### 5. SettingsPanel
ルール設定を行うコンポーネント

**責務:**
- 赤ドラ、喰いタン、後付けの設定切り替え
- 設定の保存

**Props:**
```typescript
interface SettingsPanelProps {
  settings: GameSettings;
  onSettingsChange: (settings: GameSettings) => void;
}
```

#### 6. ResultModal
回答結果を表示するモーダル

**責務:**
- 正解・不正解の表示
- 正解の符・飜数・点数の表示
- 次の問題ボタン

**Props:**
```typescript
interface ResultModalProps {
  isCorrect: boolean;
  userAnswer: Answer;
  correctAnswer: Answer;
  onNext: () => void;
}
```

### ドメインモデル

#### ScoreCalculator
麻雀の点数計算を行うクラス

**メソッド:**
```typescript
class ScoreCalculator {
  constructor(settings: GameSettings);
  
  calculateFu(hand: Hand, winCondition: WinCondition): number;
  calculateHan(hand: Hand, winCondition: WinCondition): number;
  calculateScore(fu: number, han: number, isDealer: boolean, winType: WinType): number;
}
```

#### QuizManager
クイズの進行を管理するクラス

**メソッド:**
```typescript
class QuizManager {
  generateProblem(difficulty?: Difficulty): Problem;
  checkAnswer(problem: Problem, answer: Answer): boolean;
  getStatistics(): Statistics;
  resetSession(): void;
}
```

#### ProblemGenerator
問題を生成するクラス

**メソッド:**
```typescript
class ProblemGenerator {
  constructor(settings: GameSettings);
  
  generate(difficulty?: Difficulty): Problem;
  generateOptions(correctValue: number, type: 'fu' | 'han' | 'score'): number[];
}
```

## データモデル

### 牌（Tile）
```typescript
type TileType = 'man' | 'pin' | 'sou' | 'honor';
type TileValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type HonorType = 'east' | 'south' | 'west' | 'north' | 'white' | 'green' | 'red';

interface Tile {
  type: TileType;
  value?: TileValue;
  honor?: HonorType;
  isRed?: boolean; // 赤ドラ
}
```

### 手牌（Hand）
```typescript
interface Meld {
  type: 'chi' | 'pon' | 'kan' | 'ankan';
  tiles: Tile[];
}

interface Hand {
  closedTiles: Tile[];
  melds: Meld[];
  winningTile: Tile;
  isDealer: boolean;
  winType: 'tsumo' | 'ron';
  prevalentWind: 'east' | 'south' | 'west' | 'north';
  seatWind: 'east' | 'south' | 'west' | 'north';
  dora: Tile[];
}
```

### 問題（Problem）
```typescript
interface Problem {
  id: string;
  hand: Hand;
  correctFu: number;
  correctHan: number;
  correctScore: number;
  fuOptions: number[];
  hanOptions: number[];
  scoreOptions: number[];
  difficulty: Difficulty;
}

type Difficulty = 'easy' | 'medium' | 'hard';
```

### 回答（Answer）
```typescript
interface Answer {
  fu: number;
  han: number;
  score: number;
}
```

### ゲーム設定（GameSettings）
```typescript
interface GameSettings {
  redDora: boolean;      // 赤ドラ有無
  kuitan: boolean;       // 喰いタン有無
  atozuke: boolean;      // 後付け有無
}
```

### 統計情報（Statistics）
```typescript
interface Statistics {
  totalAnswered: number;
  correctCount: number;
  incorrectCount: number;
  correctRate: number; // パーセンテージ
}
```

### セッション状態（SessionState）
```typescript
interface SessionState {
  currentProblem: Problem | null;
  userAnswer: Partial<Answer>;
  isAnswered: boolean;
  statistics: Statistics;
  settings: GameSettings;
}
```

## 正確性プロパティ

*プロパティとは、システムのすべての有効な実行において真であるべき特性や動作のことです。これは、人間が読める仕様と機械で検証可能な正確性保証との橋渡しとなります。*

### プロパティ 1: 有効な手牌の生成
*任意の*生成された問題に対して、手牌の牌数は14枚（13枚+和了牌1枚）でなければならない
**検証: 要件 1.1**

### プロパティ 2: 選択肢の完全性
*任意の*生成された問題に対して、符・飜数・点数の3種類の選択肢群が提供され、それぞれに正解が含まれなければならない
**検証: 要件 1.2**

### プロパティ 3: 回答完全性チェック
*任意の*ユーザー回答に対して、符・飜数・点数のすべてが選択されている場合のみ、システムは回答を受け付けなければならない
**検証: 要件 1.3**

### プロパティ 4: 判定の正確性
*任意の*回答に対して、ユーザーの符・飜数・点数がすべて正解と一致する場合のみ、システムは正解と判定しなければならない
**検証: 要件 1.4**

### プロパティ 5: 正解表示の正確性
*任意の*不正解の回答に対して、システムが表示する正解の符・飜数・点数は、ScoreCalculatorが計算した値と一致しなければならない
**検証: 要件 1.5**

### プロパティ 6: 選択状態の反映
*任意の*選択操作に対して、選択後の状態には選択された値が含まれなければならない
**検証: 要件 2.3**

### プロパティ 7: 統計の累積性
*任意の*セッションに対して、回答数は正解数と不正解数の合計と一致しなければならない
**検証: 要件 3.1, 3.2**

### プロパティ 8: 統計計算の正確性
*任意の*セッションに対して、表示される正解率は（正解数 / 回答数 × 100）と一致しなければならない（回答数が0の場合は0%）
**検証: 要件 3.3**

### プロパティ 9: 次の問題の独立性
*任意の*2つの連続する問題に対して、問題IDは異なっていなければならない
**検証: 要件 4.2**

### プロパティ 10: 点数計算の一貫性
*任意の*手牌と和了条件に対して、ScoreCalculatorで計算された符・飜数・点数は、同じ入力に対して常に同じ結果を返さなければならない
**検証: 要件 5.1, 5.2, 5.3**

### プロパティ 11: 親子点数比の正確性
*任意の*同じ符・飜数の組み合わせに対して、親の点数は子の点数の1.5倍でなければならない
**検証: 要件 5.4**

### プロパティ 12: 難易度の多様性
*任意の*10問の連続する問題に対して、少なくとも2つ以上の異なる難易度レベルが含まれなければならない
**検証: 要件 6.4**

### プロパティ 13: 赤ドラ設定の反映
*任意の*赤5を含む手牌に対して、赤ドラ設定が有効な場合、飜数計算に赤ドラが加算され、無効な場合は加算されてはならない
**検証: 要件 7.1, 7.4**

### プロパティ 14: 喰いタン設定の反映
*任意の*鳴いたタンヤオの手牌に対して、喰いタン設定が有効な場合のみタンヤオが役として認められなければならない
**検証: 要件 7.2, 7.4**

### プロパティ 15: 設定の永続化ラウンドトリップ
*任意の*ルール設定に対して、保存してから読み込んだ設定は、保存前の設定と一致しなければならない
**検証: 要件 7.5**

### プロパティ 16: レスポンス時間の保証
*任意の*ユーザー操作（回答送信、次の問題）に対して、システムは1秒以内に応答しなければならない
**検証: 要件 9.1, 9.2**

## エラーハンドリング

### エラーの種類と対処

1. **無効な手牌データ**
   - 検証: 手牌の牌数が正しいか（14枚または13枚+1枚）
   - 対処: エラーログを記録し、新しい問題を生成

2. **計算エラー**
   - 検証: 符・飜数・点数の計算結果が有効範囲内か
   - 対処: エラーログを記録し、フォールバック値を使用

3. **ローカルストレージエラー**
   - 検証: 設定の保存・読み込みが成功したか
   - 対処: デフォルト設定を使用し、ユーザーに通知

4. **問題生成エラー**
   - 検証: 問題データが正しく生成されたか
   - 対処: 再試行（最大3回）、失敗時はデフォルト問題を使用

5. **無効な選択肢**
   - 検証: ユーザーが選択した値が選択肢に含まれるか
   - 対処: 選択を無効化し、再選択を促す

### エラーメッセージ

すべてのエラーメッセージは日本語で表示し、ユーザーにわかりやすい表現を使用します。

```typescript
const ERROR_MESSAGES = {
  INVALID_HAND: '手牌データが無効です。新しい問題を生成します。',
  CALCULATION_ERROR: '点数計算でエラーが発生しました。',
  STORAGE_ERROR: '設定の保存に失敗しました。デフォルト設定を使用します。',
  GENERATION_ERROR: '問題の生成に失敗しました。もう一度お試しください。',
  INVALID_SELECTION: '無効な選択です。もう一度選択してください。',
};
```

## テスト戦略

### ユニットテスト

ユニットテストは、個々の関数やコンポーネントが正しく動作することを検証します。以下の領域をカバーします：

1. **点数計算ロジック**
   - 基本的な符計算（例: 平和、七対子）
   - 基本的な飜数計算（例: 立直、ドラ）
   - 基本的な点数計算（例: 30符3飜、40符2飜）
   - エッジケース（例: 役満、数え役満）

2. **問題生成**
   - 有効な手牌が生成されること
   - 選択肢に正解が含まれること
   - 選択肢が適切に分散していること

3. **統計計算**
   - 正解率の計算が正確であること
   - 回答数のカウントが正確であること

4. **設定管理**
   - 設定の保存と読み込みが正しく動作すること
   - デフォルト設定が正しく適用されること

### プロパティベーステスト

プロパティベーステストは、すべての入力に対して成立すべき普遍的な性質を検証します。fast-checkライブラリを使用し、各テストは最低100回の反復を実行します。

各プロパティベーステストには、設計書の正確性プロパティを参照するコメントを付けます：
```typescript
// Feature: mahjong-score-quiz, Property 1: 手牌表示の一貫性
```

1. **点数計算の一貫性**
   - プロパティ9, 10, 11, 12を検証
   - ランダムな手牌に対して計算が一貫していること

2. **統計の整合性**
   - プロパティ6, 7を検証
   - 統計値が常に数学的に正しいこと

3. **設定の永続化**
   - プロパティ16を検証
   - 任意の設定値が保存・復元されること

4. **UI状態の一貫性**
   - プロパティ2, 5を検証
   - 選択状態が常に正しく反映されること

### テストツール

- **Vitest**: ユニットテストフレームワーク
- **fast-check**: プロパティベーステストライブラリ
- **React Testing Library**: Reactコンポーネントのテスト
- **@testing-library/user-event**: ユーザーインタラクションのシミュレーション

### テスト実行設定

```typescript
// vitest.config.ts
export default {
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
};
```

プロパティベーステストの設定：
```typescript
// 各プロパティテストは最低100回実行
fc.assert(
  fc.property(/* ... */),
  { numRuns: 100 }
);
```
