# 設計書：UI/UX改善

## 概要

麻雀点数計算クイズアプリケーションのUI/UXを大幅に改善し、より直感的で使いやすく、学習効果の高いアプリケーションを実現します。この設計では、視覚的フィードバックの強化、学習支援機能の追加、キーボード操作対応、アクセシビリティの向上など、13の主要な改善領域をカバーします。

## アーキテクチャ

### 全体構成

現在のReact + TypeScript + Tailwind CSSの構成を維持しつつ、以下のレイヤーを強化します：

```
┌─────────────────────────────────────────┐
│         プレゼンテーション層             │
│  (UI Components + Animations)           │
├─────────────────────────────────────────┤
│         ビジネスロジック層               │
│  (Context + Hooks + Services)           │
├─────────────────────────────────────────┤
│         ユーティリティ層                 │
│  (Helpers + Formatters + Validators)    │
├─────────────────────────────────────────┤
│         永続化層                         │
│  (LocalStorage + Settings Manager)      │
└─────────────────────────────────────────┘
```

### 新規追加コンポーネント

1. **ExplanationPanel**: 解説表示コンポーネント
2. **DetailedStatistics**: 詳細統計表示コンポーネント
3. **KeyboardShortcutHandler**: キーボード操作管理
4. **TutorialOverlay**: チュートリアル表示
5. **TooltipProvider**: ツールチップ管理
6. **AnimationController**: アニメーション制御
7. **ScoreFormatter**: 点数表示フォーマッター
8. **TileSorter**: 牌ソート機能
9. **StatusBadge**: 状態バッジ表示

## コンポーネントとインターフェース

### 1. ExplanationPanel コンポーネント

**責務**: 回答後の詳細な解説を表示

```typescript
interface ExplanationPanelProps {
  hand: Hand;
  correctAnswer: Answer;
  isVisible: boolean;
  onClose: () => void;
}

interface Explanation {
  fuBreakdown: FuBreakdownItem[];
  yaku: YakuItem[];
  totalFu: number;
  totalHan: number;
  finalScore: number;
  calculationSteps: string[];
}

interface FuBreakdownItem {
  source: string;        // 例: "門前ロン", "中ポン"
  fu: number;
  description: string;
}

interface YakuItem {
  name: string;
  han: number;
  description: string;
}
```

### 2. DetailedStatistics コンポーネント

**責務**: 詳細な学習統計を表示

```typescript
interface DetailedStatisticsProps {
  statistics: ExtendedStatistics;
  onReset: () => void;
}

interface ExtendedStatistics {
  // 既存の統計
  totalAnswered: number;
  correctCount: number;
  incorrectCount: number;
  correctRate: number;
  
  // 新規追加
  byDifficulty: {
    easy: DifficultyStats;
    medium: DifficultyStats;
    hard: DifficultyStats;
  };
  recentTen: boolean[];      // 最近10問の正誤
  currentStreak: number;      // 連続正解数
  bestStreak: number;         // 最高連続正解数
  totalStudyTime: number;     // 学習時間（秒）
  sessionStartTime: number;   // セッション開始時刻
}

interface DifficultyStats {
  total: number;
  correct: number;
  rate: number;
}
```

### 3. KeyboardShortcutHandler

**責務**: キーボードショートカットの管理と実行

```typescript
interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: () => void;
  description: string;
  enabled: boolean;
}

interface KeyboardShortcutHandlerProps {
  shortcuts: KeyboardShortcut[];
  isEnabled: boolean;
}
```

### 4. ScoreFormatter

**責務**: 点数を適切な形式で表示

```typescript
interface ScoreFormatOptions {
  isDealer: boolean;
  winType: 'tsumo' | 'ron';
  score: number;
}

interface FormattedScore {
  display: string;           // 表示用文字列
  dealerPayment?: number;    // 親の支払い
  nonDealerPayment?: number; // 子の支払い
  totalScore: number;        // 合計点数
}
```

### 5. TileSorter

**責務**: 牌を標準的な順序でソート

```typescript
interface TileSortOptions {
  tiles: Tile[];
  includeRedDora: boolean;
}

interface SortedTiles {
  man: Tile[];    // 萬子
  pin: Tile[];    // 筒子
  sou: Tile[];    // 索子
  wind: Tile[];   // 風牌
  dragon: Tile[]; // 役牌
}
```

### 6. StatusBadge コンポーネント

**責務**: 手牌の状態（立直、門前など）を視覚的に表示

```typescript
interface StatusBadgeProps {
  status: HandStatus[];
  size?: 'small' | 'medium' | 'large';
}

type HandStatus = 
  | 'riichi'      // 立直
  | 'menzen'      // 門前
  | 'open'        // 鳴きあり
  | 'ippatsu'     // 一発
  | 'doubleRiichi'; // ダブル立直

interface StatusBadgeConfig {
  icon: string;
  label: string;
  color: string;
  bgColor: string;
}
```

### 7. AnimationController

**責務**: アニメーションの制御と設定管理

```typescript
interface AnimationSettings {
  enabled: boolean;
  speed: 'slow' | 'normal' | 'fast' | 'none';
  reducedMotion: boolean;
}

interface AnimationConfig {
  duration: number;
  easing: string;
  delay: number;
}
```

### 8. TutorialOverlay コンポーネント

**責務**: 初回訪問時のチュートリアル表示

```typescript
interface TutorialStep {
  id: string;
  title: string;
  description: string;
  targetElement?: string;  // CSSセレクタ
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: () => void;
}

interface TutorialOverlayProps {
  steps: TutorialStep[];
  currentStep: number;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  onComplete: () => void;
}
```

### 9. TooltipProvider

**責務**: ツールチップの表示管理

```typescript
interface TooltipConfig {
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  delay: number;
  maxWidth: number;
}

interface TooltipProps {
  children: React.ReactNode;
  tooltip: string | TooltipConfig;
  disabled?: boolean;
}
```

## データモデル

### 拡張された設定モデル

```typescript
interface UISettings {
  // アニメーション設定
  animation: AnimationSettings;
  
  // 音声設定
  sound: {
    enabled: boolean;
    volume: number;
    correctSound: boolean;
    incorrectSound: boolean;
  };
  
  // 表示設定
  display: {
    fontSize: 'small' | 'medium' | 'large';
    highContrast: boolean;
    showTooltips: boolean;
  };
  
  // チュートリアル設定
  tutorial: {
    completed: boolean;
    skipped: boolean;
    lastShownVersion: string;
  };
}

interface AppSettings extends GameSettings {
  ui: UISettings;
}
```

### 拡張された問題モデル

```typescript
interface ExtendedProblem extends Problem {
  // 解説情報
  explanation: Explanation;
  
  // 難易度情報
  difficultyReason: string;
  
  // タイムスタンプ
  createdAt: number;
}
```

## 正解性プロパティ

*プロパティとは、システムのすべての有効な実行において真であるべき特性や動作のことです。プロパティは、人間が読める仕様と機械で検証可能な正解性保証の橋渡しとなります。*


### プロパティ反映

事前分析の結果、以下のプロパティを統合・最適化しました：

**統合されたプロパティ**:
- アニメーション効果（1.1, 1.2, 1.5, 3.5）→ プロパティ1に統合
- 点数表示形式（11.1, 11.2, 11.4, 11.5）→ プロパティ2に統合
- 牌ソート順序（12.1-12.5）→ プロパティ3に統合
- 状態バッジ表示（13.1-13.5）→ プロパティ4に統合

**パフォーマンステスト（7.1-7.4）**: ユニットテストではなく、E2Eテストやパフォーマンス計測ツールで検証
**コントラスト比（6.4）**: アクセシビリティ監査ツールで検証

### プロパティ1: アニメーション効果の適用

*任意の*ユーザーアクション（正解選択、不正解選択、回答送信、統計更新）に対して、対応するアニメーションクラスが適切に適用されること

**検証要件**: 要件 1.1, 1.2, 1.5, 3.5

### プロパティ2: 点数フォーマットの正確性

*任意の*手牌状態（親/子、ツモ/ロン）と点数に対して、点数フォーマット関数は正しい形式の文字列を返すこと
- 子のツモ: "1300-2600" 形式
- 親のツモ: "2000オール" 形式
- ロン: "3900" 形式（単一数値）

**検証要件**: 要件 11.1, 11.2, 11.4, 11.5

### プロパティ3: 牌ソート順序の正確性

*任意の*牌の配列に対して、ソート関数は以下の順序で牌を並べること：
1. 萬子（1-9）
2. 筒子（1-9）
3. 索子（1-9）
4. 風牌（東→南→西→北）
5. 役牌（白→發→中）
同種の牌は数字の昇順、赤ドラは通常の5と同じ位置

**検証要件**: 要件 12.1, 12.2, 12.3, 12.4, 12.5

### プロパティ4: 状態バッジの表示

*任意の*手牌状態（立直、門前、鳴きあり等）に対して、対応する状態バッジが適切な色とアイコンで表示されること

**検証要件**: 要件 13.1, 13.2, 13.3, 13.4, 13.5

### プロパティ5: 解説データの完全性

*任意の*問題に対して、解説データは符の内訳、役の一覧、計算過程のすべてを含むこと

**検証要件**: 要件 2.1, 2.2, 2.3

### プロパティ6: 統計データの正確性

*任意の*回答履歴に対して、統計計算関数は正しい正解率、連続正解数、難易度別統計を返すこと

**検証要件**: 要件 3.1, 3.2, 3.3, 3.4

### プロパティ7: キーボードショートカットの動作

*任意の*キーボードイベント（数字キー、Enter、Space、Escape）に対して、対応するアクションが実行されること

**検証要件**: 要件 4.1, 4.2, 4.3, 4.4

### プロパティ8: ARIAラベルの存在

*任意の*インタラクティブUI要素に対して、適切なARIAラベルまたはrole属性が設定されていること

**検証要件**: 要件 6.1

### プロパティ9: 色以外の情報提供

*任意の*色で情報を伝えるUI要素に対して、アイコンまたはテキストによる代替情報が提供されていること

**検証要件**: 要件 6.3

### プロパティ10: アニメーション設定の尊重

*任意の*アニメーション設定（無効、prefers-reduced-motion）に対して、システムは設定に従ってアニメーションを制御すること

**検証要件**: 要件 6.5, 8.4

### プロパティ11: 設定の永続化（ラウンドトリップ）

*任意の*設定変更に対して、設定を保存してから読み込むと元の設定値が復元されること

**検証要件**: 要件 8.5

### プロパティ12: エラーメッセージの完全性

*任意の*エラーに対して、エラーメッセージは具体的な内容と推奨される対処法を含むこと

**検証要件**: 要件 9.1, 9.2

### プロパティ13: エラーの自動記録

*任意の*エラー発生時に、エラーログ記録関数が呼び出されること

**検証要件**: 要件 9.3

### プロパティ14: チュートリアル状態の永続化

*任意の*チュートリアル完了操作に対して、完了状態がlocalStorageに保存され、再読み込み後も保持されること

**検証要件**: 要件 10.5

## エラーハンドリング

### エラーの分類

1. **ユーザー入力エラー**: 不正な選択、無効な操作
2. **システムエラー**: 問題生成失敗、計算エラー
3. **ネットワークエラー**: 外部リソースの読み込み失敗
4. **設定エラー**: 無効な設定値

### エラー処理戦略

```typescript
interface ErrorInfo {
  code: string;
  message: string;
  suggestion: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  timestamp: number;
  context?: Record<string, unknown>;
}

class ErrorHandler {
  // エラーを記録
  logError(error: ErrorInfo): void;
  
  // エラーメッセージを表示
  showError(error: ErrorInfo): void;
  
  // エラーから回復
  recover(error: ErrorInfo): void;
  
  // 再試行
  retry(action: () => void, maxAttempts: number): Promise<void>;
}
```

### エラーメッセージの設計

- **具体性**: 何が起きたかを明確に説明
- **対処法**: ユーザーが取るべき行動を提示
- **トーン**: 親切で前向きな表現
- **自動消去**: 5秒後に自動的に閉じる（重大でないエラー）

## テスト戦略

### ユニットテスト

以下のユーティリティ関数とロジックをテスト：

1. **ScoreFormatter**: 点数フォーマット関数
2. **TileSorter**: 牌ソート関数
3. **StatisticsCalculator**: 統計計算関数
4. **ExplanationGenerator**: 解説生成関数
5. **KeyboardShortcutHandler**: キーボードイベント処理

### プロパティベーステスト

fast-checkライブラリを使用して、以下のプロパティを検証：

1. **プロパティ1-14**: 上記で定義したすべての正解性プロパティ
2. **反復回数**: 各プロパティテストは最低100回実行
3. **タグ付け**: 各テストに対応する要件番号をコメントで明記

### 統合テスト

React Testing Libraryを使用して、以下のコンポーネント統合をテスト：

1. **ExplanationPanel**: 解説表示の統合
2. **DetailedStatistics**: 統計表示の統合
3. **KeyboardShortcutHandler**: キーボード操作の統合
4. **TutorialOverlay**: チュートリアルフローの統合

### E2Eテスト

Playwrightを使用して、以下のユーザーフローをテスト：

1. 初回訪問からチュートリアル完了まで
2. 問題回答から解説表示まで
3. 設定変更から永続化確認まで
4. キーボード操作による完全なクイズフロー

### アクセシビリティテスト

axe-coreを使用して、以下を検証：

1. ARIAラベルの存在と正確性
2. キーボードナビゲーションの完全性
3. フォーカス管理の適切性
4. カラーコントラスト比（WCAG AA基準）

### パフォーマンステスト

Lighthouseを使用して、以下を計測：

1. 初回読み込み時間（目標: 2秒以内）
2. インタラクティブまでの時間（目標: 3秒以内）
3. フレームレート（目標: 60FPS維持）

## 実装の詳細

### 1. 点数フォーマッター

```typescript
/**
 * 点数を適切な形式でフォーマット
 */
export function formatScore(options: ScoreFormatOptions): FormattedScore {
  const { isDealer, winType, score } = options;
  
  if (winType === 'ron') {
    // ロンの場合は単一の数値
    return {
      display: score.toString(),
      totalScore: score,
    };
  }
  
  if (isDealer) {
    // 親のツモ: "2000オール"
    const payment = Math.ceil(score / 3);
    return {
      display: `${payment}オール`,
      dealerPayment: payment,
      totalScore: score,
    };
  }
  
  // 子のツモ: "1300-2600"
  const nonDealerPayment = Math.ceil(score / 4);
  const dealerPayment = nonDealerPayment * 2;
  return {
    display: `${nonDealerPayment}-${dealerPayment}`,
    nonDealerPayment,
    dealerPayment,
    totalScore: score,
  };
}
```

### 2. 牌ソート関数

```typescript
/**
 * 牌を標準的な順序でソート
 */
export function sortTiles(tiles: Tile[]): Tile[] {
  return tiles.sort((a, b) => {
    // タイプの優先順位
    const typeOrder = { man: 0, pin: 1, sou: 2, honor: 3 };
    const typeCompare = typeOrder[a.type] - typeOrder[b.type];
    if (typeCompare !== 0) return typeCompare;
    
    // 数牌の場合は数値で比較
    if (a.type !== 'honor') {
      return (a.value || 0) - (b.value || 0);
    }
    
    // 字牌の場合は特定の順序
    const honorOrder = {
      east: 0, south: 1, west: 2, north: 3,
      white: 4, green: 5, red: 6,
    };
    return honorOrder[a.honor!] - honorOrder[b.honor!];
  });
}
```

### 3. 統計計算関数

```typescript
/**
 * 拡張統計情報を計算
 */
export function calculateExtendedStatistics(
  history: AnswerHistory[]
): ExtendedStatistics {
  const total = history.length;
  const correct = history.filter(h => h.isCorrect).length;
  
  // 難易度別統計
  const byDifficulty = {
    easy: calculateDifficultyStats(history, 'easy'),
    medium: calculateDifficultyStats(history, 'medium'),
    hard: calculateDifficultyStats(history, 'hard'),
  };
  
  // 最近10問
  const recentTen = history.slice(-10).map(h => h.isCorrect);
  
  // 連続正解数
  const currentStreak = calculateCurrentStreak(history);
  const bestStreak = calculateBestStreak(history);
  
  // 学習時間
  const totalStudyTime = calculateStudyTime(history);
  
  return {
    totalAnswered: total,
    correctCount: correct,
    incorrectCount: total - correct,
    correctRate: total > 0 ? (correct / total) * 100 : 0,
    byDifficulty,
    recentTen,
    currentStreak,
    bestStreak,
    totalStudyTime,
    sessionStartTime: Date.now(),
  };
}
```

### 4. 解説生成関数

```typescript
/**
 * 問題の解説を生成
 */
export function generateExplanation(
  hand: Hand,
  answer: Answer
): Explanation {
  // 符の内訳を計算
  const fuBreakdown = calculateFuBreakdown(hand);
  
  // 役を判定
  const yaku = identifyYaku(hand);
  
  // 計算過程を生成
  const calculationSteps = [
    `基本符: ${fuBreakdown.find(f => f.source === '基本符')?.fu}符`,
    ...fuBreakdown.filter(f => f.source !== '基本符').map(f => 
      `${f.source}: ${f.fu}符`
    ),
    `合計: ${answer.fu}符`,
    ``,
    ...yaku.map(y => `${y.name}: ${y.han}飜`),
    `合計: ${answer.han}飜`,
    ``,
    `${answer.fu}符${answer.han}飜 = ${answer.score}点`,
  ];
  
  return {
    fuBreakdown,
    yaku,
    totalFu: answer.fu,
    totalHan: answer.han,
    finalScore: answer.score,
    calculationSteps,
  };
}
```

### 5. キーボードショートカット管理

```typescript
/**
 * キーボードショートカットを管理
 */
export function useKeyboardShortcuts(
  shortcuts: KeyboardShortcut[],
  isEnabled: boolean
) {
  useEffect(() => {
    if (!isEnabled) return;
    
    const handleKeyDown = (event: KeyboardEvent) => {
      const matchingShortcut = shortcuts.find(shortcut => {
        return (
          shortcut.enabled &&
          shortcut.key === event.key &&
          (shortcut.ctrlKey === undefined || shortcut.ctrlKey === event.ctrlKey) &&
          (shortcut.shiftKey === undefined || shortcut.shiftKey === event.shiftKey) &&
          (shortcut.altKey === undefined || shortcut.altKey === event.altKey)
        );
      });
      
      if (matchingShortcut) {
        event.preventDefault();
        matchingShortcut.action();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, isEnabled]);
}
```

### 6. アニメーション制御

```typescript
/**
 * アニメーション設定を管理
 */
export function useAnimationSettings() {
  const [settings, setSettings] = useState<AnimationSettings>({
    enabled: true,
    speed: 'normal',
    reducedMotion: false,
  });
  
  // prefers-reduced-motionを検出
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setSettings(prev => ({
      ...prev,
      reducedMotion: mediaQuery.matches,
    }));
    
    const handleChange = (e: MediaQueryListEvent) => {
      setSettings(prev => ({
        ...prev,
        reducedMotion: e.matches,
      }));
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  // アニメーション設定を取得
  const getAnimationConfig = (baseConfig: AnimationConfig): AnimationConfig => {
    if (!settings.enabled || settings.reducedMotion) {
      return { ...baseConfig, duration: 0 };
    }
    
    const speedMultiplier = {
      slow: 1.5,
      normal: 1,
      fast: 0.5,
      none: 0,
    }[settings.speed];
    
    return {
      ...baseConfig,
      duration: baseConfig.duration * speedMultiplier,
    };
  };
  
  return { settings, setSettings, getAnimationConfig };
}
```

### 7. ツールチップ実装

```typescript
/**
 * ツールチップコンポーネント
 */
export const Tooltip: React.FC<TooltipProps> = ({
  children,
  tooltip,
  disabled = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const targetRef = useRef<HTMLDivElement>(null);
  
  const config: TooltipConfig = typeof tooltip === 'string'
    ? { content: tooltip, position: 'top', delay: 300, maxWidth: 200 }
    : tooltip;
  
  const handleMouseEnter = () => {
    if (disabled) return;
    setTimeout(() => setIsVisible(true), config.delay);
  };
  
  const handleMouseLeave = () => {
    setIsVisible(false);
  };
  
  useEffect(() => {
    if (isVisible && targetRef.current) {
      const rect = targetRef.current.getBoundingClientRect();
      const tooltipPosition = calculateTooltipPosition(rect, config.position);
      setPosition(tooltipPosition);
    }
  }, [isVisible, config.position]);
  
  return (
    <div
      ref={targetRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative inline-block"
    >
      {children}
      {isVisible && (
        <div
          className="absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg"
          style={{
            left: position.x,
            top: position.y,
            maxWidth: config.maxWidth,
          }}
        >
          {config.content}
        </div>
      )}
    </div>
  );
};
```

## パフォーマンス最適化

### 1. コンポーネントのメモ化

```typescript
// 重いコンポーネントをメモ化
export const HandDisplay = React.memo(HandDisplayComponent);
export const AnswerSelector = React.memo(AnswerSelectorComponent);
export const ExplanationPanel = React.memo(ExplanationPanelComponent);
```

### 2. 遅延読み込み

```typescript
// 大きなコンポーネントを遅延読み込み
const DetailedStatistics = lazy(() => import('./DetailedStatistics'));
const TutorialOverlay = lazy(() => import('./TutorialOverlay'));
const ExplanationPanel = lazy(() => import('./ExplanationPanel'));
```

### 3. 仮想化

```typescript
// 長いリストを仮想化（必要に応じて）
import { FixedSizeList } from 'react-window';
```

### 4. デバウンス・スロットル

```typescript
// 頻繁なイベントをデバウンス
const debouncedSave = useMemo(
  () => debounce(saveSettings, 500),
  []
);
```

## アクセシビリティ実装

### 1. ARIAラベル

すべてのインタラクティブ要素に適切なARIAラベルを追加：

```typescript
<button
  aria-label="30符を選択"
  aria-pressed={selectedFu === 30}
  onClick={() => selectFu(30)}
>
  30符
</button>
```

### 2. キーボードナビゲーション

```typescript
// フォーカス管理
const focusableElements = [
  'button',
  'a[href]',
  'input',
  'select',
  'textarea',
  '[tabindex]:not([tabindex="-1"])',
];

// フォーカストラップ（モーダル内）
useFocusTrap(modalRef, isOpen);
```

### 3. スクリーンリーダー対応

```typescript
// ライブリージョンで動的な変更を通知
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
>
  {statusMessage}
</div>
```

## まとめ

この設計では、13の主要な改善領域をカバーし、14の正解性プロパティを定義しました。実装は既存のアーキテクチャを維持しつつ、新しいコンポーネントとユーティリティを追加する形で進めます。

重点項目：
- **視覚的フィードバック**: アニメーションと色による明確な情報伝達
- **学習支援**: 詳細な解説と統計による学習効果の向上
- **アクセシビリティ**: すべてのユーザーが利用できる設計
- **パフォーマンス**: 高速で快適な操作感
- **テスト**: プロパティベーステストによる高い品質保証
