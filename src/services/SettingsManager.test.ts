import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SettingsManager } from './SettingsManager';
import type { GameSettings } from '../types';

describe('SettingsManager', () => {
  // ローカルストレージのモック
  const localStorageMock = (() => {
    let store: Record<string, string> = {};

    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
    };
  })();

  beforeEach(() => {
    // 各テスト前にストレージをクリア
    localStorageMock.clear();
    // グローバルのlocalStorageをモックで置き換え
    Object.defineProperty(global, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
  });

  describe('getDefaultSettings', () => {
    it('デフォルト設定を返す', () => {
      const settings = SettingsManager.getDefaultSettings();
      
      expect(settings).toEqual({
        redDora: true,
        kuitan: true,
        atozuke: true,
      });
    });

    it('返される設定は新しいオブジェクトである', () => {
      const settings1 = SettingsManager.getDefaultSettings();
      const settings2 = SettingsManager.getDefaultSettings();
      
      expect(settings1).not.toBe(settings2);
      expect(settings1).toEqual(settings2);
    });
  });

  describe('saveSettings', () => {
    it('設定をローカルストレージに保存できる', () => {
      const settings: GameSettings = {
        redDora: false,
        kuitan: true,
        atozuke: false,
      };

      SettingsManager.saveSettings(settings);

      const saved = localStorage.getItem('mahjong-quiz-settings');
      expect(saved).not.toBeNull();
      expect(JSON.parse(saved!)).toEqual(settings);
    });

    it('既存の設定を上書きできる', () => {
      const settings1: GameSettings = {
        redDora: true,
        kuitan: true,
        atozuke: true,
      };

      const settings2: GameSettings = {
        redDora: false,
        kuitan: false,
        atozuke: false,
      };

      SettingsManager.saveSettings(settings1);
      SettingsManager.saveSettings(settings2);

      const saved = localStorage.getItem('mahjong-quiz-settings');
      expect(JSON.parse(saved!)).toEqual(settings2);
    });
  });

  describe('loadSettings', () => {
    it('保存された設定を読み込める', () => {
      const settings: GameSettings = {
        redDora: false,
        kuitan: true,
        atozuke: false,
      };

      SettingsManager.saveSettings(settings);
      const loaded = SettingsManager.loadSettings();

      expect(loaded).toEqual(settings);
    });

    it('保存された設定がない場合はデフォルト設定を返す', () => {
      const loaded = SettingsManager.loadSettings();

      expect(loaded).toEqual(SettingsManager.getDefaultSettings());
    });

    it('無効な設定が保存されている場合はデフォルト設定を返す', () => {
      localStorage.setItem('mahjong-quiz-settings', '{"invalid": "data"}');

      const loaded = SettingsManager.loadSettings();

      expect(loaded).toEqual(SettingsManager.getDefaultSettings());
    });

    it('JSONパースエラーが発生した場合はデフォルト設定を返す', () => {
      localStorage.setItem('mahjong-quiz-settings', 'invalid json');

      const loaded = SettingsManager.loadSettings();

      expect(loaded).toEqual(SettingsManager.getDefaultSettings());
    });
  });

  describe('clearSettings', () => {
    it('保存された設定をクリアできる', () => {
      const settings: GameSettings = {
        redDora: false,
        kuitan: true,
        atozuke: false,
      };

      SettingsManager.saveSettings(settings);
      expect(localStorage.getItem('mahjong-quiz-settings')).not.toBeNull();

      SettingsManager.clearSettings();
      expect(localStorage.getItem('mahjong-quiz-settings')).toBeNull();
    });
  });
});
