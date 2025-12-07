# エラーハンドリングシステム

## 概要

このアプリケーションは、包括的なエラーハンドリングシステムを提供します。このシステムは以下の機能を含みます：

- **具体的なエラーメッセージ**: ユーザーに何が起きたかを明確に伝える
- **対処法の提案**: ユーザーが取るべき行動を提示
- **エラーの自動記録**: すべてのエラーを自動的にログに記録
- **5秒後の自動消去**: 重大でないエラーは自動的に消える
- **再試行機能**: ネットワークエラーなどで再試行オプションを提供

## 主要コンポーネント

### 1. ErrorInfo型

エラー情報を表す型です。

```typescript
interface ErrorInfo {
  code: string;           // エラーコード
  message: string;        // エラーメッセージ
  suggestion: string;     // 対処法の提案
  severity: ErrorSeverity; // 重要度
  timestamp: number;      // タイムスタンプ
  context?: Record<string, unknown>; // 追加のコンテキスト情報
}

type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';
```

### 2. ErrorHandlerクラス

エラーの記録、表示、回復を管理するクラスです。

#### 主要メソッド

##### createErrorInfo
ErrorInfo オブジェクトを作成します。

```typescript
const errorInfo = errorHandler.createErrorInfo(
  'ERROR_CODE',
  'エラーメッセージ',
  '対処法の提案',
  'error',
  { userId: '123' } // オプションのコンテキスト
);
```

##### logError
エラーをログに記録します（最大100件まで保持）。

```typescript
errorHandler.logError(errorInfo);
```

##### showError
エラーを記録し、UIに表示します。

```typescript
errorHandler.showError(errorInfo);
```

##### fromAppError
AppError（またはそのサブクラス）をErrorInfoに変換します。

```typescript
const appError = new InvalidHandError('手牌データが無効です');
const errorInfo = errorHandler.fromAppError(appError);
```

##### fromUnknownError
不明なエラーをErrorInfoに変換します。

```typescript
try {
  // 何か処理
} catch (error) {
  const errorInfo = errorHandler.fromUnknownError(error);
  showError(errorInfo);
}
```

##### retry
処理を自動的に再試行します。

```typescript
const result = await errorHandler.retry(
  async () => {
    // 処理
    return 'success';
  },
  3,    // 最大試行回数
  1000  // 待機時間（ミリ秒）
);
```

##### getErrorLog / clearErrorLog
エラーログを取得・クリアします。

```typescript
const log = errorHandler.getErrorLog();
errorHandler.clearErrorLog();
```

### 3. useErrorHandlerフック

Reactコンポーネントでエラーハンドリングを使用するためのカスタムフックです。

```typescript
const { 
  currentError,      // 現在表示中のエラー
  showError,         // エラーを表示
  clearError,        // エラーをクリア
  retryAction,       // 再試行アクション
  setRetryAction     // 再試行アクションを設定
} = useErrorHandler();
```

### 4. ErrorAlertコンポーネント

エラーメッセージを表示するUIコンポーネントです。

#### ErrorAlert

基本的なエラーアラートコンポーネント。

```typescript
<ErrorAlert
  message="エラーメッセージ"
  type="error"
  suggestion="対処法の提案"
  onClose={handleClose}
  autoDismiss={true}
  autoDismissDelay={5000}
  onRetry={handleRetry}
/>
```

#### ErrorAlertWithInfo

ErrorInfo型を直接受け取るコンポーネント。

```typescript
<ErrorAlertWithInfo
  errorInfo={errorInfo}
  onClose={handleClose}
  autoDismiss={true}
  autoDismissDelay={5000}
  onRetry={handleRetry}
/>
```

## 使用例

### 例1: 基本的な使い方

```typescript
import { useErrorHandler } from '../hooks/useErrorHandler';
import { errorHandler } from '../types/errors';
import { ErrorAlertWithInfo } from '../components/ErrorAlert';

function MyComponent() {
  const { currentError, showError, clearError } = useErrorHandler();

  const handleError = () => {
    const errorInfo = errorHandler.createErrorInfo(
      'CUSTOM_ERROR',
      'カスタムエラーが発生しました',
      'この操作を再試行してください',
      'error'
    );
    showError(errorInfo);
  };

  return (
    <div>
      {currentError && (
        <ErrorAlertWithInfo
          errorInfo={currentError}
          onClose={clearError}
        />
      )}
      <button onClick={handleError}>エラーを発生させる</button>
    </div>
  );
}
```

### 例2: AppErrorからの変換

```typescript
import { InvalidHandError } from '../types/errors';

try {
  // 手牌の検証
  if (!isValidHand(hand)) {
    throw new InvalidHandError('手牌の牌数が正しくありません');
  }
} catch (error) {
  if (error instanceof InvalidHandError) {
    const errorInfo = errorHandler.fromAppError(error);
    showError(errorInfo);
  }
}
```

### 例3: 再試行機能付きエラー

```typescript
const handleNetworkRequest = async () => {
  try {
    const result = await errorHandler.retry(
      async () => {
        const response = await fetch('/api/data');
        if (!response.ok) throw new Error('Network error');
        return response.json();
      },
      3,    // 最大3回試行
      1000  // 1秒待機
    );
    
    console.log('Success:', result);
  } catch (error) {
    const errorInfo = errorHandler.createErrorInfo(
      'NETWORK_ERROR',
      'ネットワークエラーが発生しました',
      'インターネット接続を確認して、再試行してください',
      'error'
    );
    
    // 手動再試行ボタンを提供
    setRetryAction(() => handleNetworkRequest);
    showError(errorInfo);
  }
};
```

### 例4: 重要度別のエラー

```typescript
// 情報メッセージ（5秒後に自動消去）
const infoError = errorHandler.createErrorInfo(
  'INFO',
  '設定を保存しました',
  '',
  'info'
);
showError(infoError);

// 警告メッセージ（5秒後に自動消去）
const warningError = errorHandler.createErrorInfo(
  'WARNING',
  '一部の設定が適用されませんでした',
  '設定を確認してください',
  'warning'
);
showError(warningError);

// エラーメッセージ（手動で閉じる必要あり）
const error = errorHandler.createErrorInfo(
  'ERROR',
  '問題の生成に失敗しました',
  'もう一度お試しください',
  'error'
);
showError(error);

// 重大なエラー（自動消去されない）
const criticalError = errorHandler.createErrorInfo(
  'CRITICAL',
  'アプリケーションエラーが発生しました',
  'ページを再読み込みしてください',
  'critical'
);
showError(criticalError);
```

## エラータイプ

アプリケーションで定義されているエラータイプ：

- **INVALID_HAND**: 無効な手牌データ
- **CALCULATION_ERROR**: 点数計算エラー
- **STORAGE_ERROR**: ストレージエラー
- **GENERATION_ERROR**: 問題生成エラー
- **INVALID_SELECTION**: 無効な選択
- **NETWORK_ERROR**: ネットワークエラー
- **UNKNOWN_ERROR**: 不明なエラー

## 自動消去の動作

- **info**: 5秒後に自動消去
- **warning**: 5秒後に自動消去
- **error**: 自動消去されない（手動で閉じる必要あり）
- **critical**: 自動消去されない（手動で閉じる必要あり）

## ベストプラクティス

1. **具体的なエラーメッセージを使用する**
   - ❌ 「エラーが発生しました」
   - ✅ 「手牌の牌数が正しくありません（14枚である必要があります）」

2. **実用的な対処法を提供する**
   - ❌ 「エラーを修正してください」
   - ✅ 「新しい問題を生成してください」

3. **適切な重要度を設定する**
   - 情報メッセージ: `info`
   - 警告: `warning`
   - エラー: `error`
   - 重大なエラー: `critical`

4. **コンテキスト情報を含める**
   ```typescript
   const errorInfo = errorHandler.createErrorInfo(
     'ERROR_CODE',
     'エラーメッセージ',
     '対処法',
     'error',
     { 
       userId: user.id,
       action: 'submit_answer',
       problemId: problem.id 
     }
   );
   ```

5. **AppErrorを使用する**
   - カスタムエラーには既存のAppErrorサブクラスを使用
   - 新しいエラータイプが必要な場合は、AppErrorを継承

## トラブルシューティング

### エラーが表示されない

1. `useErrorHandler`フックを使用しているか確認
2. `ErrorAlertWithInfo`コンポーネントをレンダリングしているか確認
3. `showError`を呼び出しているか確認

### エラーが自動消去されない

- `severity`が`error`または`critical`の場合、自動消去されません
- `autoDismiss`プロパティが`false`に設定されていないか確認

### 再試行ボタンが表示されない

- `setRetryAction`で再試行アクションを設定しているか確認
- `ErrorAlertWithInfo`に`onRetry`プロパティを渡しているか確認

## 参考

- [要件定義書 - 要件9: エラーハンドリングの改善](../../.kiro/specs/ui-ux-improvements/requirements.md#要件-9エラーハンドリングの改善)
- [設計書 - エラーハンドリング](../../.kiro/specs/ui-ux-improvements/design.md#エラーハンドリング)
- [ErrorHandlingExample.tsx](../components/ErrorHandlingExample.tsx) - 実装例
