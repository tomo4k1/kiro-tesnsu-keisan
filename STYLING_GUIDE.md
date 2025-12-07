# スタイリングガイド

## 概要

このドキュメントは、麻雀点数計算クイズアプリケーションのスタイリング実装について説明します。Tailwind CSSを使用して、シンプルでわかりやすく、レスポンシブなUIを実現しています。

## 技術スタック

- **Tailwind CSS**: ユーティリティファーストのCSSフレームワーク
- **カスタムアニメーション**: スムーズなユーザー体験のための独自アニメーション
- **レスポンシブデザイン**: モバイルファーストのアプローチ

## デザイン原則

### 1. シンプルでわかりやすいUI（要件 2.1, 2.2）

- **明確な視覚階層**: 重要な情報を目立たせる
- **一貫性のあるスペーシング**: 統一されたマージンとパディング
- **読みやすいタイポグラフィ**: 適切なフォントサイズとウェイト

### 2. 直感的な正解・不正解表示（要件 2.4）

#### カラースキーム

- **正解**: 緑色（`bg-green-500`, `text-green-600`）
  - チェックマーク（✓）アイコン
  - リング効果で強調

- **不正解**: 赤色（`bg-red-500`, `text-red-600`）
  - バツマーク（✗）アイコン
  - リング効果で強調

- **選択中**: 青色（`bg-blue-500`, `text-blue-600`）
  - スケール効果（`scale-105`）
  - シャドウ効果

- **未選択**: グレー（`bg-white`, `border-gray-300`）
  - ホバー時に青色のハイライト

### 3. レスポンシブデザイン（要件 2.5）

#### ブレークポイント

- **モバイル**: `< 640px` (sm)
- **タブレット**: `640px - 768px` (md)
- **デスクトップ**: `> 768px` (lg)

#### モバイル最適化

- タッチターゲットの最小サイズ: 44px
- フレキシブルなグリッドレイアウト
- 折り返し可能なボタン配置
- スクロール可能なコンテンツ

## コンポーネント別スタイリング

### HandDisplay（手牌表示）

**特徴:**
- 麻雀卓を模した緑色の背景（`bg-gradient-to-b from-green-50 to-green-100`）
- 牌は白い背景に黒い枠線（`bg-white border-gray-400`）
- 赤ドラは赤色の背景（`bg-red-50 border-red-400`）
- 和了牌は黄色のリング効果（`ring-4 ring-yellow-400`）

**レスポンシブ:**
```css
/* モバイル: 牌のサイズを調整 */
min-w-[2.5rem] h-14

/* タブレット以上: より大きな表示 */
flex-wrap gap-2
```

### AnswerSelector（回答選択）

**特徴:**
- ボタンは最小幅5rem（`min-w-[5rem]`）
- ホバー時のスケール効果（`hover:scale-105`）
- アクティブ時の縮小効果（`active:scale-95`）
- トランジション効果（`transition-all duration-200`）

**状態別スタイル:**

1. **未選択**:
   ```css
   bg-white text-gray-700 border-gray-300
   hover:bg-blue-50 hover:border-blue-300
   ```

2. **選択中**:
   ```css
   bg-blue-500 text-white border-blue-600
   shadow-md scale-105
   ```

3. **正解**:
   ```css
   bg-green-500 text-white border-green-600
   shadow-md ring-4 ring-green-300
   ```

4. **不正解**:
   ```css
   bg-red-500 text-white border-red-600
   shadow-md ring-4 ring-red-300
   ```

### StatisticsDisplay（統計表示）

**特徴:**
- グリッドレイアウト（`grid grid-cols-2 md:grid-cols-4`）
- カラーコード化された統計カード
  - 回答数: 青色（`bg-blue-50`）
  - 正解数: 緑色（`bg-green-50`）
  - 不正解数: 赤色（`bg-red-50`）
  - 正解率: 紫色（`bg-purple-50`）
- プログレスバーのアニメーション（`transition-all duration-500`）

**レスポンシブ:**
```css
/* モバイル: 2列 */
grid-cols-2

/* タブレット以上: 4列 */
md:grid-cols-4
```

### SettingsPanel（設定パネル）

**特徴:**
- トグルスイッチのアニメーション
- オン状態: 青色（`bg-blue-600`）
- オフ状態: グレー（`bg-gray-300`）
- スイッチの移動アニメーション（`transition-transform duration-200`）

### ResultModal（結果モーダル）

**特徴:**
- 背景オーバーレイ（`bg-black bg-opacity-50`）
- スライドアップアニメーション（`animate-slideUp`）
- フェードインアニメーション（`animate-fadeIn`）
- 大きな絵文字アイコン（正解: 🎉、不正解: 😔）

### QuizScreen（メイン画面）

**特徴:**
- グラデーション背景（`bg-gradient-to-br from-blue-50 to-indigo-100`）
- 最大幅制限（`max-w-6xl mx-auto`）
- 統一されたスペーシング（`space-y-6`）

## カスタムアニメーション

### fadeIn
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```
**使用箇所**: モーダル表示

### slideUp
```css
@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
```
**使用箇所**: モーダルコンテンツ

### slideDown
```css
@keyframes slideDown {
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
```
**使用箇所**: 設定パネルの展開

## アクセシビリティ

### フォーカス表示
```css
*:focus-visible {
  outline: none;
  ring: 2px;
  ring-color: blue-500;
  ring-offset: 2px;
}
```

### タッチターゲット
- すべてのボタンは最小44pxの高さ
- タップハイライトの無効化（`-webkit-tap-highlight-color: transparent`）

### カラーコントラスト
- WCAG AA基準を満たすコントラスト比
- テキストと背景の明確な区別

## パフォーマンス最適化

### CSS最適化
- Tailwind CSSのPurge機能で未使用スタイルを削除
- 最小限のカスタムCSS
- ハードウェアアクセラレーション対応のアニメーション

### レンダリング最適化
- `will-change`プロパティの適切な使用
- トランジションの最適化（`transition-all duration-200`）

## カスタマイズ

### カラーパレットの変更

`tailwind.config.js`で定義されたカスタムカラー:

```javascript
colors: {
  mahjong: {
    green: {
      50: '#f0fdf4',
      // ... 他の色
    },
  },
}
```

### スペーシングの調整

カスタムスペーシング:
```javascript
spacing: {
  '18': '4.5rem',
  '88': '22rem',
  '128': '32rem',
}
```

## ブラウザサポート

- Chrome/Edge: 最新版
- Firefox: 最新版
- Safari: 最新版
- モバイルブラウザ: iOS Safari, Chrome Mobile

## 今後の改善案

1. **ダークモード対応**: `dark:`プレフィックスを使用
2. **アニメーション設定**: ユーザーがアニメーションを無効化できる機能
3. **カスタムテーマ**: ユーザーが色を選択できる機能
4. **より詳細なレスポンシブ調整**: 大画面ディスプレイ対応

## まとめ

このスタイリング実装は、以下の要件を満たしています:

- ✅ **要件 2.1**: 手牌を視覚的にわかりやすく表示
- ✅ **要件 2.2**: 選択肢を明確に表示
- ✅ **要件 2.4**: 色や記号で直感的な正解・不正解表示
- ✅ **要件 2.5**: モバイル端末対応のレスポンシブデザイン

Tailwind CSSのユーティリティクラスを活用することで、保守性が高く、一貫性のあるデザインを実現しています。
