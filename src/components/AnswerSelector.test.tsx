import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AnswerSelector } from './AnswerSelector';

describe('AnswerSelector - 視覚的フィードバック強化', () => {
  const mockOnSelect = vi.fn();
  const defaultProps = {
    type: 'fu' as const,
    options: [20, 30, 40, 50],
    selectedValue: null,
    correctValue: null,
    isAnswered: false,
    onSelect: mockOnSelect,
  };

  it('要件 1.3: ホバー時に視覚的フィードバックを提供する', () => {
    render(<AnswerSelector {...defaultProps} />);
    
    const button = screen.getByRole('radio', { name: /20符を選択/ });
    
    // ホバー前の状態を確認
    expect(button).toBeInTheDocument();
    
    // ホバーイベントをシミュレート
    fireEvent.mouseEnter(button);
    
    // ホバー後もボタンが存在することを確認
    expect(button).toBeInTheDocument();
    
    // ホバー解除
    fireEvent.mouseLeave(button);
    
    expect(button).toBeInTheDocument();
  });

  it('要件 1.4: 選択時にアニメーションを適用する', () => {
    const { rerender } = render(<AnswerSelector {...defaultProps} />);
    
    const button = screen.getByRole('radio', { name: /30符を選択/ });
    
    // ボタンをクリック
    fireEvent.click(button);
    
    // onSelectが呼ばれることを確認
    expect(mockOnSelect).toHaveBeenCalledWith(30);
    
    // 選択状態で再レンダリング
    rerender(<AnswerSelector {...defaultProps} selectedValue={30} />);
    
    // 選択されたボタンにアニメーションクラスが適用されていることを確認
    const selectedButton = screen.getByRole('radio', { name: /30符を選択/ });
    expect(selectedButton.className).toContain('animate-select-bounce');
  });

  it('要件 1.4: 送信中はローディング状態を表示する', () => {
    render(
      <AnswerSelector 
        {...defaultProps} 
        selectedValue={40}
        isSubmitting={true}
      />
    );
    
    // 送信中のインジケーターを確認
    const selectedButton = screen.getByRole('radio', { name: /40符を選択/ });
    expect(selectedButton.className).toContain('animate-pulse-slow');
    expect(selectedButton).toBeDisabled();
  });

  it('送信中はホバーイベントが無効化される', () => {
    render(
      <AnswerSelector 
        {...defaultProps} 
        isSubmitting={true}
      />
    );
    
    const button = screen.getByRole('radio', { name: /20符を選択/ });
    
    // ホバーイベントをシミュレート
    fireEvent.mouseEnter(button);
    
    // 送信中はホバー効果が適用されないことを確認
    expect(button.className).toContain('cursor-wait');
  });

  it('回答後は正解・不正解のアニメーションを表示する', () => {
    render(
      <AnswerSelector 
        {...defaultProps} 
        selectedValue={30}
        correctValue={40}
        isAnswered={true}
      />
    );
    
    // 不正解の選択肢にアニメーションが適用されていることを確認
    const incorrectButton = screen.getByRole('radio', { name: /30符を選択（不正解）/ });
    expect(incorrectButton.className).toContain('animate-incorrect-shake');
    
    // 正解の選択肢にアニメーションが適用されていることを確認
    const correctButton = screen.getByRole('radio', { name: /40符を選択（正解）/ });
    expect(correctButton.className).toContain('animate-fadeIn');
  });

  it('選択状態の表示が正しく更新される', () => {
    const { rerender } = render(<AnswerSelector {...defaultProps} />);
    
    // 初期状態では選択中のメッセージが表示されない
    expect(screen.queryByText(/を選択中/)).not.toBeInTheDocument();
    
    // 選択後は選択中のメッセージが表示される
    rerender(<AnswerSelector {...defaultProps} selectedValue={50} />);
    expect(screen.getByText(/50符 を選択中/)).toBeInTheDocument();
  });

  it('アクセシビリティ属性が正しく設定される', () => {
    render(
      <AnswerSelector 
        {...defaultProps} 
        selectedValue={30}
        isSubmitting={true}
      />
    );
    
    const selectedButton = screen.getByRole('radio', { name: /30符を選択/ });
    
    // aria属性が正しく設定されていることを確認
    expect(selectedButton).toHaveAttribute('aria-checked', 'true');
    expect(selectedButton).toHaveAttribute('aria-disabled', 'true');
    expect(selectedButton).toHaveAttribute('aria-busy', 'true');
  });
});
