# 設計書

## 概要

本設計は、麻雀点数計算学習アプリケーションにおけるドラ表示牌の枚数を最大5枚に制限する機能を実装するものです。実際の麻雀では、ドラ表示牌は最大5枚（本場表示を除く）であるため、この制限を適用することで、より実戦に即した学習環境を提供します。

## アーキテクチャ

### 影響を受けるコンポーネント

1. **ProblemGenerator** (`src/services/ProblemGenerator.ts`)
   - `adjustDoraForDifficulty`メソッドを修正
   - ドラ生成時に最大5枚の制限を適用

2. **型定義** (`src/types/index.ts`)
   - 必要に応じて定数を追加

### 変更の影響範囲

- **最小限の変更**: `adjustDoraForDifficulty`メソッドのみを修正
- **既存機能への影響**: なし（ドラ枚数の制限のみ）
- **後方互換性**: 完全に保持

## コンポーネントとインターフェース

### 修正対象メソッド

```typescript
private adjustDoraForDifficulty(
  hand: Hand,
  targetRange: [number, number],
  winCondition: WinCondition
): Tile[]
```

**現在の実装の問題点:**
- ドラ枚数に上限がない
- `Math.min(diff, allTiles.length)`で制限しているが、`diff`が大きい場合に多数のドラが生成される可能性がある

**修正内容:**
- ドラ枚数の上限を5枚に設定
- `Math.min(diff, allTiles.length, MAX_DORA_TILES)`のように3つの値の最小値を取る

## データモデル

### 定数の追加

```typescript
/**
 * ドラ表示牌の最大枚数
 * 実際の麻雀では、ドラ表示牌は最大5枚（本場表示を除く）
 */
const MAX_DORA_TILES = 5;
```

### 既存のデータモデル

変更なし。`Hand`インターフェースの`dora: Tile[]`はそのまま使用します。

## 正確性プロパティ

*プロパティとは、システムのすべての有効な実行において真であるべき特性や動作のことです。プロパティは、人間が読める仕様と機械で検証可能な正確性の保証との橋渡しとなります。*

### プロパティ 1: ドラ枚数の上限

*任意の*問題生成において、生成された問題のドラ枚数は5枚以下でなければならない

**検証方法**: 
- 複数回（100回以上）問題を生成
- すべての問題で`hand.dora.length <= 5`であることを確認

**検証: 要件 1.1, 1.2, 2.2**

### 例 1: 各難易度での問題生成

各難易度（easy, medium, hard）で問題を生成し、すべてドラ枚数が5枚以下であることを確認

**検証: 要件 1.4**

## エラーハンドリング

### エラーケース

本機能では新しいエラーケースは発生しません。既存のエラーハンドリングをそのまま使用します。

### 考慮事項

- ドラ枚数を制限することで、目標飜数に到達できない場合がある
- この場合、現在の実装では目標飜数に近い値で問題が生成される
- これは許容される動作として扱う

## テスト戦略

### ユニットテスト

1. **ドラ枚数の境界値テスト**
   - ドラが0枚の場合
   - ドラが5枚の場合
   - ドラが5枚を超えないことの確認

2. **難易度別のテスト**
   - 各難易度で問題を生成し、ドラ枚数が5枚以下であることを確認

### プロパティベーステスト

fast-checkライブラリを使用して、以下のプロパティを検証します：

1. **プロパティ 1: ドラ枚数の上限**
   - 100回以上の問題生成を実行
   - すべての問題でドラ枚数が5枚以下であることを検証
   - タグ: `**Feature: limit-dora-display, Property 1: ドラ枚数の上限**`

### テスト実行

- 最小反復回数: 100回
- テストフレームワーク: Vitest + fast-check
- テストファイル: `src/services/ProblemGenerator.test.ts`

## 実装の詳細

### 修正箇所

**ファイル**: `src/services/ProblemGenerator.ts`

**修正前**:
```typescript
for (let i = 0; i < Math.min(diff, allTiles.length); i++) {
  const randomTile = allTiles[Math.floor(Math.random() * allTiles.length)];
  dora.push(randomTile);
}
```

**修正後**:
```typescript
const MAX_DORA_TILES = 5;
for (let i = 0; i < Math.min(diff, allTiles.length, MAX_DORA_TILES); i++) {
  const randomTile = allTiles[Math.floor(Math.random() * allTiles.length)];
  dora.push(randomTile);
}
```

### パフォーマンスへの影響

- **影響なし**: ループの上限が小さくなるため、むしろパフォーマンスが向上する可能性がある
- **メモリ使用量**: 変化なし

## 実装の順序

1. 定数`MAX_DORA_TILES`を追加
2. `adjustDoraForDifficulty`メソッドを修正
3. プロパティベーステストを実装
4. ユニットテストを実装
5. 既存のテストがすべてパスすることを確認

## 将来の拡張性

### 設定可能なドラ枚数上限

将来的に、ユーザーがドラ枚数の上限を設定できるようにする場合：

```typescript
interface GameSettings {
  redDora: boolean;
  kuitan: boolean;
  atozuke: boolean;
  maxDoraTiles?: number; // デフォルト: 5
}
```

この場合、`MAX_DORA_TILES`を`GameSettings`から取得するように変更します。

## まとめ

本設計は、最小限の変更でドラ枚数の制限を実装します。既存の機能に影響を与えず、テストで十分に検証できる設計となっています。
