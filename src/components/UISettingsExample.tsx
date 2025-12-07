import React from 'react';
import { useUISettings } from '../hooks/useUISettings';

/**
 * UI設定の使用例を示すコンポーネント
 * 実際のアプリケーションではSettingsPanelなどで使用される
 */
export const UISettingsExample: React.FC = () => {
  const {
    settings,
    updateAnimationSettings,
    updateSoundSettings,
    updateDisplaySettings,
    resetSettings,
    isAnimationEnabled,
    getAnimationSpeedMultiplier,
  } = useUISettings();

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold mb-4">UI設定の例</h2>

      {/* アニメーション設定 */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-3">アニメーション設定</h3>
        
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.animation.enabled}
              onChange={(e) =>
                updateAnimationSettings({
                  ...settings.animation,
                  enabled: e.target.checked,
                })
              }
              className="mr-2"
            />
            アニメーションを有効にする
          </label>

          <div>
            <label className="block mb-1">速度:</label>
            <select
              value={settings.animation.speed}
              onChange={(e) =>
                updateAnimationSettings({
                  ...settings.animation,
                  speed: e.target.value as 'slow' | 'normal' | 'fast' | 'none',
                })
              }
              className="border rounded px-2 py-1"
            >
              <option value="slow">遅い</option>
              <option value="normal">標準</option>
              <option value="fast">速い</option>
              <option value="none">なし</option>
            </select>
          </div>

          <div className="text-sm text-gray-600">
            <p>Reduced Motion: {settings.animation.reducedMotion ? '有効' : '無効'}</p>
            <p>アニメーション有効: {isAnimationEnabled() ? 'はい' : 'いいえ'}</p>
            <p>速度乗数: {getAnimationSpeedMultiplier()}</p>
          </div>
        </div>
      </div>

      {/* 音声設定 */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-3">音声設定</h3>
        
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.sound.enabled}
              onChange={(e) =>
                updateSoundSettings({
                  ...settings.sound,
                  enabled: e.target.checked,
                })
              }
              className="mr-2"
            />
            音声を有効にする
          </label>

          <div>
            <label className="block mb-1">音量: {Math.round(settings.sound.volume * 100)}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.sound.volume * 100}
              onChange={(e) =>
                updateSoundSettings({
                  ...settings.sound,
                  volume: parseInt(e.target.value) / 100,
                })
              }
              className="w-full"
            />
          </div>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.sound.correctSound}
              onChange={(e) =>
                updateSoundSettings({
                  ...settings.sound,
                  correctSound: e.target.checked,
                })
              }
              className="mr-2"
            />
            正解時の音声
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.sound.incorrectSound}
              onChange={(e) =>
                updateSoundSettings({
                  ...settings.sound,
                  incorrectSound: e.target.checked,
                })
              }
              className="mr-2"
            />
            不正解時の音声
          </label>
        </div>
      </div>

      {/* 表示設定 */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-3">表示設定</h3>
        
        <div className="space-y-2">
          <div>
            <label className="block mb-1">フォントサイズ:</label>
            <select
              value={settings.display.fontSize}
              onChange={(e) =>
                updateDisplaySettings({
                  ...settings.display,
                  fontSize: e.target.value as 'small' | 'medium' | 'large',
                })
              }
              className="border rounded px-2 py-1"
            >
              <option value="small">小</option>
              <option value="medium">中</option>
              <option value="large">大</option>
            </select>
          </div>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.display.highContrast}
              onChange={(e) =>
                updateDisplaySettings({
                  ...settings.display,
                  highContrast: e.target.checked,
                })
              }
              className="mr-2"
            />
            ハイコントラストモード
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.display.showTooltips}
              onChange={(e) =>
                updateDisplaySettings({
                  ...settings.display,
                  showTooltips: e.target.checked,
                })
              }
              className="mr-2"
            />
            ツールチップを表示
          </label>
        </div>
      </div>

      {/* リセットボタン */}
      <div className="flex justify-center">
        <button
          onClick={resetSettings}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          設定をリセット
        </button>
      </div>
    </div>
  );
};
