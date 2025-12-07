import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HelpModal } from './HelpModal';

describe('HelpModal', () => {
  it('モーダルが閉じている時は何も表示しない', () => {
    const onClose = vi.fn();
    const { container } = render(
      <HelpModal isOpen={false} onClose={onClose} />
    );
    
    expect(container.firstChild).toBeNull();
  });

  it('モーダルが開いている時はヘルプコンテンツを表示する', () => {
    const onClose = vi.fn();
    render(<HelpModal isOpen={true} onClose={onClose} />);
    
    // ヘッダーが表示されている
    expect(screen.getByText('ヘルプ')).toBeInTheDocument();
    
    // デフォルトで概要セクションが表示されている（複数あるので最初のものを確認）
    const overviewElements = screen.getAllByText('概要');
    expect(overviewElements.length).toBeGreaterThan(0);
  });

  it('閉じるボタンをクリックするとonCloseが呼ばれる', () => {
    const onClose = vi.fn();
    render(<HelpModal isOpen={true} onClose={onClose} />);
    
    const closeButton = screen.getByLabelText('ヘルプを閉じる');
    fireEvent.click(closeButton);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('背景オーバーレイをクリックするとonCloseが呼ばれる', () => {
    const onClose = vi.fn();
    const { container } = render(<HelpModal isOpen={true} onClose={onClose} />);
    
    const overlay = container.querySelector('.bg-black.bg-opacity-50');
    if (overlay) {
      fireEvent.click(overlay);
    }
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('セクションを切り替えることができる', () => {
    const onClose = vi.fn();
    render(<HelpModal isOpen={true} onClose={onClose} />);
    
    // キーボード操作セクションに切り替え
    const keyboardButton = screen.getByRole('button', { name: /キーボード操作/ });
    fireEvent.click(keyboardButton);
    
    // キーボード操作の内容が表示される
    expect(screen.getByText('数字キー（1-9）')).toBeInTheDocument();
  });

  it('すべてのヘルプセクションが表示される', () => {
    const onClose = vi.fn();
    render(<HelpModal isOpen={true} onClose={onClose} />);
    
    // すべてのセクションボタンが存在する
    expect(screen.getByRole('button', { name: /概要/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /点数計算/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /キーボード操作/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /統計情報/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /設定/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /その他の機能/ })).toBeInTheDocument();
  });

  it('フッターの閉じるボタンをクリックするとonCloseが呼ばれる', () => {
    const onClose = vi.fn();
    render(<HelpModal isOpen={true} onClose={onClose} />);
    
    const footerCloseButton = screen.getByRole('button', { name: '閉じる' });
    fireEvent.click(footerCloseButton);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('適切なARIA属性が設定されている', () => {
    const onClose = vi.fn();
    const { container } = render(<HelpModal isOpen={true} onClose={onClose} />);
    
    const dialog = container.querySelector('[role="dialog"]');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'help-modal-title');
  });
});
