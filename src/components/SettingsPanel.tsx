import React from 'react';
import type { GameSettings } from '../types';

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
 * ルール設定を行うコンポーネント
 * 要件 7.1, 7.2, 7.3, 7.5 を満たす
 */
export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onSettingsChange,
}) => {
  const handleToggle = (key: keyof GameSettings) => {
    const newSettings = {
      ...settings,
      [key]: !settings[key],
    };
    onSettingsChange(newSettings);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span className="text-2xl">⚙️</span>
        <span>ルール設定</span>
      </h2>

      <div className="space-y-3">
        {/* 赤ドラ設定 */}
        <ToggleSwitch
          id="redDora"
          label="赤ドラ"
          description="赤5の牌をドラとして扱います"
          checked={settings.redDora}
          onChange={() => handleToggle('redDora')}
        />

        {/* 喰いタン設定 */}
        <ToggleSwitch
          id="kuitan"
          label="喰いタン"
          description="鳴いた状態でタンヤオを成立させることができます"
          checked={settings.kuitan}
          onChange={() => handleToggle('kuitan')}
        />

        {/* 後付け設定 */}
        <ToggleSwitch
          id="atozuke"
          label="後付け"
          description="鳴いた後に役を確定させることを認めます"
          checked={settings.atozuke}
          onChange={() => handleToggle('atozuke')}
        />
      </div>

      {/* 設定の説明 */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">💡 ヒント:</span> 設定を変更すると、次の問題から新しいルールが適用されます。設定は自動的に保存されます。
        </p>
      </div>

      {/* 現在の設定サマリー */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">現在の設定</h3>
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
