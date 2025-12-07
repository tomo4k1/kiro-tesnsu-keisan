# Tooltip コンポーネント

## 概要

ツールチップコンポーネントは、ホバーまたはフォーカス時に補足情報を表示するUIコンポーネントです。位置調整とディレイ機能を持ち、アクセシビリティに配慮した実装になっています。

## 機能

- **ホバー表示**: マウスホバー時にツールチップを表示
- **フォーカス表示**: キーボードフォーカス時にもツールチップを表示（アクセシビリティ対応）
- **位置調整**: 上下左右の4方向に配置可能
- **ディレイ機能**: 表示までの遅延時間を設定可能
- **幅の制御**: 最大幅を指定可能
- **無効化**: disabled プロパティで機能を無効化可能

## 使用方法

### 基本的な使用例

```tsx
import { Tooltip } from './components';

<Tooltip tooltip="これは説明文です">
  <button>ホバーしてください</button>
</Tooltip>
```

### カスタム設定

```tsx
<Tooltip
  tooltip={{
    content: "詳細な説明",
    position: "bottom",
    delay: 500,
    maxWidth: 300
  }}
>
  <span>情報</span>
</Tooltip>
```

### 無効化

```tsx
<Tooltip tooltip="表示されません" disabled>
  <button disabled>無効なボタン</button>
</Tooltip>
```

## プロパティ

### TooltipProps

| プロパティ | 型 | 必須 | デフォルト | 説明 |
|-----------|-----|------|-----------|------|
| children | React.ReactNode | ✓ | - | ツールチップを表示する対象要素 |
| tooltip | string \| TooltipConfig | ✓ | - | ツールチップの内容または設定 |
| disabled | boolean | - | false | ツールチップを無効化 |

### TooltipConfig

| プロパティ | 型 | 説明 |
|-----------|-----|------|
| content | string | ツールチップに表示するテキスト |
| position | 'top' \| 'bottom' \| 'left' \| 'right' | ツールチップの表示位置 |
| delay | number | 表示までの遅延時間（ミリ秒） |
| maxWidth | number | ツールチップの最大幅（ピクセル） |

## デフォルト設定

文字列を渡した場合、以下のデフォルト設定が適用されます：

```typescript
{
  content: tooltip, // 渡された文字列
  position: 'top',
  delay: 300,
  maxWidth: 200
}
```

## アクセシビリティ

- `role="tooltip"` 属性を使用してスクリーンリーダーに対応
- キーボードフォーカス時にもツールチップを表示
- `pointer-events-none` でツールチップ自体はクリック不可

## スタイリング

Tailwind CSS を使用してスタイリングされています：

- 背景色: `bg-gray-900`
- テキスト色: `text-white`
- パディング: `px-3 py-2`
- フォントサイズ: `text-sm`
- 角丸: `rounded-lg`
- 影: `shadow-lg`
- z-index: `z-50`

## 実装の詳細

### 位置計算

`calculateTooltipPosition` 関数が、ターゲット要素の位置とサイズに基づいてツールチップの位置を計算します。

### タイムアウト管理

- `timeoutRef` を使用してディレイタイマーを管理
- ホバー解除時にタイマーをクリアして、不要な表示を防止
- コンポーネントのアンマウント時にもクリーンアップを実行

### イベントハンドリング

- `onMouseEnter` / `onMouseLeave`: マウスホバー対応
- `onFocus` / `onBlur`: キーボードフォーカス対応

## 使用例

詳細な使用例は `TooltipExample.tsx` を参照してください。

## テスト

`Tooltip.test.tsx` に以下のテストケースが含まれています：

- 子要素の正しいレンダリング
- 初期状態での非表示
- ホバー時の表示
- ホバー解除時の非表示
- カスタム設定の適用
- disabled 時の動作
- フォーカス時の表示
- ブラー時の非表示
- ディレイ中のキャンセル

## 要件との対応

このコンポーネントは以下の要件を満たします：

- **要件 10.3**: WHEN ユーザーがツールチップを表示する THEN システムは各UI要素の説明を提供すること

## 今後の拡張案

- ダークモード対応
- カスタムスタイルのサポート
- アニメーション効果の追加
- 矢印（ポインター）の表示
- 画面端での自動位置調整
