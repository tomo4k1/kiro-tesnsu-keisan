import type { GameSettings } from '../types';
import { StorageError, logError } from '../types/errors';

/**
 * ゲーム設定を管理するクラス
 * ローカルストレージへの保存・読み込み機能を提供
 */
export class SettingsManager {
  private static readonly STORAGE_KEY = 'mahjong-quiz-settings';

  /**
   * デフォルト設定
   */
  private static readonly DEFAULT_SETTINGS: GameSettings = {
    redDora: true,      // 赤ドラあり
    kuitan: true,       // 喰いタンあり
    atozuke: true,      // 後付けあり
  };

  /**
   * デフォルト設定を取得
   */
  static getDefaultSettings(): GameSettings {
    return { ...this.DEFAULT_SETTINGS };
  }

  /**
   * 設定をローカルストレージに保存
   * @param settings 保存する設定
   * @throws StorageError 保存に失敗した場合
   */
  static saveSettings(settings: GameSettings): void {
    try {
      // 設定の妥当性を検証
      if (!this.isValidSettings(settings)) {
        throw new StorageError('無効な設定データです');
      }
      
      const json = JSON.stringify(settings);
      localStorage.setItem(this.STORAGE_KEY, json);
    } catch (error) {
      logError(error, 'SettingsManager.saveSettings');
      
      if (error instanceof StorageError) {
        throw error;
      }
      
      throw new StorageError('設定の保存に失敗しました', error);
    }
  }

  /**
   * 設定をローカルストレージから読み込み
   * 保存された設定がない場合はデフォルト設定を返す
   * @returns 読み込んだ設定またはデフォルト設定
   */
  static loadSettings(): GameSettings {
    try {
      const json = localStorage.getItem(this.STORAGE_KEY);
      
      if (json === null) {
        // 保存された設定がない場合はデフォルト設定を返す
        return this.getDefaultSettings();
      }

      const settings = JSON.parse(json) as GameSettings;
      
      // 設定の妥当性チェック
      if (!this.isValidSettings(settings)) {
        logError(
          new StorageError('無効な設定が保存されていました'),
          'SettingsManager.loadSettings'
        );
        return this.getDefaultSettings();
      }

      return settings;
    } catch (error) {
      logError(error, 'SettingsManager.loadSettings');
      // エラー時はデフォルト設定を返す（アプリケーションを継続可能にする）
      return this.getDefaultSettings();
    }
  }

  /**
   * 設定の妥当性をチェック
   * @param settings チェックする設定
   * @returns 妥当な設定の場合true
   */
  private static isValidSettings(settings: unknown): settings is GameSettings {
    if (typeof settings !== 'object' || settings === null) {
      return false;
    }

    const s = settings as Record<string, unknown>;

    return (
      typeof s.redDora === 'boolean' &&
      typeof s.kuitan === 'boolean' &&
      typeof s.atozuke === 'boolean'
    );
  }

  /**
   * 保存された設定をクリア
   */
  static clearSettings(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('設定のクリアに失敗しました:', error);
    }
  }
}
