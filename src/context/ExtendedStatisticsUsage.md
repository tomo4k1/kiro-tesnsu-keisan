# 拡張統計情報の使用方法

## 概要

QuizContextに拡張統計情報（ExtendedStatistics）が統合されました。これにより、以下の詳細な統計情報にアクセスできるようになりました：

- 難易度別の正解率（要件 3.1）
- 最近10問の正誤履歴（要件 3.2）
- 連続正解数（現在と最高）（要件 3.3）
- 学習時間（要件 3.4）

## 使用方法

### 1. QuizContextから拡張統計情報を取得

```typescript
import { useQuiz } from '../context/QuizContext';

function MyComponent() {
  const { state } = useQuiz();
  
  // 基本統計情報（従来通り）
  const basicStats = state.statistics;
  
  // 拡張統計情報（新規追加）
  const extendedStats = state.extendedStatistics;
  
  return (
    <div>
      <h2>基本統計</h2>
      <p>回答数: {basicStats.totalAnswered}</p>
      <p>正解率: {basicStats.correctRate.toFixed(1)}%</p>
      
      <h2>拡張統計</h2>
      <p>現在の連続正解数: {extendedStats.currentStreak}</p>
      <p>最高連続正解数: {extendedStats.bestStreak}</p>
      <p>学習時間: {extendedStats.totalStudyTime}秒</p>
      
      <h3>難易度別正解率</h3>
      <ul>
        <li>初級: {extendedStats.byDifficulty.easy.rate.toFixed(1)}%</li>
        <li>中級: {extendedStats.byDifficulty.medium.rate.toFixed(1)}%</li>
        <li>上級: {extendedStats.byDifficulty.hard.rate.toFixed(1)}%</li>
      </ul>
      
      <h3>最近10問</h3>
      <div>
        {extendedStats.recentTen.map((isCorrect, index) => (
          <span key={index}>{isCorrect ? '○' : '×'}</span>
        ))}
      </div>
    </div>
  );
}
```

### 2. DetailedStatisticsコンポーネントの使用例

```typescript
import { useQuiz } from '../context/QuizContext';
import { DetailedStatistics } from '../components/DetailedStatistics';

function StatisticsPage() {
  const { state, resetSession } = useQuiz();
  
  return (
    <DetailedStatistics
      statistics={state.extendedStatistics}
      onReset={resetSession}
    />
  );
}
```

## データ構造

### ExtendedStatistics型

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
  total: number;    // 回答数
  correct: number;  // 正解数
  rate: number;     // 正解率（%）
}
```

## 実装の詳細

### QuizManager

QuizManagerは内部で回答履歴（AnswerHistory[]）を保持し、各回答時に以下の情報を記録します：

```typescript
interface AnswerHistory {
  isCorrect: boolean;
  difficulty: Difficulty;
  timestamp: number;
  problemId: string;
}
```

### 統計計算

拡張統計情報は`calculateExtendedStatistics`関数によって計算されます：

```typescript
import { calculateExtendedStatistics } from '../utils/statisticsCalculator';

const extendedStats = calculateExtendedStatistics(answerHistory);
```

### セッションリセット

セッションをリセットすると、回答履歴と統計情報がすべてクリアされます：

```typescript
const { resetSession } = useQuiz();

// セッションをリセット
resetSession();
```

## 注意事項

1. **パフォーマンス**: 拡張統計情報は回答履歴全体から計算されるため、回答数が増えると計算コストが増加します。ただし、現在の実装では十分に高速です。

2. **永続化**: 現在、回答履歴はセッション中のみ保持されます。ページをリロードすると履歴はクリアされます。

3. **互換性**: 既存のコードは`state.statistics`を使用して基本統計情報にアクセスできます。拡張統計情報は`state.extendedStatistics`から取得します。

## テスト

拡張統計情報の計算ロジックは`src/utils/statisticsCalculator.test.ts`でテストされています。QuizContextとの統合は`src/context/QuizContext.test.tsx`でテストされています。
