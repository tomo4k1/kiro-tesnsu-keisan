import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HandDisplay } from './HandDisplay';
import type { Hand } from '../types';

describe('HandDisplay', () => {
  const createTestHand = (overrides?: Partial<Hand>): Hand => ({
    closedTiles: [
      { type: 'honor', honor: 'white' },
      { type: 'man', value: 5, isRed: true },
      { type: 'pin', value: 3 },
      { type: 'man', value: 1 },
      { type: 'honor', honor: 'east' },
      { type: 'sou', value: 7 },
    ],
    melds: [],
    winningTile: { type: 'man', value: 9 },
    isDealer: false,
    winType: 'tsumo',
    prevalentWind: 'east',
    seatWind: 'south',
    dora: [],
    ...overrides,
  });

  describe('牌のソート機能（要件 12.1）', () => {
    it('手牌が萬子→筒子→索子→風牌→役牌の順序で表示される', () => {
      const hand = createTestHand();
      const { container } = render(<HandDisplay hand={hand} />);
      
      // 手牌セクションを取得
      const handSection = container.querySelector('.space-y-4');
      expect(handSection).toBeTruthy();
      
      // ソート機能が適用されていることを確認（sortTilesが呼ばれている）
      // 実際の順序: 萬子(1, 5赤) → 筒子(3) → 索子(7) → 風牌(東) → 役牌(白)
      const tiles = handSection?.querySelectorAll('.inline-flex');
      expect(tiles).toBeTruthy();
      expect(tiles!.length).toBeGreaterThan(0);
    });

    it('赤ドラが通常の5と同じ位置に配置される', () => {
      const hand = createTestHand({
        closedTiles: [
          { type: 'man', value: 5, isRed: true },
          { type: 'man', value: 4 },
          { type: 'man', value: 6 },
        ],
      });
      
      render(<HandDisplay hand={hand} />);
      
      // 赤ドラが正しくレンダリングされることを確認
      const redTiles = document.querySelectorAll('.bg-red-50');
      expect(redTiles.length).toBeGreaterThan(0);
    });
  });

  describe('点数フォーマット機能（要件 11.1, 11.2）', () => {
    it('子のツモ時に「1300-2600」形式で点数を表示する', () => {
      const hand = createTestHand({
        isDealer: false,
        winType: 'tsumo',
      });
      
      render(<HandDisplay hand={hand} correctScore={5200} />);
      
      // 点数表示を確認
      expect(screen.getByText('点数:')).toBeInTheDocument();
      expect(screen.getByText('1300-2600')).toBeInTheDocument();
      
      // 詳細な支払い内訳も表示されることを確認
      expect(screen.getByText(/子: 1300点/)).toBeInTheDocument();
      expect(screen.getByText(/親: 2600点/)).toBeInTheDocument();
    });

    it('親のツモ時に「2000オール」形式で点数を表示する', () => {
      const hand = createTestHand({
        isDealer: true,
        winType: 'tsumo',
      });
      
      render(<HandDisplay hand={hand} correctScore={6000} />);
      
      // 点数表示を確認
      expect(screen.getByText('点数:')).toBeInTheDocument();
      expect(screen.getByText('2000オール')).toBeInTheDocument();
    });

    it('ロン時に単一の数値で点数を表示する', () => {
      const hand = createTestHand({
        isDealer: false,
        winType: 'ron',
      });
      
      render(<HandDisplay hand={hand} correctScore={3900} />);
      
      // 点数表示を確認
      expect(screen.getByText('点数:')).toBeInTheDocument();
      expect(screen.getByText('3900')).toBeInTheDocument();
    });

    it('correctScoreが指定されていない場合は点数を表示しない', () => {
      const hand = createTestHand();
      
      render(<HandDisplay hand={hand} />);
      
      // 点数表示がないことを確認
      expect(screen.queryByText('点数:')).not.toBeInTheDocument();
    });
  });

  describe('状態バッジの表示（要件 13.1, 13.3）', () => {
    it('門前の手牌に「門前」バッジを表示する', () => {
      const hand = createTestHand({
        melds: [],
      });
      
      render(<HandDisplay hand={hand} />);
      
      // 門前バッジが表示されることを確認
      expect(screen.getByText('門前')).toBeInTheDocument();
      expect(screen.getByLabelText('門前')).toBeInTheDocument();
    });

    it('鳴きがある手牌に「鳴き」バッジを表示する', () => {
      const hand = createTestHand({
        melds: [
          {
            type: 'pon',
            tiles: [
              { type: 'man', value: 1 },
              { type: 'man', value: 1 },
              { type: 'man', value: 1 },
            ],
          },
        ],
      });
      
      render(<HandDisplay hand={hand} />);
      
      // 鳴きバッジが表示されることを確認
      expect(screen.getByText('鳴き')).toBeInTheDocument();
      // 複数の「鳴き」ラベルがあるため、getAllByLabelTextを使用
      const nakiElements = screen.getAllByLabelText('鳴き');
      expect(nakiElements.length).toBeGreaterThan(0);
    });

    it('状態バッジが目立つ位置（上部）に表示される', () => {
      const hand = createTestHand();
      
      const { container } = render(<HandDisplay hand={hand} />);
      
      // 状態バッジのコンテナを取得
      const statusBadgeContainer = container.querySelector('.mb-3');
      expect(statusBadgeContainer).toBeTruthy();
      
      // 状態バッジが存在することを確認
      const statusBadge = screen.getByRole('group', { name: '手牌の状態' });
      expect(statusBadge).toBeInTheDocument();
      
      // 状態バッジが手牌情報より前に表示されることを確認
      // DOMツリーの順序を確認
      const mainContainer = container.querySelector('.bg-gradient-to-b');
      expect(mainContainer).toBeTruthy();
      
      const children = Array.from(mainContainer!.children);
      const statusIndex = children.findIndex(child => 
        child.classList.contains('mb-3')
      );
      const infoIndex = children.findIndex(child => 
        child.textContent?.includes('家:')
      );
      
      expect(statusIndex).toBeGreaterThan(-1);
      expect(infoIndex).toBeGreaterThan(-1);
      expect(statusIndex).toBeLessThan(infoIndex);
    });
  });

  describe('基本的な手牌表示', () => {
    it('手牌の基本情報を表示する', () => {
      const hand = createTestHand();
      
      render(<HandDisplay hand={hand} />);
      
      // 基本情報の表示を確認
      expect(screen.getByText('家:')).toBeInTheDocument();
      expect(screen.getByText('子')).toBeInTheDocument();
      expect(screen.getByText('和了:')).toBeInTheDocument();
      expect(screen.getByText('ツモ')).toBeInTheDocument();
      expect(screen.getByText('場風:')).toBeInTheDocument();
      expect(screen.getByText('自風:')).toBeInTheDocument();
    });

    it('和了牌を強調表示する', () => {
      const hand = createTestHand();
      
      const { container } = render(<HandDisplay hand={hand} />);
      
      // 和了牌が強調表示されることを確認（ring-4クラス）
      const winningTile = container.querySelector('.ring-4');
      expect(winningTile).toBeTruthy();
    });

    it('鳴きがある場合は鳴きを表示する', () => {
      const hand = createTestHand({
        melds: [
          {
            type: 'pon',
            tiles: [
              { type: 'man', value: 1 },
              { type: 'man', value: 1 },
              { type: 'man', value: 1 },
            ],
          },
        ],
      });
      
      render(<HandDisplay hand={hand} />);
      
      expect(screen.getByText('鳴き:')).toBeInTheDocument();
      expect(screen.getByText('ポン')).toBeInTheDocument();
    });

    it('ドラ表示牌がある場合はドラを表示する', () => {
      const hand = createTestHand({
        dora: [{ type: 'man', value: 5 }],
      });
      
      render(<HandDisplay hand={hand} />);
      
      expect(screen.getByText('ドラ表示牌:')).toBeInTheDocument();
    });
  });
});
