import { useState, useEffect, useCallback } from 'react';
import type { TutorialStep, TutorialSettings } from '../types';
import { UISettingsManager } from '../services/UISettingsManager';

/**
 * チュートリアル管理用カスタムフック
 */
export function useTutorial(steps: TutorialStep[]) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [settings, setSettings] = useState<TutorialSettings>(() => {
    const uiSettings = UISettingsManager.loadSettings();
    return uiSettings.tutorial;
  });

  // 初回マウント時にチュートリアルを表示すべきかチェック
  useEffect(() => {
    const shouldShow = !settings.completed && !settings.skipped;
    setIsVisible(shouldShow);
  }, [settings.completed, settings.skipped]);

  // 次のステップへ
  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, steps.length]);

  // 前のステップへ
  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  // チュートリアルをスキップ
  const handleSkip = useCallback(() => {
    const newSettings: TutorialSettings = {
      ...settings,
      skipped: true,
      lastShownVersion: '1.0.0',
    };
    
    UISettingsManager.updateTutorialSettings(newSettings);
    setSettings(newSettings);
    setIsVisible(false);
    setCurrentStep(0);
  }, [settings]);

  // チュートリアルを完了
  const handleComplete = useCallback(() => {
    const newSettings: TutorialSettings = {
      ...settings,
      completed: true,
      lastShownVersion: '1.0.0',
    };
    
    UISettingsManager.updateTutorialSettings(newSettings);
    setSettings(newSettings);
    setIsVisible(false);
    setCurrentStep(0);
  }, [settings]);

  // チュートリアルを再表示
  const showTutorial = useCallback(() => {
    setCurrentStep(0);
    setIsVisible(true);
  }, []);

  // チュートリアルをリセット
  const resetTutorial = useCallback(() => {
    const newSettings: TutorialSettings = {
      completed: false,
      skipped: false,
      lastShownVersion: '',
    };
    
    UISettingsManager.updateTutorialSettings(newSettings);
    setSettings(newSettings);
    setCurrentStep(0);
    setIsVisible(true);
  }, []);

  return {
    currentStep,
    isVisible,
    settings,
    handleNext,
    handlePrevious,
    handleSkip,
    handleComplete,
    showTutorial,
    resetTutorial,
  };
}
