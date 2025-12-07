import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QuizScreen } from './QuizScreen';
import { QuizProvider } from '../context';

/**
 * QuizScreenコンポーネントのテスト
 * 要件 10.1, 10.5 を検証
 */
describe('QuizScreen - Tutorial Display', () => {
  beforeEach(() => {
    // ローカルストレージをクリア
    localStorage.clear();
  });

  it('初回訪問時にチュートリアルが表示される（要件 10.1）', () => {
    // 初回訪問をシミュレート（チュートリアル設定がない状態）
    render(
      <QuizProvider>
        <QuizScreen />
      </QuizProvider>
    );

    // チュートリアルの最初のステップが表示されることを確認
    expect(screen.getByText('麻雀点数計算クイズへようこそ！')).toBeInTheDocument();
    expect(screen.getByText(/このアプリでは、麻雀の点数計算を楽しく学習できます/)).toBeInTheDocument();
  });

  it('チュートリアル完了後は表示されない（要件 10.5）', () => {
    // チュートリアル完了済みの設定を保存
    const completedSettings = {
      game: {
        redDora: true,
        kuitan: true,
        atozuke: true,
      },
      ui: {
        animation: {
          enabled: true,
          speed: 'normal' as const,
          reducedMotion: false,
        },
        sound: {
          enabled: false,
          volume: 0.5,
          correctSound: false,
          incorrectSound: false,
        },
        display: {
          fontSize: 'medium' as const,
          highContrast: false,
          showTooltips: true,
        },
        tutorial: {
          completed: true,
          skipped: false,
          lastShownVersion: '1.0.0',
        },
      },
    };
    
    localStorage.setItem('mahjong-quiz-ui-settings', JSON.stringify(completedSettings.ui));

    render(
      <QuizProvider>
        <QuizScreen />
      </QuizProvider>
    );

    // チュートリアルが表示されないことを確認
    expect(screen.queryByText('麻雀点数計算クイズへようこそ！')).not.toBeInTheDocument();
  });

  it('チュートリアルスキップ後は表示されない（要件 10.5）', () => {
    // チュートリアルスキップ済みの設定を保存
    const skippedSettings = {
      game: {
        redDora: true,
        kuitan: true,
        atozuke: true,
      },
      ui: {
        animation: {
          enabled: true,
          speed: 'normal' as const,
          reducedMotion: false,
        },
        sound: {
          enabled: false,
          volume: 0.5,
          correctSound: false,
          incorrectSound: false,
        },
        display: {
          fontSize: 'medium' as const,
          highContrast: false,
          showTooltips: true,
        },
        tutorial: {
          completed: false,
          skipped: true,
          lastShownVersion: '1.0.0',
        },
      },
    };
    
    localStorage.setItem('mahjong-quiz-ui-settings', JSON.stringify(skippedSettings.ui));

    render(
      <QuizProvider>
        <QuizScreen />
      </QuizProvider>
    );

    // チュートリアルが表示されないことを確認
    expect(screen.queryByText('麻雀点数計算クイズへようこそ！')).not.toBeInTheDocument();
  });
});
