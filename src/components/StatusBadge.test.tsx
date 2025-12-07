import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from './StatusBadge';

describe('StatusBadge', () => {
  it('空の状態配列の場合は何も表示しない', () => {
    const { container } = render(<StatusBadge status={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('立直状態を正しく表示する', () => {
    render(<StatusBadge status={['riichi']} />);
    expect(screen.getByLabelText('立直')).toBeInTheDocument();
    expect(screen.getByText('立直')).toBeInTheDocument();
  });

  it('門前状態を正しく表示する', () => {
    render(<StatusBadge status={['menzen']} />);
    expect(screen.getByLabelText('門前')).toBeInTheDocument();
    expect(screen.getByText('門前')).toBeInTheDocument();
  });

  it('鳴きあり状態を正しく表示する', () => {
    render(<StatusBadge status={['open']} />);
    expect(screen.getByLabelText('鳴き')).toBeInTheDocument();
    expect(screen.getByText('鳴き')).toBeInTheDocument();
  });

  it('一発状態を正しく表示する', () => {
    render(<StatusBadge status={['ippatsu']} />);
    expect(screen.getByLabelText('一発')).toBeInTheDocument();
    expect(screen.getByText('一発')).toBeInTheDocument();
  });

  it('ダブル立直状態を正しく表示する', () => {
    render(<StatusBadge status={['doubleRiichi']} />);
    expect(screen.getByLabelText('ダブル立直')).toBeInTheDocument();
    expect(screen.getByText('ダブル立直')).toBeInTheDocument();
  });

  it('複数の状態を同時に表示する（要件 13.4）', () => {
    render(<StatusBadge status={['riichi', 'menzen', 'ippatsu']} />);
    
    expect(screen.getByLabelText('立直')).toBeInTheDocument();
    expect(screen.getByLabelText('門前')).toBeInTheDocument();
    expect(screen.getByLabelText('一発')).toBeInTheDocument();
  });

  it('smallサイズで表示できる', () => {
    const { container } = render(<StatusBadge status={['riichi']} size="small" />);
    const badge = container.querySelector('[role="status"]');
    expect(badge).toHaveClass('text-xs');
  });

  it('mediumサイズで表示できる', () => {
    const { container } = render(<StatusBadge status={['riichi']} size="medium" />);
    const badge = container.querySelector('[role="status"]');
    expect(badge).toHaveClass('text-sm');
  });

  it('largeサイズで表示できる', () => {
    const { container } = render(<StatusBadge status={['riichi']} size="large" />);
    const badge = container.querySelector('[role="status"]');
    expect(badge).toHaveClass('text-base');
  });

  it('適切なARIAラベルを持つ', () => {
    render(<StatusBadge status={['riichi', 'menzen']} />);
    
    // グループ全体のラベル
    expect(screen.getByRole('group', { name: '手牌の状態' })).toBeInTheDocument();
    
    // 個別のバッジのラベル
    expect(screen.getByLabelText('立直')).toBeInTheDocument();
    expect(screen.getByLabelText('門前')).toBeInTheDocument();
  });

  it('各状態に適切な色クラスが適用される（要件 13.5）', () => {
    const { container } = render(
      <StatusBadge status={['riichi', 'menzen', 'open', 'ippatsu', 'doubleRiichi']} />
    );
    
    const badges = container.querySelectorAll('[role="status"]');
    
    // 立直: 赤色
    expect(badges[0]).toHaveClass('bg-red-100', 'text-red-700', 'border-red-400');
    
    // 門前: 青色
    expect(badges[1]).toHaveClass('bg-blue-100', 'text-blue-700', 'border-blue-400');
    
    // 鳴き: オレンジ色
    expect(badges[2]).toHaveClass('bg-orange-100', 'text-orange-700', 'border-orange-400');
    
    // 一発: 黄色
    expect(badges[3]).toHaveClass('bg-yellow-100', 'text-yellow-700', 'border-yellow-400');
    
    // ダブル立直: 紫色
    expect(badges[4]).toHaveClass('bg-purple-100', 'text-purple-700', 'border-purple-400');
  });

  it('各状態に適切なアイコンが表示される（要件 13.5）', () => {
    const { container } = render(
      <StatusBadge status={['riichi', 'menzen', 'open', 'ippatsu', 'doubleRiichi']} />
    );
    
    // アイコンが存在することを確認
    const icons = container.querySelectorAll('[aria-hidden="true"]');
    expect(icons).toHaveLength(5);
    
    // 各アイコンの内容を確認
    expect(icons[0]).toHaveTextContent('🎯');
    expect(icons[1]).toHaveTextContent('🔒');
    expect(icons[2]).toHaveTextContent('🔓');
    expect(icons[3]).toHaveTextContent('⚡');
    expect(icons[4]).toHaveTextContent('🎯🎯');
  });
});
