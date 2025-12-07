# HelpModal コンポーネント

## 概要

`HelpModal`は、アプリケーションの各機能の説明を表示するモーダルコンポーネントです。要件10.2「WHEN ユーザーがヘルプを要求する THEN システムは各機能の説明を表示すること」を満たします。

## 機能

- 6つのヘルプセクション（概要、点数計算、キーボード操作、統計情報、設定、その他の機能）
- サイドバーでセクションを切り替え可能
- Escapeキーでモーダルを閉じる
- 背景クリックでモーダルを閉じる
- スクロール可能なコンテンツエリア
- アクセシビリティ対応（ARIA属性、キーボードナビゲーション）

## 使用方法

### 基本的な使い方

```tsx
import { useState } from 'react';
import { HelpModal } from './components/HelpModal';

function App() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsHelpOpen(true)}>
        ヘルプ
      </button>
      
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </>
  );
}
```

### ヘッダーにヘルプボタンを配置

```tsx
function Header() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <header className="flex items-center justify-between p-4">
      <h1>麻雀点数計算クイズ</h1>
      
      <button
        onClick={() => setIsHelpOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        aria-label="ヘルプを開く"
      >
        <span aria-hidden="true">❓</span>
        <span>ヘルプ</span>
      </button>

      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </header>
  );
}
```

## Props

### HelpModalProps

| プロパティ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `isOpen` | `boolean` | ✓ | モーダルの表示状態 |
| `onClose` | `() => void` | ✓ | モーダルを閉じる時のコールバック |

## ヘルプセクション

### 1. 概要
アプリケーションの基本的な使い方を説明します。
- アプリケーションの目的
- 基本的な操作フロー
- 学習の進め方

### 2. 点数計算
麻雀の点数計算方法を説明します。
- 符の計算方法
- 飜数の計算方法
- 点数の計算方法
- 具体的な例

### 3. キーボード操作
利用可能なキーボードショートカットを説明します。
- 数字キー（1-9）：選択肢の選択
- Enter：回答の送信
- Space：次の問題へ進む
- Escape：モーダルを閉じる
- Tab：フォーカス移動

### 4. 統計情報
学習統計の見方を説明します。
- 基本統計（総回答数、正解率）
- 詳細統計（難易度別正解率、最近10問、連続正解数、学習時間）

### 5. 設定
各種設定項目について説明します。
- ルール設定（赤ドラ、喰いタン、後付け）
- アニメーション設定
- 音声設定
- 表示設定

### 6. その他の機能
追加機能について説明します。
- 解説機能
- ツールチップ
- チュートリアル
- レスポンシブデザイン
- アクセシビリティ

## スタイリング

### レイアウト
- モーダルは画面中央に表示
- 最大幅: 4xl (56rem)
- 最大高さ: 画面の90%
- サイドバー幅: 16rem (256px)

### カラー
- 背景オーバーレイ: 黒 50%透明度
- モーダル背景: 白
- アクティブセクション: 青 (blue-600)
- ホバー: グレー (gray-200)

### レスポンシブ
- モバイル: サイドバーを上部に配置（将来の改善）
- タブレット以上: サイドバーを左側に配置

## アクセシビリティ

### ARIA属性
- `role="dialog"`: モーダルダイアログとして識別
- `aria-modal="true"`: モーダルであることを示す
- `aria-labelledby`: タイトルとの関連付け
- `aria-current`: アクティブなセクションを示す

### キーボード操作
- Escape: モーダルを閉じる
- Tab: フォーカス移動
- Enter/Space: ボタンの実行

### スクリーンリーダー
- すべてのボタンに適切なラベル
- セクションナビゲーションに`aria-label`
- アイコンに`aria-hidden="true"`

## 実装の詳細

### 状態管理
```tsx
const [activeSection, setActiveSection] = useState<string>('overview');
```

デフォルトで「概要」セクションが表示されます。

### Escapeキー処理
```tsx
React.useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) {
      onClose();
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [isOpen, onClose]);
```

### セクション定義
各セクションは以下の構造を持ちます：
```tsx
interface HelpSection {
  id: string;           // セクションの一意なID
  title: string;        // セクションのタイトル
  icon: string;         // セクションのアイコン（絵文字）
  content: React.ReactNode;  // セクションのコンテンツ
}
```

## テスト

### ユニットテスト
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { HelpModal } from './HelpModal';

it('モーダルが開いている時はヘルプコンテンツを表示する', () => {
  const onClose = vi.fn();
  render(<HelpModal isOpen={true} onClose={onClose} />);
  
  expect(screen.getByText('ヘルプ')).toBeInTheDocument();
});

it('閉じるボタンをクリックするとonCloseが呼ばれる', () => {
  const onClose = vi.fn();
  render(<HelpModal isOpen={true} onClose={onClose} />);
  
  const closeButton = screen.getByLabelText('ヘルプを閉じる');
  fireEvent.click(closeButton);
  
  expect(onClose).toHaveBeenCalledTimes(1);
});
```

## パフォーマンス

### 最適化
- モーダルが閉じている時は何もレンダリングしない
- セクションコンテンツは事前に定義（動的生成なし）
- イベントリスナーは適切にクリーンアップ

### メモリ管理
- useEffectのクリーンアップ関数でイベントリスナーを削除
- 不要な再レンダリングを防ぐ

## 今後の改善案

1. **検索機能**: ヘルプコンテンツ内を検索できる機能
2. **お気に入り**: よく見るセクションをブックマーク
3. **履歴**: 最近見たセクションの履歴
4. **印刷**: ヘルプコンテンツを印刷できる機能
5. **モバイル最適化**: サイドバーをドロワーに変更
6. **多言語対応**: 英語などの他言語サポート
7. **動画チュートリアル**: 動画での説明を追加
8. **インタラクティブデモ**: 実際に操作できるデモ

## 関連コンポーネント

- `TutorialOverlay`: 初回訪問時のチュートリアル
- `Tooltip`: UI要素の補足情報
- `ExplanationPanel`: 問題の解説表示

## 要件との対応

このコンポーネントは以下の要件を満たします：

- **要件 10.2**: WHEN ユーザーがヘルプを要求する THEN システムは各機能の説明を表示すること

## 使用例

実際の使用例は`HelpModalExample.tsx`を参照してください。
