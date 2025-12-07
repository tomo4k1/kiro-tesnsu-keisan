import type { UISettings, AnimationSettings, SoundSettings, DisplaySettings, TutorialSettings } from '../types';
import { StorageError, logError } from '../types/errors';

/**
 * UI設定を管理するクラス
 * ローカルストレージへの保存・読み込み機能を提供
 */
export class UISettingsManager {
  private static readonly STORAGE_KEY = 'mahjong-quiz-ui-settings';

  /**
   * デフォルトのアニメーション設定
   */
  private static readonly DEFAULT_ANIMATION_SETTINGS: AnimationSettings = {
    enabled: true,
    speed: 'normal',
    reducedMotion: false,
  };

  /**
   * デフォルトの音声設定
   */
  private static readonly DEFAULT_SOUND_SETTINGS: SoundSettings = {
    enabled: false,
    volume: 0.5,
    correctSound: true,
    incorrectSound: true,
  };

  /**
   * デフォルトの表示設定
   */
  private static readonly DEFAULT_DISPLAY_SETTINGS: DisplaySettings = {
    fontSize: 'medium',
    highContrast: false,
    showTooltips: true,
  };

  /**
   * デフォルトのチュートリアル設定
   */
  private static readonly DEFAULT_TUTORIAL_SETTINGS: TutorialSettings = {
    completed: false,
    skipped: false,
    lastShownVersion: '',
  };

  /**
   * デフォルト設定を取得
   */
  static getDefaultSettings(): UISettings {
    return {
      animation: { ...this.DEFAULT_ANIMATION_SETTINGS },
      sound: { ...this.DEFAULT_SOUND_SETTINGS },
      display: { ...this.DEFAULT_DISPLAY_SETTINGS },
      tutorial: { ...this.DEFAULT_TUTORIAL_SETTINGS },
    };
  }

  /**
   * UI設定をローカルストレージに保存
   * @param settings 保存する設定
   * @throws StorageError 保存に失敗した場合
   */
  static saveSettings(settings: UISettings): void {
    try {
      // 設定の妥当性を検証
      if (!this.isValidSettings(settings)) {
        throw new StorageError('無効なUI設定データです');
      }
      
      const json = JSON.stringify(settings);
      localStorage.setItem(this.STORAGE_KEY, json);
    } catch (error) {
      logError(error, 'UISettingsManager.saveSettings');
      
      if (error instanceof StorageError) {
        throw error;
      }
      
      throw new StorageError('UI設定の保存に失敗しました', error);
    }
  }

  /**
   * UI設定をローカルストレージから読み込み
   * 保存された設定がない場合はデフォルト設定を返す
   * @returns 読み込んだ設定またはデフォルト設定
   */
  static loadSettings(): UISettings {
    try {
      const json = localStorage.getItem(this.STORAGE_KEY);
      
      if (json === null) {
        // 保存された設定がない場合はデフォルト設定を返す
        return this.getDefaultSettings();
      }

      const settings = JSON.parse(json) as UISettings;
      
      // 設定の妥当性チェック
      if (!this.isValidSettings(settings)) {
        logError(
          new StorageError('無効なUI設定が保存されていました'),
          'UISettingsManager.loadSettings'
        );
        return this.getDefaultSettings();
      }

      return settings;
    } catch (error) {
      logError(error, 'UISettingsManager.loadSettings');
      // エラー時はデフォルト設定を返す（アプリケーションを継続可能にする）
      return this.getDefaultSettings();
    }
  }

  /**
   * アニメーション設定の妥当性をチェック
   */
  private static isValidAnimationSettings(settings: unknown): settings is AnimationSettings {
    if (typeof settings !== 'object' || settings === null) {
      return false;
    }

    const s = settings as Record<string, unknown>;

    return (
      typeof s.enabled === 'boolean' &&
      (s.speed === 'slow' || s.speed === 'normal' || s.speed === 'fast' || s.speed === 'none') &&
      typeof s.reducedMotion === 'boolean'
    );
  }

  /**
   * 音声設定の妥当性をチェック
   */
  private static isValidSoundSettings(settings: unknown): settings is SoundSettings {
    if (typeof settings !== 'object' || settings === null) {
      return false;
    }

    const s = settings as Record<string, unknown>;

    return (
      typeof s.enabled === 'boolean' &&
      typeof s.volume === 'number' &&
      s.volume >= 0 &&
      s.volume <= 1 &&
      typeof s.correctSound === 'boolean' &&
      typeof s.incorrectSound === 'boolean'
    );
  }

  /**
   * 表示設定の妥当性をチェック
   */
  private static isValidDisplaySettings(settings: unknown): settings is DisplaySettings {
    if (typeof settings !== 'object' || settings === null) {
      return false;
    }

    const s = settings as Record<string, unknown>;

    return (
      (s.fontSize === 'small' || s.fontSize === 'medium' || s.fontSize === 'large') &&
      typeof s.highContrast === 'boolean' &&
      typeof s.showTooltips === 'boolean'
    );
  }

  /**
   * チュートリアル設定の妥当性をチェック
   */
  private static isValidTutorialSettings(settings: unknown): settings is TutorialSettings {
    if (typeof settings !== 'object' || settings === null) {
      return false;
    }

    const s = settings as Record<string, unknown>;

    return (
      typeof s.completed === 'boolean' &&
      typeof s.skipped === 'boolean' &&
      typeof s.lastShownVersion === 'string'
    );
  }

  /**
   * UI設定の妥当性をチェック
   * @param settings チェックする設定
   * @returns 妥当な設定の場合true
   */
  private static isValidSettings(settings: unknown): settings is UISettings {
    if (typeof settings !== 'object' || settings === null) {
      return false;
    }

    const s = settings as Record<string, unknown>;

    return (
      this.isValidAnimationSettings(s.animation) &&
      this.isValidSoundSettings(s.sound) &&
      this.isValidDisplaySettings(s.display) &&
      this.isValidTutorialSettings(s.tutorial)
    );
  }

  /**
   * 保存されたUI設定をクリア
   */
  static clearSettings(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('UI設定のクリアに失敗しました:', error);
    }
  }

  /**
   * アニメーション設定のみを更新
   */
  static updateAnimationSettings(animation: AnimationSettings): void {
    const currentSettings = this.loadSettings();
    this.saveSettings({
      ...currentSettings,
      animation,
    });
  }

  /**
   * 音声設定のみを更新
   */
  static updateSoundSettings(sound: SoundSettings): void {
    const currentSettings = this.loadSettings();
    this.saveSettings({
      ...currentSettings,
      sound,
    });
  }

  /**
   * 表示設定のみを更新
   */
  static updateDisplaySettings(display: DisplaySettings): void {
    const currentSettings = this.loadSettings();
    this.saveSettings({
      ...currentSettings,
      display,
    });
  }

  /**
   * チュートリアル設定のみを更新
   */
  static updateTutorialSettings(tutorial: TutorialSettings): void {
    const currentSettings = this.loadSettings();
    this.saveSettings({
      ...currentSettings,
      tutorial,
    });
  }
}
