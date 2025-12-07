import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { UISettingsManager } from './UISettingsManager';
import type { UISettings, AnimationSettings, SoundSettings, DisplaySettings, TutorialSettings } from '../types';

describe('UISettingsManager', () => {
  // 各テストの前にlocalStorageをクリア
  beforeEach(() => {
    localStorage.clear();
  });

  // 各テストの後にlocalStorageをクリア
  afterEach(() => {
    localStorage.clear();
  });

  describe('getDefaultSettings', () => {
    it('デフォルト設定を返すこと', () => {
      const settings = UISettingsManager.getDefaultSettings();
      
      expect(settings).toEqual({
        animation: {
          enabled: true,
          speed: 'normal',
          reducedMotion: false,
        },
        sound: {
          enabled: false,
          volume: 0.5,
          correctSound: true,
          incorrectSound: true,
        },
        display: {
          fontSize: 'medium',
          highContrast: false,
          showTooltips: true,
        },
        tutorial: {
          completed: false,
          skipped: false,
          lastShownVersion: '',
        },
      });
    });

    it('新しいオブジェクトを返すこと（参照が異なる）', () => {
      const settings1 = UISettingsManager.getDefaultSettings();
      const settings2 = UISettingsManager.getDefaultSettings();
      
      expect(settings1).not.toBe(settings2);
      expect(settings1.animation).not.toBe(settings2.animation);
      expect(settings1.sound).not.toBe(settings2.sound);
      expect(settings1.display).not.toBe(settings2.display);
      expect(settings1.tutorial).not.toBe(settings2.tutorial);
    });
  });

  describe('saveSettings and loadSettings', () => {
    it('設定を保存して読み込めること', () => {
      const settings: UISettings = {
        animation: {
          enabled: false,
          speed: 'fast',
          reducedMotion: true,
        },
        sound: {
          enabled: true,
          volume: 0.8,
          correctSound: false,
          incorrectSound: true,
        },
        display: {
          fontSize: 'large',
          highContrast: true,
          showTooltips: false,
        },
        tutorial: {
          completed: true,
          skipped: false,
          lastShownVersion: '1.0.0',
        },
      };

      UISettingsManager.saveSettings(settings);
      const loaded = UISettingsManager.loadSettings();

      expect(loaded).toEqual(settings);
    });

    it('保存された設定がない場合はデフォルト設定を返すこと', () => {
      const loaded = UISettingsManager.loadSettings();
      const defaultSettings = UISettingsManager.getDefaultSettings();

      expect(loaded).toEqual(defaultSettings);
    });

    it('無効な設定が保存されている場合はデフォルト設定を返すこと', () => {
      // 無効なデータを直接localStorageに保存
      localStorage.setItem('mahjong-quiz-ui-settings', JSON.stringify({ invalid: 'data' }));

      const loaded = UISettingsManager.loadSettings();
      const defaultSettings = UISettingsManager.getDefaultSettings();

      expect(loaded).toEqual(defaultSettings);
    });

    it('JSONパースエラーが発生した場合はデフォルト設定を返すこと', () => {
      // 無効なJSONを直接localStorageに保存
      localStorage.setItem('mahjong-quiz-ui-settings', 'invalid json');

      const loaded = UISettingsManager.loadSettings();
      const defaultSettings = UISettingsManager.getDefaultSettings();

      expect(loaded).toEqual(defaultSettings);
    });
  });

  describe('updateAnimationSettings', () => {
    it('アニメーション設定のみを更新すること', () => {
      const initialSettings = UISettingsManager.getDefaultSettings();
      UISettingsManager.saveSettings(initialSettings);

      const newAnimation: AnimationSettings = {
        enabled: false,
        speed: 'slow',
        reducedMotion: true,
      };

      UISettingsManager.updateAnimationSettings(newAnimation);
      const loaded = UISettingsManager.loadSettings();

      expect(loaded.animation).toEqual(newAnimation);
      expect(loaded.sound).toEqual(initialSettings.sound);
      expect(loaded.display).toEqual(initialSettings.display);
      expect(loaded.tutorial).toEqual(initialSettings.tutorial);
    });
  });

  describe('updateSoundSettings', () => {
    it('音声設定のみを更新すること', () => {
      const initialSettings = UISettingsManager.getDefaultSettings();
      UISettingsManager.saveSettings(initialSettings);

      const newSound: SoundSettings = {
        enabled: true,
        volume: 0.9,
        correctSound: false,
        incorrectSound: false,
      };

      UISettingsManager.updateSoundSettings(newSound);
      const loaded = UISettingsManager.loadSettings();

      expect(loaded.sound).toEqual(newSound);
      expect(loaded.animation).toEqual(initialSettings.animation);
      expect(loaded.display).toEqual(initialSettings.display);
      expect(loaded.tutorial).toEqual(initialSettings.tutorial);
    });
  });

  describe('updateDisplaySettings', () => {
    it('表示設定のみを更新すること', () => {
      const initialSettings = UISettingsManager.getDefaultSettings();
      UISettingsManager.saveSettings(initialSettings);

      const newDisplay: DisplaySettings = {
        fontSize: 'small',
        highContrast: true,
        showTooltips: false,
      };

      UISettingsManager.updateDisplaySettings(newDisplay);
      const loaded = UISettingsManager.loadSettings();

      expect(loaded.display).toEqual(newDisplay);
      expect(loaded.animation).toEqual(initialSettings.animation);
      expect(loaded.sound).toEqual(initialSettings.sound);
      expect(loaded.tutorial).toEqual(initialSettings.tutorial);
    });
  });

  describe('updateTutorialSettings', () => {
    it('チュートリアル設定のみを更新すること', () => {
      const initialSettings = UISettingsManager.getDefaultSettings();
      UISettingsManager.saveSettings(initialSettings);

      const newTutorial: TutorialSettings = {
        completed: true,
        skipped: false,
        lastShownVersion: '1.0.0',
      };

      UISettingsManager.updateTutorialSettings(newTutorial);
      const loaded = UISettingsManager.loadSettings();

      expect(loaded.tutorial).toEqual(newTutorial);
      expect(loaded.animation).toEqual(initialSettings.animation);
      expect(loaded.sound).toEqual(initialSettings.sound);
      expect(loaded.display).toEqual(initialSettings.display);
    });
  });

  describe('clearSettings', () => {
    it('保存された設定をクリアすること', () => {
      const settings = UISettingsManager.getDefaultSettings();
      UISettingsManager.saveSettings(settings);

      // 設定が保存されていることを確認
      expect(localStorage.getItem('mahjong-quiz-ui-settings')).not.toBeNull();

      UISettingsManager.clearSettings();

      // 設定がクリアされていることを確認
      expect(localStorage.getItem('mahjong-quiz-ui-settings')).toBeNull();
    });
  });

  describe('設定の妥当性検証', () => {
    it('無効なアニメーション速度を拒否すること', () => {
      const invalidSettings = {
        animation: {
          enabled: true,
          speed: 'invalid',
          reducedMotion: false,
        },
        sound: {
          enabled: false,
          volume: 0.5,
          correctSound: true,
          incorrectSound: true,
        },
        display: {
          fontSize: 'medium',
          highContrast: false,
          showTooltips: true,
        },
        tutorial: {
          completed: false,
          skipped: false,
          lastShownVersion: '',
        },
      };

      expect(() => {
        UISettingsManager.saveSettings(invalidSettings as UISettings);
      }).toThrow('無効なUI設定データです');
    });

    it('無効な音量値を拒否すること', () => {
      const invalidSettings = {
        animation: {
          enabled: true,
          speed: 'normal',
          reducedMotion: false,
        },
        sound: {
          enabled: false,
          volume: 1.5, // 無効な値（0-1の範囲外）
          correctSound: true,
          incorrectSound: true,
        },
        display: {
          fontSize: 'medium',
          highContrast: false,
          showTooltips: true,
        },
        tutorial: {
          completed: false,
          skipped: false,
          lastShownVersion: '',
        },
      };

      expect(() => {
        UISettingsManager.saveSettings(invalidSettings as UISettings);
      }).toThrow('無効なUI設定データです');
    });

    it('無効なフォントサイズを拒否すること', () => {
      const invalidSettings = {
        animation: {
          enabled: true,
          speed: 'normal',
          reducedMotion: false,
        },
        sound: {
          enabled: false,
          volume: 0.5,
          correctSound: true,
          incorrectSound: true,
        },
        display: {
          fontSize: 'extra-large', // 無効な値
          highContrast: false,
          showTooltips: true,
        },
        tutorial: {
          completed: false,
          skipped: false,
          lastShownVersion: '',
        },
      };

      expect(() => {
        UISettingsManager.saveSettings(invalidSettings as UISettings);
      }).toThrow('無効なUI設定データです');
    });
  });
});
