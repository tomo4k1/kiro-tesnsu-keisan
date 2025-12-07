import type { TutorialSettings } from '../types';
import { StorageError, logError } from '../types/errors';

/**
 * チュートリアル設定を管理するクラス
 * ローカルストレージへの保存・読み込み機能を提供
 */
export class TutorialManager {
  private static readonly STORAGE_KEY = 'mahjong-quiz-tutorial-settings';
  private static readonly CURRENT_VERSION = '1.0.0';

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
  static getDefaultSettings(): TutorialSettings {
    return { ...this.DEFAULT_TUTORIAL_SETTINGS };
  }

  /**
   * チュートリアル設定をローカルストレージに保存
   * @param settings 保存する設定
   * @throws StorageError 保存に失敗した場合
   */
  static saveSettings(settings: TutorialSettings): void {
    try {
      // 設定の妥当性を検証
      if (!this.isValidSettings(settings)) {
        throw new StorageError('無効なチュートリアル設定データです');
      }
      
      const json = JSON.stringify(settings);
      localStorage.setItem(this.STORAGE_KEY, json);
    } catch (error) {
      logError(error, 'TutorialManager.saveSettings');
      
      if (error instanceof StorageError) {
        throw error;
      }
      
      throw new StorageError('チュートリアル設定の保存に失敗しました', error);
    }
  }

  /**
   * チュートリアル設定をローカルストレージから読み込み
   * 保存された設定がない場合はデフォルト設定を返す
   * @returns 読み込んだ設定またはデフォルト設定
   */
  static loadSettings(): TutorialSettings {
    try {
      const json = localStorage.getItem(this.STORAGE_KEY);
      
      if (json === null) {
        // 保存された設定がない場合はデフォルト設定を返す
        return this.getDefaultSettings();
      }

      const settings = JSON.parse(json) as TutorialSettings;
      
      // 設定の妥当性チェック
      if (!this.isValidSettings(settings)) {
        logError(
          new StorageError('無効なチュートリアル設定が保存されていました'),
          'TutorialManager.loadSettings'
        );
        return this.getDefaultSettings();
      }

      return settings;
    } catch (error) {
      logError(error, 'TutorialManager.loadSettings');
      // エラー時はデフォルト設定を返す（アプリケーションを継続可能にする）
      return this.getDefaultSettings();
    }
  }

  /**
   * チュートリアル設定の妥当性をチェック
   * @param settings チェックする設定
   * @returns 妥当な設定の場合true
   */
  private static isValidSettings(settings: unknown): settings is TutorialSettings {
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
   * チュートリアルを完了としてマーク
   */
  static markAsCompleted(): void {
    const settings = this.loadSettings();
    this.saveSettings({
      ...settings,
      completed: true,
      lastShownVersion: this.CURRENT_VERSION,
    });
  }

  /**
   * チュートリアルをスキップとしてマーク
   */
  static markAsSkipped(): void {
    const settings = this.loadSettings();
    this.saveSettings({
      ...settings,
      skipped: true,
      lastShownVersion: this.CURRENT_VERSION,
    });
  }

  /**
   * チュートリアルを表示すべきかチェック
   * @returns チュートリアルを表示すべき場合true
   */
  static shouldShowTutorial(): boolean {
    const settings = this.loadSettings();
    
    // 完了済みまたはスキップ済みの場合は表示しない
    if (settings.completed || settings.skipped) {
      return false;
    }
    
    // バージョンが変わった場合は再度表示
    if (settings.lastShownVersion !== this.CURRENT_VERSION) {
      return true;
    }
    
    return true;
  }

  /**
   * チュートリアル設定をリセット
   */
  static resetSettings(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('チュートリアル設定のリセットに失敗しました:', error);
    }
  }

  /**
   * 現在のバージョンを取得
   */
  static getCurrentVersion(): string {
    return this.CURRENT_VERSION;
  }
}
