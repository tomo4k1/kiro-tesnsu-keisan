# クイズ状態管理

このディレクトリには、麻雀点数計算クイズアプリケーションの状態管理が含まれています。

## 概要

React Context APIを使用して、アプリケーション全体の状態を一元管理します。

## 使用方法

### 1. プロバイダーの設定

アプリケーションのルートで`QuizProvider`をラップします：

```tsx
import { QuizProvider } from './context';

function App() {
  return (
    <QuizProvider>
      {/* アプリケーションのコンポーネント */}
    </QuizProvider>
  );
}
```

### 2. コンポーネントでの使用

`useQuiz`フックを使用して状態とアクションにアクセスします：

```tsx
import { useQuiz } from './context';

function MyComponent() {
  const {
    state,
    generateNewProblem,
    updateUserAnswer,
    submitAnswer,
    resetAnswer,
    resetSession,
    updateSettings,
  } = useQuiz();

  // 状態の使用
  console.log(state.currentProblem);
  console.log(state.statistics);
  console.log(state.settings);

  // アクションの使用
  const handleGenerateProblem = () => {
    generateNewProblem(); // または generateNewProblem('easy')
  };

  const handleAnswerChange = () => {
    updateUserAnswer({ fu: 30 });
    updateUserAnswer({ han: 3 });
    updateUserAnswer({ score: 3900 });
  };

  const handleSubmit = () => {
    const isCorrect = submitAnswer();
    console.log(isCorrect ? '正解' : '不正解');
  };

  return (
    // JSX
  );
}
```

## 状態の構造

### SessionState

```typescript
interface SessionState {
  currentProblem: Problem | null;      // 現在の問題
  userAnswer: Partial<Answer>;         // ユーザーの回答
  isAnswered: boolean;                 // 回答済みかどうか
  statistics: Statistics;              // 統計情報
  settings: GameSettings;              // ゲーム設定
}
```

## 利用可能なアクション

### generateNewProblem(difficulty?: Difficulty)
新しい問題を生成します。難易度を指定することもできます。

```tsx
generateNewProblem();           // ランダムな難易度
generateNewProblem('easy');     // 簡単
generateNewProblem('medium');   // 中級
generateNewProblem('hard');     // 難しい
```

### updateUserAnswer(answer: Partial<Answer>)
ユーザーの回答を更新します。部分的な更新が可能です。

```tsx
updateUserAnswer({ fu: 30 });
updateUserAnswer({ han: 3 });
updateUserAnswer({ score: 3900 });
```

### submitAnswer(): boolean
回答を送信して判定します。正解の場合は`true`、不正解の場合は`false`を返します。

```tsx
const isCorrect = submitAnswer();
if (isCorrect) {
  console.log('正解です！');
} else {
  console.log('不正解です。');
}
```

### resetAnswer()
回答をリセットして、次の問題に進む準備をします。

```tsx
resetAnswer();
```

### resetSession()
セッション全体をリセットします。統計情報もクリアされます。

```tsx
resetSession();
```

### updateSettings(settings: GameSettings)
ゲーム設定を更新します。設定は自動的にローカルストレージに保存されます。

```tsx
updateSettings({
  redDora: true,
  kuitan: true,
  atozuke: true,
});
```

## 要件との対応

- **要件 8.4**: 状態管理を一元化して、プラットフォーム間での移植性を高める
- **要件 7.5**: ユーザーのルール設定を保存して、次回起動時に復元する
- **要件 1.3**: 符・飜数・点数のすべてが選択されている場合のみ回答を受け付ける
- **要件 3.1, 3.2, 3.3**: 統計情報の管理と表示

## テスト

状態管理のテストは`QuizContext.test.tsx`に含まれています。

```bash
npm test -- src/context/QuizContext.test.tsx
```
