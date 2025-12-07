import { describe, it, expect } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Tooltip } from './Tooltip';

describe('Tooltip', () => {

  it('子要素を正しくレンダリングする', () => {
    render(
      <Tooltip tooltip="テストツールチップ">
        <button>ホバーしてください</button>
      </Tooltip>
    );

    expect(screen.getByRole('button', { name: 'ホバーしてください' })).toBeInTheDocument();
  });

  it('初期状態ではツールチップが表示されない', () => {
    render(
      <Tooltip tooltip="テストツールチップ">
        <button>ホバーしてください</button>
      </Tooltip>
    );

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('ホバー時にディレイ後ツールチップが表示される', async () => {
    render(
      <Tooltip tooltip="テストツールチップ">
        <button>ホバーしてください</button>
      </Tooltip>
    );

    const button = screen.getByRole('button');
    fireEvent.mouseEnter(button);

    // デフォルトディレイ（300ms）後に表示される
    await waitFor(
      () => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
        expect(screen.getByText('テストツールチップ')).toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });

  it('ホバー解除時にツールチップが非表示になる', async () => {
    render(
      <Tooltip tooltip="テストツールチップ">
        <button>ホバーしてください</button>
      </Tooltip>
    );

    const button = screen.getByRole('button');
    fireEvent.mouseEnter(button);

    await waitFor(
      () => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      },
      { timeout: 1000 }
    );

    fireEvent.mouseLeave(button);

    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  it('カスタム設定でツールチップを表示する', async () => {
    render(
      <Tooltip
        tooltip={{
          content: 'カスタムツールチップ',
          position: 'bottom',
          delay: 100, // テスト用に短縮
          maxWidth: 300,
        }}
      >
        <button>ホバーしてください</button>
      </Tooltip>
    );

    const button = screen.getByRole('button');
    fireEvent.mouseEnter(button);

    // カスタムディレイ後に表示される
    await waitFor(
      () => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
        expect(screen.getByText('カスタムツールチップ')).toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });

  it('disabled時はツールチップが表示されない', async () => {
    render(
      <Tooltip tooltip="テストツールチップ" disabled>
        <button>ホバーしてください</button>
      </Tooltip>
    );

    const button = screen.getByRole('button');
    fireEvent.mouseEnter(button);

    // 十分な時間待っても表示されない
    await new Promise((resolve) => setTimeout(resolve, 400));
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('フォーカス時にもツールチップが表示される', async () => {
    render(
      <Tooltip tooltip="テストツールチップ">
        <button>フォーカスしてください</button>
      </Tooltip>
    );

    const button = screen.getByRole('button');
    fireEvent.focus(button);

    await waitFor(
      () => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });

  it('ブラー時にツールチップが非表示になる', async () => {
    render(
      <Tooltip tooltip="テストツールチップ">
        <button>フォーカスしてください</button>
      </Tooltip>
    );

    const button = screen.getByRole('button');
    fireEvent.focus(button);

    await waitFor(
      () => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
      },
      { timeout: 1000 }
    );

    fireEvent.blur(button);

    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  it('ディレイ中にホバー解除するとツールチップが表示されない', async () => {
    render(
      <Tooltip tooltip="テストツールチップ">
        <button>ホバーしてください</button>
      </Tooltip>
    );

    const button = screen.getByRole('button');
    fireEvent.mouseEnter(button);
    
    // ディレイの途中でホバー解除
    await new Promise((resolve) => setTimeout(resolve, 150));
    fireEvent.mouseLeave(button);
    
    // 残りの時間を待つ
    await new Promise((resolve) => setTimeout(resolve, 200));

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
});
