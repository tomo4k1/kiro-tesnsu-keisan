import { useEffect } from 'react';

/**
 * キーボードショートカットの型定義
 * 要件 4.1, 4.2, 4.3, 4.4, 4.5
 */
export interface KeyboardShortcut {
  /** キー名（例: '1', 'Enter', 'Escape'） */
  key: string;
  /** Ctrlキーが押されている必要があるか */
  ctrlKey?: boolean;
  /** Shiftキーが押されている必要があるか */
  shiftKey?: boolean;
  /** Altキーが押されている必要があるか */
  altKey?: boolean;
  /** ショートカットが実行されたときのアクション */
  action: () => void;
  /** ショートカットの説明（ヘルプ表示用） */
  description: string;
  /** ショートカットが有効かどうか */
  enabled: boolean;
}

/**
 * キーボードショートカットを管理するカスタムフック
 * 
 * @param shortcuts - 登録するショートカットの配列
 * @param isEnabled - ショートカット機能全体の有効/無効
 * 
 * @example
 * ```tsx
 * useKeyboardShortcuts([
 *   {
 *     key: '1',
 *     action: () => selectOption(1),
 *     description: '選択肢1を選択',
 *     enabled: true,
 *   },
 *   {
 *     key: 'Enter',
 *     action: () => submitAnswer(),
 *     description: '回答を送信',
 *     enabled: !isAnswered,
 *   },
 * ], true);
 * ```
 * 
 * 要件 4.1: 数字キーで選択肢を選択
 * 要件 4.2: Enterキーで回答を送信
 * 要件 4.3: Spaceキーで次の問題に進む
 * 要件 4.4: Escapeキーでモーダルを閉じる
 * 要件 4.5: Tabキーでフォーカス移動（ブラウザのデフォルト動作）
 */
export function useKeyboardShortcuts(
  shortcuts: KeyboardShortcut[],
  isEnabled: boolean = true
): void {
  useEffect(() => {
    // 機能が無効の場合は何もしない
    if (!isEnabled) return;

    /**
     * キーボードイベントハンドラ
     */
    const handleKeyDown = (event: KeyboardEvent): void => {
      // 入力フィールドにフォーカスがある場合はショートカットを無効化
      const target = event.target as HTMLElement;
      const isInputField = 
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable;

      // 入力フィールドの場合、Escapeキー以外は無視
      if (isInputField && event.key !== 'Escape') {
        return;
      }

      // マッチするショートカットを検索
      const matchingShortcut = shortcuts.find(shortcut => {
        // ショートカットが無効の場合はスキップ
        if (!shortcut.enabled) return false;

        // キーが一致するか確認
        const keyMatches = shortcut.key === event.key;
        
        // 修飾キーが一致するか確認
        const ctrlMatches = shortcut.ctrlKey === undefined || shortcut.ctrlKey === event.ctrlKey;
        const shiftMatches = shortcut.shiftKey === undefined || shortcut.shiftKey === event.shiftKey;
        const altMatches = shortcut.altKey === undefined || shortcut.altKey === event.altKey;

        return keyMatches && ctrlMatches && shiftMatches && altMatches;
      });

      // マッチするショートカットが見つかった場合、アクションを実行
      if (matchingShortcut) {
        event.preventDefault();
        matchingShortcut.action();
      }
    };

    // イベントリスナーを登録
    window.addEventListener('keydown', handleKeyDown);

    // クリーンアップ関数
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts, isEnabled]);
}
