import { useState, useEffect, useCallback } from 'react';
import type { UISettings, AnimationSettings, SoundSettings, DisplaySettings } from '../types';
import { UISettingsManager } from '../services/UISettingsManager';

/**
 * UI設定を管理するカスタムフック
 * ローカルストレージへの自動保存とprefers-reduced-motionの検出を提供
 */
export function useUISettings() {
  const [settings, setSettings] = useState<UISettings>(() => {
    return UISettingsManager.loadSettings();
  });

  // prefers-reduced-motionを検出してアニメーション設定に反映
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    // 初期値を設定
    setSettings(prev => ({
      ...prev,
      animation: {
        ...prev.animation,
        reducedMotion: mediaQuery.matches,
      },
    }));
    
    // メディアクエリの変更を監視
    const handleChange = (e: MediaQueryListEvent) => {
      setSettings(prev => ({
        ...prev,
        animation: {
          ...prev.animation,
          reducedMotion: e.matches,
        },
      }));
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  /**
   * UI設定を更新してローカルストレージに保存
   */
  const updateSettings = useCallback((newSettings: UISettings) => {
    setSettings(newSettings);
    UISettingsManager.saveSettings(newSettings);
  }, []);

  /**
   * アニメーション設定のみを更新
   */
  const updateAnimationSettings = useCallback((animation: AnimationSettings) => {
    setSettings(prev => {
      const newSettings = {
        ...prev,
        animation,
      };
      UISettingsManager.saveSettings(newSettings);
      return newSettings;
    });
  }, []);

  /**
   * 音声設定のみを更新
   */
  const updateSoundSettings = useCallback((sound: SoundSettings) => {
    setSettings(prev => {
      const newSettings = {
        ...prev,
        sound,
      };
      UISettingsManager.saveSettings(newSettings);
      return newSettings;
    });
  }, []);

  /**
   * 表示設定のみを更新
   */
  const updateDisplaySettings = useCallback((display: DisplaySettings) => {
    setSettings(prev => {
      const newSettings = {
        ...prev,
        display,
      };
      UISettingsManager.saveSettings(newSettings);
      return newSettings;
    });
  }, []);

  /**
   * 設定をデフォルトにリセット
   */
  const resetSettings = useCallback(() => {
    const defaultSettings = UISettingsManager.getDefaultSettings();
    setSettings(defaultSettings);
    UISettingsManager.saveSettings(defaultSettings);
  }, []);

  /**
   * アニメーションが有効かどうかを判定
   * reducedMotionが有効な場合やspeedが'none'の場合はfalseを返す
   */
  const isAnimationEnabled = useCallback(() => {
    return (
      settings.animation.enabled &&
      !settings.animation.reducedMotion &&
      settings.animation.speed !== 'none'
    );
  }, [settings.animation]);

  /**
   * アニメーション速度の乗数を取得
   */
  const getAnimationSpeedMultiplier = useCallback(() => {
    if (!isAnimationEnabled()) {
      return 0;
    }

    const speedMap = {
      slow: 1.5,
      normal: 1,
      fast: 0.5,
      none: 0,
    };

    return speedMap[settings.animation.speed];
  }, [settings.animation.speed, isAnimationEnabled]);

  return {
    settings,
    updateSettings,
    updateAnimationSettings,
    updateSoundSettings,
    updateDisplaySettings,
    resetSettings,
    isAnimationEnabled,
    getAnimationSpeedMultiplier,
  };
}
