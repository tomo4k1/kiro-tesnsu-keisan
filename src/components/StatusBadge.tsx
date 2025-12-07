import React from 'react';

/**
 * 手牌の状態を表す型
 * 要件 13.1, 13.2, 13.3 に対応
 */
export type HandStatus = 
  | 'riichi'        // 立直
  | 'menzen'        // 門前
  | 'open'          // 鳴きあり
  | 'ippatsu'       // 一発
  | 'doubleRiichi'; // ダブル立直

/**
 * StatusBadgeコンポーネントのProps
 */
export interface StatusBadgeProps {
  /** 表示する状態のリスト */
  status: HandStatus[];
  /** バッジのサイズ */
  size?: 'small' | 'medium' | 'large';
}

/**
 * 状態バッジの設定
 * 要件 13.5: 色とアイコンで状態を直感的に識別
 */
interface StatusBadgeConfig {
  icon: string;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

/**
 * 各状態のバッジ設定を取得
 */
const getStatusConfig = (status: HandStatus): StatusBadgeConfig => {
  const configs: Record<HandStatus, StatusBadgeConfig> = {
    riichi: {
      icon: '🎯',
      label: '立直',
      color: 'text-red-700',
      bgColor: 'bg-red-100',
      borderColor: 'border-red-400',
    },
    menzen: {
      icon: '🔒',
      label: '門前',
      color: 'text-blue-700',
      bgColor: 'bg-blue-100',
      borderColor: 'border-blue-400',
    },
    open: {
      icon: '🔓',
      label: '鳴き',
      color: 'text-orange-700',
      bgColor: 'bg-orange-100',
      borderColor: 'border-orange-400',
    },
    ippatsu: {
      icon: '⚡',
      label: '一発',
      color: 'text-yellow-700',
      bgColor: 'bg-yellow-100',
      borderColor: 'border-yellow-400',
    },
    doubleRiichi: {
      icon: '🎯🎯',
      label: 'ダブル立直',
      color: 'text-purple-700',
      bgColor: 'bg-purple-100',
      borderColor: 'border-purple-400',
    },
  };

  return configs[status];
};

/**
 * サイズに応じたクラスを取得
 */
const getSizeClasses = (size: 'small' | 'medium' | 'large'): string => {
  const sizeClasses = {
    small: 'px-2 py-0.5 text-xs gap-1',
    medium: 'px-3 py-1 text-sm gap-1.5',
    large: 'px-4 py-1.5 text-base gap-2',
  };

  return sizeClasses[size];
};

/**
 * 状態バッジコンポーネント
 * 
 * 手牌の状態（立直、門前、鳴きあり等）を視覚的に表示します。
 * 
 * 要件:
 * - 13.1: 立直状態を目立つ位置に表示
 * - 13.2: 鳴きブロックを視覚的に区別
 * - 13.3: 門前状態を示すバッジを表示
 * - 13.4: 複数の状態を明確に表示
 * - 13.5: 色とアイコンで状態を直感的に識別
 * 
 * @example
 * ```tsx
 * <StatusBadge status={['riichi', 'menzen']} size="medium" />
 * ```
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  size = 'medium' 
}) => {
  // 状態が空の場合は何も表示しない
  if (status.length === 0) {
    return null;
  }

  const sizeClasses = getSizeClasses(size);

  return (
    <div 
      className="flex flex-wrap gap-2"
      role="group"
      aria-label="手牌の状態"
    >
      {/* 要件 13.4: 複数の状態を明確に表示 */}
      {status.map((s) => {
        const config = getStatusConfig(s);
        
        return (
          <div
            key={s}
            className={`
              inline-flex items-center justify-center
              ${sizeClasses}
              ${config.bgColor}
              ${config.color}
              ${config.borderColor}
              border-2 rounded-full
              font-semibold
              shadow-sm
              transition-all
              hover:shadow-md
            `}
            role="status"
            aria-label={config.label}
          >
            {/* 要件 13.5: アイコンで状態を識別 */}
            <span className="leading-none" aria-hidden="true">
              {config.icon}
            </span>
            {/* 要件 13.5: テキストで状態を識別 */}
            <span className="leading-none">
              {config.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};
