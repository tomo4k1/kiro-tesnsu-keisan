# UI設定の使用方法

## 概要

UI設定機能は、アプリケーションのユーザーインターフェース設定を管理し、ローカルストレージに永続化します。アニメーション、音声、表示の3つのカテゴリの設定を提供します。

## 主要コンポーネント

### 1. UISettingsManager

ローカルストレージへの保存・読み込みを担当するサービスクラスです。

```typescript
import { UISettingsManager } from '../services/UISettingsManager';

// デフォルト設定を取得
const defaultSettings = UISettingsManager.getDefaultSettings();

// 設定を保存
UISettingsManager.saveSettings(settings);

// 設定を読み込み
const settings = UISettingsManager.loadSettings();

// 設定をクリア
UISettingsManager.clearSettings();
```

### 2. useUISettings フック

Reactコンポーネントで設定を管理するためのカスタムフックです。

```typescript
import { useUISettings } from '../hooks/useUISettings';

function MyComponent() {
  const {
    settings,
    updateSettings,
    updateAnimationSettings,
    updateSoundSettings,
    updateDisplaySettings,
    resetSettings,
    isAnimationEnabled,
    getAnimationSpeedMultiplier,
  } = useUISettings();

  // 設定を使用
  const animationEnabled = isAnimationEnabled();
  const speedMultiplier = getAnimationSpeedMultiplier();

  return (
    // コンポーネントのJSX
  );
}
```

## 設定の種類

### アニメーション設定 (AnimationSettings)

```typescript
interface AnimationSettings {
  enabled: boolean;              // アニメーションの有効/無効
  speed: 'slow' | 'normal' | 'fast' | 'none';  // アニメーション速度
  reducedMotion: boolean;        // prefers-reduced-motionの検出結果
}
```

- `enabled`: ユーザーがアニメーションを有効にするかどうか
- `speed`: アニメーションの速度（slow: 1.5倍、normal: 1倍、fast: 0.5倍、none: 0倍）
- `reducedMotion`: OSのアクセシビリティ設定を自動検出（自動設定）

### 音声設定 (SoundSettings)

```typescript
interface SoundSettings {
  enabled: boolean;              // 音声の有効/無効
  volume: number;                // 音量（0.0〜1.0）
  correctSound: boolean;         // 正解時の音声
  incorrectSound: boolean;       // 不正解時の音声
}
```

### 表示設定 (DisplaySettings)

```typescript
interface DisplaySettings {
  fontSize: 'small' | 'medium' | 'large';  // フォントサイズ
  highContrast: boolean;                   // ハイコントラストモード
  showTooltips: boolean;                   // ツールチップの表示
}
```

## 使用例

### 基本的な使用方法

```typescript
import { useUISettings } from '../hooks/useUISettings';

function SettingsPanel() {
  const { settings, updateAnimationSettings } = useUISettings();

  const handleSpeedChange = (speed: 'slow' | 'normal' | 'fast' | 'none') => {
    updateAnimationSettings({
      ...settings.animation,
      speed,
    });
  };

  return (
    <select value={settings.animation.speed} onChange={(e) => handleSpeedChange(e.target.value)}>
      <option value="slow">遅い</option>
      <option value="normal">標準</option>
      <option value="fast">速い</option>
      <option value="none">なし</option>
    </select>
  );
}
```

### アニメーションの制御

```typescript
function AnimatedComponent() {
  const { isAnimationEnabled, getAnimationSpeedMultiplier } = useUISettings();

  const baseDuration = 300; // ミリ秒
  const duration = baseDuration * getAnimationSpeedMultiplier();

  return (
    <div
      style={{
        transition: isAnimationEnabled() ? `all ${duration}ms ease-in-out` : 'none',
      }}
    >
      アニメーション付き要素
    </div>
  );
}
```

### 音声の再生

```typescript
function SoundPlayer() {
  const { settings } = useUISettings();

  const playCorrectSound = () => {
    if (settings.sound.enabled && settings.sound.correctSound) {
      const audio = new Audio('/sounds/correct.mp3');
      audio.volume = settings.sound.volume;
      audio.play();
    }
  };

  return <button onClick={playCorrectSound}>正解音を再生</button>;
}
```

### フォントサイズの適用

```typescript
function TextComponent() {
  const { settings } = useUISettings();

  const fontSizeClass = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  }[settings.display.fontSize];

  return <p className={fontSizeClass}>テキスト</p>;
}
```

## 自動機能

### prefers-reduced-motion の検出

`useUISettings`フックは、OSのアクセシビリティ設定（prefers-reduced-motion）を自動的に検出し、`reducedMotion`フラグを更新します。この設定が有効な場合、`isAnimationEnabled()`は自動的に`false`を返します。

```typescript
// ユーザーがOSでアニメーション削減を有効にしている場合
// isAnimationEnabled() は自動的に false を返す
const { isAnimationEnabled } = useUISettings();
console.log(isAnimationEnabled()); // false（reducedMotionが有効な場合）
```

## ローカルストレージ

設定は以下のキーでローカルストレージに保存されます：

- キー: `mahjong-quiz-ui-settings`
- 形式: JSON

設定は変更時に自動的に保存され、アプリケーション起動時に自動的に読み込まれます。

## エラーハンドリング

- 無効な設定データが保存されている場合、デフォルト設定が使用されます
- JSONパースエラーが発生した場合、デフォルト設定が使用されます
- 保存エラーが発生した場合、エラーがログに記録されますが、アプリケーションは継続します

## テスト

UISettingsManagerの完全なテストスイートが`src/services/UISettingsManager.test.ts`に含まれています。

```bash
npm test -- UISettingsManager.test.ts
```

## 要件との対応

この実装は以下の要件を満たしています：

- **要件 8.1**: アニメーション速度の設定を提供
- **要件 8.2**: 音声フィードバックのオン・オフを提供
- **要件 8.3**: フォントサイズの調整を提供
- **要件 8.4**: 設定変更の即座反映（Reactの状態管理により実現）
- **要件 8.5**: 設定のローカルストレージへの保存
