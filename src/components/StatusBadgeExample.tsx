import React from 'react';
import { StatusBadge } from './StatusBadge';

/**
 * StatusBadgeコンポーネントの使用例
 * 
 * このファイルは実装例を示すためのもので、実際のアプリケーションには含まれません。
 */
export const StatusBadgeExample: React.FC = () => {
  return (
    <div className="p-8 space-y-8 bg-gray-50">
      <div>
        <h2 className="text-xl font-bold mb-4">StatusBadge 使用例</h2>
      </div>

      {/* 単一の状態 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">単一の状態</h3>
        
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <span className="w-32 text-sm text-gray-600">立直:</span>
            <StatusBadge status={['riichi']} />
          </div>
          
          <div className="flex items-center gap-4">
            <span className="w-32 text-sm text-gray-600">門前:</span>
            <StatusBadge status={['menzen']} />
          </div>
          
          <div className="flex items-center gap-4">
            <span className="w-32 text-sm text-gray-600">鳴きあり:</span>
            <StatusBadge status={['open']} />
          </div>
          
          <div className="flex items-center gap-4">
            <span className="w-32 text-sm text-gray-600">一発:</span>
            <StatusBadge status={['ippatsu']} />
          </div>
          
          <div className="flex items-center gap-4">
            <span className="w-32 text-sm text-gray-600">ダブル立直:</span>
            <StatusBadge status={['doubleRiichi']} />
          </div>
        </div>
      </div>

      {/* 複数の状態 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">複数の状態（要件 13.4）</h3>
        
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <span className="w-32 text-sm text-gray-600">立直 + 門前:</span>
            <StatusBadge status={['riichi', 'menzen']} />
          </div>
          
          <div className="flex items-center gap-4">
            <span className="w-32 text-sm text-gray-600">立直 + 一発:</span>
            <StatusBadge status={['riichi', 'ippatsu']} />
          </div>
          
          <div className="flex items-center gap-4">
            <span className="w-32 text-sm text-gray-600">すべての状態:</span>
            <StatusBadge status={['riichi', 'menzen', 'open', 'ippatsu', 'doubleRiichi']} />
          </div>
        </div>
      </div>

      {/* サイズバリエーション */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">サイズバリエーション</h3>
        
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <span className="w-32 text-sm text-gray-600">Small:</span>
            <StatusBadge status={['riichi', 'menzen']} size="small" />
          </div>
          
          <div className="flex items-center gap-4">
            <span className="w-32 text-sm text-gray-600">Medium:</span>
            <StatusBadge status={['riichi', 'menzen']} size="medium" />
          </div>
          
          <div className="flex items-center gap-4">
            <span className="w-32 text-sm text-gray-600">Large:</span>
            <StatusBadge status={['riichi', 'menzen']} size="large" />
          </div>
        </div>
      </div>

      {/* 実際の使用例 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">実際の使用例</h3>
        
        <div className="p-4 bg-white rounded-lg shadow">
          <div className="mb-2">
            <StatusBadge status={['riichi', 'menzen', 'ippatsu']} />
          </div>
          <p className="text-sm text-gray-600">
            この手牌は立直・門前・一発の状態です
          </p>
        </div>
        
        <div className="p-4 bg-white rounded-lg shadow">
          <div className="mb-2">
            <StatusBadge status={['open']} />
          </div>
          <p className="text-sm text-gray-600">
            この手牌は鳴きありの状態です
          </p>
        </div>
      </div>
    </div>
  );
};
