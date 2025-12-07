# レスポンシブデザイン実装ガイド

## 概要

このドキュメントは、麻雀点数計算クイズアプリケーションのレスポンシブデザイン実装について説明します。

## 実装された機能

### 要件 5.1: モバイル端末用の牌サイズ調整

**実装内容:**
- 画面幅640px以下で牌のサイズを自動調整
- 最小幅: 2rem（モバイル）
- 高さ: 3rem（モバイル）
- フォントサイズ: 0.875rem（モバイル）

**適用クラス:**
```css
.tile-component {
  min-width: 2rem !important;
  height: 3rem !important;
  font-size: 0.875rem !important;
}
```

### 要件 5.2: タッチターゲットの最適化

**実装内容:**
- すべてのボタンに最小サイズ44px×44pxを適用
- タッチ操作に適したサイズで配置
- 回答選択ボタンのパディング調整

**適用クラス:**
```css
button {
  min-height: 44px;
  min-width: 44px;
}

.answer-selector-buttons button {
  min-width: 4rem !important;
  padding: 0.75rem 0.5rem !important;
}
```

### 要件 5.3: 統計情報の縦方向配置

**実装内容:**
- モバイルでは2列グリッド（2×2）
- タブレットでは4列グリッド（1×4）
- デスクトップでは4列グリッド（1×4）

**適用クラス:**
```css
.statistics-grid {
  grid-template-columns: repeat(2, 1fr) !important; /* モバイル */
  gap: 0.75rem !important;
}
```

### 要件 5.4: 横向き表示の最適化

**実装内容:**
- 横向きモバイル（896px以下）で高さを最適化
- パディングとスペーシングを削減
- 牌サイズをさらに縮小（1.75rem × 2.5rem）
- 統計情報を横並びに配置

**適用クラス:**
```css
@media (max-width: 896px) and (orientation: landscape) {
  .tile-component {
    min-width: 1.75rem !important;
    height: 2.5rem !important;
  }
  
  .statistics-grid {
    grid-template-columns: repeat(4, 1fr) !important;
  }
}
```

### 要件 5.5: タブレット用中間レイアウト

**実装内容:**
- 641px〜1024pxの範囲で中間サイズを適用
- 牌サイズ: 2.25rem × 3.5rem
- ボタンサイズとフォントサイズを調整

**適用クラス:**
```css
@media (min-width: 641px) and (max-width: 1024px) {
  .tile-component {
    min-width: 2.25rem !important;
    height: 3.5rem !important;
  }
}
```

## ブレークポイント一覧

| デバイス | 画面幅 | 主な調整内容 |
|---------|--------|------------|
| 超小型モバイル | 〜320px | 最小サイズ対応 |
| モバイル | 〜640px | 牌サイズ縮小、2列グリッド |
| タブレット | 641px〜1024px | 中間サイズ、4列グリッド |
| デスクトップ | 1025px〜 | 標準サイズ |
| 大型デスクトップ | 1920px〜 | 拡大表示 |

## 横向き対応

### モバイル横向き（〜896px）
- 高さを最適化してスクロールを最小化
- 統計情報を横並びに配置
- パディングとスペーシングを削減

### タブレット横向き（641px〜1024px）
- 2列グリッドレイアウト
- 手牌と統計を横並びに配置

## 使用方法

### コンポーネントへの適用

各コンポーネントに適切なクラスを追加することで、レスポンシブデザインが自動的に適用されます：

```tsx
// 牌コンポーネント
<div className="tile-component ...">

// 統計グリッド
<div className="statistics-grid grid grid-cols-2 md:grid-cols-4 gap-4">

// 回答選択ボタン
<div className="answer-selector-buttons flex flex-wrap gap-2">

// モーダル
<div className="modal-container bg-white rounded-xl ...">

// ヘッダー
<div className="header-container flex items-center ...">
```

## テスト方法

### ブラウザの開発者ツールを使用

1. ブラウザの開発者ツールを開く（F12）
2. デバイスツールバーを有効化（Ctrl+Shift+M）
3. 以下のデバイスでテスト：
   - iPhone SE（375×667）
   - iPhone 12 Pro（390×844）
   - iPad（768×1024）
   - iPad Pro（1024×1366）
   - Galaxy S20（360×800）

### 横向きテスト

1. デバイスツールバーで回転アイコンをクリック
2. 横向き表示を確認
3. レイアウトが適切に調整されることを確認

## パフォーマンス最適化

### CSS最適化
- メディアクエリを効率的に使用
- 不要な再レンダリングを防止
- トランジションとアニメーションを最適化

### レスポンシブ画像
- 画像は現在使用していませんが、将来的に追加する場合は以下を考慮：
  - srcsetを使用した複数解像度対応
  - lazy loadingの実装
  - WebP形式の使用

## アクセシビリティ

レスポンシブデザインと併せて、以下のアクセシビリティ機能も実装されています：

- タッチターゲットの最小サイズ（44px×44px）
- 十分なコントラスト比
- キーボードナビゲーション対応
- スクリーンリーダー対応
- フォーカス表示の強化

## 今後の改善案

1. **プログレッシブウェブアプリ（PWA）対応**
   - オフライン機能
   - ホーム画面への追加
   - プッシュ通知

2. **さらなる最適化**
   - 折りたたみ可能なセクション
   - スワイプジェスチャー対応
   - ダークモード対応

3. **パフォーマンス向上**
   - コード分割
   - 遅延読み込み
   - キャッシュ戦略

## 参考資料

- [MDN - レスポンシブデザイン](https://developer.mozilla.org/ja/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [Web.dev - レスポンシブウェブデザインの基本](https://web.dev/responsive-web-design-basics/)
- [WCAG 2.1 - タッチターゲットのサイズ](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html)
