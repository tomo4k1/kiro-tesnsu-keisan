import React, { useState, useRef, useEffect } from 'react';

/**
 * ツールチップの設定
 */
export interface TooltipConfig {
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  delay: number;
  maxWidth: number;
}

/**
 * ツールチップコンポーネントのプロパティ
 */
export interface TooltipProps {
  children: React.ReactNode;
  tooltip: string | TooltipConfig;
  disabled?: boolean;
}

/**
 * ツールチップの位置を計算
 */
function calculateTooltipPosition(
  targetRect: DOMRect,
  position: 'top' | 'bottom' | 'left' | 'right',
  tooltipWidth: number = 200,
  tooltipHeight: number = 40
): { x: number; y: number } {
  const spacing = 8; // ターゲット要素とツールチップの間隔

  switch (position) {
    case 'top':
      return {
        x: targetRect.width / 2 - tooltipWidth / 2,
        y: -(tooltipHeight + spacing),
      };
    case 'bottom':
      return {
        x: targetRect.width / 2 - tooltipWidth / 2,
        y: targetRect.height + spacing,
      };
    case 'left':
      return {
        x: -(tooltipWidth + spacing),
        y: targetRect.height / 2 - tooltipHeight / 2,
      };
    case 'right':
      return {
        x: targetRect.width + spacing,
        y: targetRect.height / 2 - tooltipHeight / 2,
      };
    default:
      return { x: 0, y: 0 };
  }
}

/**
 * ツールチップコンポーネント
 * 
 * ホバー時に補足情報を表示するコンポーネント。
 * 位置調整とディレイ機能を持つ。
 * 
 * @example
 * ```tsx
 * <Tooltip tooltip="これは説明文です">
 *   <button>ホバーしてください</button>
 * </Tooltip>
 * ```
 * 
 * @example
 * ```tsx
 * <Tooltip tooltip={{
 *   content: "詳細な説明",
 *   position: "bottom",
 *   delay: 500,
 *   maxWidth: 300
 * }}>
 *   <span>情報</span>
 * </Tooltip>
 * ```
 */
export const Tooltip: React.FC<TooltipProps> = ({
  children,
  tooltip,
  disabled = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const targetRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ツールチップの設定を取得（文字列の場合はデフォルト設定を使用）
  const config: TooltipConfig = typeof tooltip === 'string'
    ? { content: tooltip, position: 'top', delay: 300, maxWidth: 200 }
    : tooltip;

  const handleMouseEnter = () => {
    if (disabled) return;
    
    // 既存のタイムアウトをクリア
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // ディレイ後に表示
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, config.delay);
  };

  const handleMouseLeave = () => {
    // タイムアウトをクリア
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    setIsVisible(false);
  };

  // ツールチップの位置を計算
  useEffect(() => {
    if (isVisible && targetRef.current) {
      const rect = targetRef.current.getBoundingClientRect();
      const tooltipPosition = calculateTooltipPosition(rect, config.position);
      setPosition(tooltipPosition);
    }
  }, [isVisible, config.position]);

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={targetRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      className="relative inline-block"
    >
      {children}
      {isVisible && (
        <div
          role="tooltip"
          className="absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg pointer-events-none whitespace-normal"
          style={{
            left: position.x,
            top: position.y,
            maxWidth: config.maxWidth,
          }}
        >
          {config.content}
        </div>
      )}
    </div>
  );
};
