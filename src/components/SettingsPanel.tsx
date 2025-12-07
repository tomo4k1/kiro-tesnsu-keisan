import React from 'react';
import type { GameSettings, AnimationSettings, DisplaySettings } from '../types';
import { useUISettings } from '../hooks/useUISettings';
import { Tooltip } from './Tooltip';

/**
 * SettingsPanelコンポーネントのProps
 */
interface SettingsPanelProps {
  settings: GameSettings;
  onSettingsChange: (settings: GameSettings) => void;
}

/**
 * トグルスイッチコンポーネント
 */
const ToggleSwitch: React.FC<{
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}> = ({ id, label, description, checked, onChange }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex-1">
        <label htmlFor={id} className="block font-semibold text-gray-800 cursor-pointer">
          {label}
        </label>
        <p className="text-sm text-gray-600 mt-1">
          {description}
        </p>
      </div>
      <div className="ml-4">
        <button
          id={id}
          role="switch"
          aria-checked={checked}
          onClick={() => onChange(!checked)}
          className={`
            relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            ${checked ? 'bg-blue-600' : 'bg-gray-300'}
          `}
        >
          <span
            className={`
              inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out
              ${checked ? 'translate-x-7' : 'translate-x-1'}
            `}
          />
        </button>
      </div>
    </div>
  );
};

/**
 * ルール設定とUI設定を行うコンポーネント
 * 要件 7.1, 7.2, 7.3, 7.5, 8.1, 8.2, 8.3, 8.4 を満たす
 */
export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onSettingsChange,
}) => {
  // UI設定を管理（要件 8.1, 8.2, 8.3, 8.4）
  const {
    settings: uiSettings,
    updateAnimationSettings,
    updateSoundSettings,
    updateDisplaySettings,
  } = useUISettings();

  const handleToggle = (key: keyof GameSettings) => {
    const newSettings = {
      ...settings,
      [key]: !settings[key],
    };
    onSettingsChange(newSettings);
  };

  /**
   * アニメーション速度を変更（要件 8.1, 8.4）
   */
  const handleAnimationSpeedChange = (speed: AnimationSettings['speed']) => {
    updateAnimationSettings({
      ...uiSettings.animation,
      speed,
    });
  };

  /**
   * 音声設定を変更（要件 8.2, 8.4）
   */
  const handleSoundToggle = () => {
    updateSoundSettings({
      ...uiSettings.sound,
      enabled: !uiSettings.sound.enabled,
    });
  };

  /**
   * 音量を変更（要件 8.2, 8.4）
   */
  const handleVolumeChange = (volume: number) => {
    updateSoundSettings({
      ...uiSettings.sound,
      volume,
    });
  };

  /**
   * フォントサイズを変更（要件 8.3, 8.4）
   */
  const handleFontSizeChange = (fontSize: DisplaySettings['fontSize']) => {
    updateDisplaySettings({
      ...uiSettings.display,
      fontSize,
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-md border border-gray-200" role="region" aria-label="設定パネル">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span className="text-2xl" aria-hidden="true">⚙️</span>
        <span>設定</span>
      </h2>

      {/* ルール設定セクション */}
      <section className="mb-6" aria-labelledby="rule-settings-heading">
        <h3 id="rule-settings-heading" className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span aria-hidden="true">🎲</span>
          <span>ルール設定</span>
        </h3>
        <div className="space-y-3" role="group" aria-labelledby="rule-settings-heading">
          {/* 赤ドラ設定 */}
          <Tooltip tooltip="赤5の牌をドラとして扱い、1飜追加されます。一般的な麻雀ルールで広く採用されています。">
            <ToggleSwitch
              id="redDora"
              label="赤ドラ"
              description="赤5の牌をドラとして扱います"
              checked={settings.redDora}
              onChange={() => handleToggle('redDora')}
            />
          </Tooltip>

          {/* 喰いタン設定 */}
          <Tooltip tooltip="鳴いた状態（ポン・チー）でもタンヤオ（断么九）を成立させることができます。現代麻雀では一般的なルールです。">
            <ToggleSwitch
              id="kuitan"
              label="喰いタン"
              description="鳴いた状態でタンヤオを成立させることができます"
              checked={settings.kuitan}
              onChange={() => handleToggle('kuitan')}
            />
          </Tooltip>

          {/* 後付け設定 */}
          <Tooltip tooltip="鳴いた時点では役が確定していなくても、最終的に役が成立すればアガリを認めるルールです。">
            <ToggleSwitch
              id="atozuke"
              label="後付け"
              description="鳴いた後に役を確定させることを認めます"
              checked={settings.atozuke}
              onChange={() => handleToggle('atozuke')}
            />
          </Tooltip>
        </div>
      </section>

      {/* アニメーション設定セクション（要件 8.1） */}
      <section className="mb-6 pt-6 border-t border-gray-200" aria-labelledby="animation-settings-heading">
        <h3 id="animation-settings-heading" className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span aria-hidden="true">✨</span>
          <span>アニメーション設定</span>
        </h3>
        <div className="p-4 bg-gray-50 rounded-lg">
          <label id="animation-speed-label" className="block font-semibold text-gray-800 mb-2">
            アニメーション速度
          </label>
          <p className="text-sm text-gray-600 mb-3">
            画面の動きの速さを調整します
          </p>
          <div className="grid grid-cols-4 gap-2" role="radiogroup" aria-labelledby="animation-speed-label">
            {(['none', 'fast', 'normal', 'slow'] as const).map((speed) => {
              const tooltips = {
                none: 'アニメーションを完全に無効にします。動きが苦手な方におすすめです。',
                fast: 'アニメーションを高速で再生します。素早く学習したい方向けです。',
                normal: '標準的な速度でアニメーションを再生します。',
                slow: 'アニメーションをゆっくり再生します。変化をじっくり確認したい方向けです。',
              };
              
              return (
                <Tooltip key={speed} tooltip={tooltips[speed]}>
                  <button
                    onClick={() => handleAnimationSpeedChange(speed)}
                    className={`
                      py-2 px-3 rounded-lg font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                      ${
                        uiSettings.animation.speed === speed
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                      }
                    `}
                    role="radio"
                    aria-checked={uiSettings.animation.speed === speed}
                    aria-label={`アニメーション速度: ${speed === 'none' ? 'なし' : speed === 'fast' ? '速い' : speed === 'normal' ? '標準' : '遅い'}`}
                  >
                    {speed === 'none' && 'なし'}
                    {speed === 'fast' && '速い'}
                    {speed === 'normal' && '標準'}
                    {speed === 'slow' && '遅い'}
                  </button>
                </Tooltip>
              );
            })}
          </div>
          {uiSettings.animation.reducedMotion && (
            <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800" role="status" aria-live="polite">
              <span className="font-semibold" aria-hidden="true">ℹ️ お知らせ:</span> システムの「視覚効果を減らす」設定が有効です
            </div>
          )}
        </div>
      </section>

      {/* 音声設定セクション（要件 8.2） */}
      <section className="mb-6 pt-6 border-t border-gray-200" aria-labelledby="sound-settings-heading">
        <h3 id="sound-settings-heading" className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span aria-hidden="true">🔊</span>
          <span>音声設定</span>
        </h3>
        <div className="space-y-4">
          {/* 音声のオン・オフ */}
          <Tooltip tooltip="回答の正誤に応じて音声フィードバックを再生します。学習効果を高めるのに役立ちます。">
            <ToggleSwitch
              id="soundEnabled"
              label="音声フィードバック"
              description="正解・不正解時に音を再生します"
              checked={uiSettings.sound.enabled}
              onChange={handleSoundToggle}
            />
          </Tooltip>

          {/* 音量調整 */}
          {uiSettings.sound.enabled && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <label htmlFor="volume" className="block font-semibold text-gray-800 mb-2">
                音量: {Math.round(uiSettings.sound.volume * 100)}%
              </label>
              <input
                id="volume"
                type="range"
                min="0"
                max="100"
                value={uiSettings.sound.volume * 100}
                onChange={(e) => handleVolumeChange(Number(e.target.value) / 100)}
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="音量調整"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(uiSettings.sound.volume * 100)}
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1" aria-hidden="true">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 表示設定セクション（要件 8.3） */}
      <section className="mb-6 pt-6 border-t border-gray-200" aria-labelledby="display-settings-heading">
        <h3 id="display-settings-heading" className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span aria-hidden="true">📱</span>
          <span>表示設定</span>
        </h3>
        <div className="p-4 bg-gray-50 rounded-lg">
          <label id="font-size-label" className="block font-semibold text-gray-800 mb-2">
            フォントサイズ
          </label>
          <p className="text-sm text-gray-600 mb-3">
            文字の大きさを調整します
          </p>
          <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-labelledby="font-size-label">
            {(['small', 'medium', 'large'] as const).map((size) => {
              const tooltips = {
                small: '文字を小さく表示します。画面に多くの情報を表示したい方向けです。',
                medium: '標準的なサイズで文字を表示します。',
                large: '文字を大きく表示します。読みやすさを重視する方におすすめです。',
              };
              
              return (
                <Tooltip key={size} tooltip={tooltips[size]}>
                  <button
                    onClick={() => handleFontSizeChange(size)}
                    className={`
                      py-2 px-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                      ${
                        uiSettings.display.fontSize === size
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                      }
                      ${size === 'small' && 'text-sm'}
                      ${size === 'medium' && 'text-base'}
                      ${size === 'large' && 'text-lg'}
                    `}
                    role="radio"
                    aria-checked={uiSettings.display.fontSize === size}
                    aria-label={`フォントサイズ: ${size === 'small' ? '小' : size === 'medium' ? '中' : '大'}`}
                  >
                    {size === 'small' && '小'}
                    {size === 'medium' && '中'}
                    {size === 'large' && '大'}
                  </button>
                </Tooltip>
              );
            })}
          </div>
        </div>
      </section>

      {/* 設定の説明 */}
      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">💡 ヒント:</span> すべての設定は自動的に保存され、即座に反映されます。
        </p>
      </div>

      {/* 現在の設定サマリー */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">現在のルール設定</h3>
        <div className="flex flex-wrap gap-2">
          {settings.redDora && (
            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
              赤ドラあり
            </span>
          )}
          {settings.kuitan && (
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              喰いタンあり
            </span>
          )}
          {settings.atozuke && (
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              後付けあり
            </span>
          )}
          {!settings.redDora && !settings.kuitan && !settings.atozuke && (
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
              標準ルール
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
