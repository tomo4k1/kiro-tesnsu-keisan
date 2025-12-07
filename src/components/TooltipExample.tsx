import React from 'react';
import { Tooltip } from './Tooltip';

/**
 * ツールチップコンポーネントの使用例
 * 
 * このコンポーネントは、Tooltipコンポーネントの様々な使用方法を示します。
 */
export const TooltipExample: React.FC = () => {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold mb-6">ツールチップの使用例</h1>

      {/* 基本的な使用例 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">基本的な使用例</h2>
        <div className="flex gap-4">
          <Tooltip tooltip="これは基本的なツールチップです">
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              ホバーしてください
            </button>
          </Tooltip>
        </div>
      </section>

      {/* 位置の指定 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">位置の指定</h2>
        <div className="flex gap-4 items-center justify-center p-8">
          <Tooltip
            tooltip={{
              content: '上に表示',
              position: 'top',
              delay: 300,
              maxWidth: 200,
            }}
          >
            <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              上
            </button>
          </Tooltip>

          <Tooltip
            tooltip={{
              content: '右に表示',
              position: 'right',
              delay: 300,
              maxWidth: 200,
            }}
          >
            <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              右
            </button>
          </Tooltip>

          <Tooltip
            tooltip={{
              content: '下に表示',
              position: 'bottom',
              delay: 300,
              maxWidth: 200,
            }}
          >
            <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              下
            </button>
          </Tooltip>

          <Tooltip
            tooltip={{
              content: '左に表示',
              position: 'left',
              delay: 300,
              maxWidth: 200,
            }}
          >
            <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              左
            </button>
          </Tooltip>
        </div>
      </section>

      {/* カスタムディレイ */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">カスタムディレイ</h2>
        <div className="flex gap-4">
          <Tooltip
            tooltip={{
              content: 'すぐに表示（0ms）',
              position: 'top',
              delay: 0,
              maxWidth: 200,
            }}
          >
            <button className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
              即座
            </button>
          </Tooltip>

          <Tooltip
            tooltip={{
              content: '少し待つ（500ms）',
              position: 'top',
              delay: 500,
              maxWidth: 200,
            }}
          >
            <button className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
              500ms
            </button>
          </Tooltip>

          <Tooltip
            tooltip={{
              content: 'さらに待つ（1000ms）',
              position: 'top',
              delay: 1000,
              maxWidth: 200,
            }}
          >
            <button className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
              1000ms
            </button>
          </Tooltip>
        </div>
      </section>

      {/* 長いテキスト */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">長いテキスト</h2>
        <div className="flex gap-4">
          <Tooltip
            tooltip={{
              content:
                'これは長いツールチップテキストの例です。maxWidthプロパティで幅を制御できます。テキストは自動的に折り返されます。',
              position: 'top',
              delay: 300,
              maxWidth: 250,
            }}
          >
            <button className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
              長いテキスト
            </button>
          </Tooltip>
        </div>
      </section>

      {/* 無効化 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">無効化</h2>
        <div className="flex gap-4">
          <Tooltip tooltip="このツールチップは表示されます">
            <button className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
              有効
            </button>
          </Tooltip>

          <Tooltip tooltip="このツールチップは表示されません" disabled>
            <button className="px-4 py-2 bg-gray-300 text-gray-600 rounded cursor-not-allowed">
              無効
            </button>
          </Tooltip>
        </div>
      </section>

      {/* 実用例：アイコンボタン */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">実用例：アイコンボタン</h2>
        <div className="flex gap-4">
          <Tooltip tooltip="設定を開く">
            <button
              className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
              aria-label="設定"
            >
              ⚙️
            </button>
          </Tooltip>

          <Tooltip tooltip="ヘルプを表示">
            <button
              className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
              aria-label="ヘルプ"
            >
              ❓
            </button>
          </Tooltip>

          <Tooltip tooltip="情報を表示">
            <button
              className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
              aria-label="情報"
            >
              ℹ️
            </button>
          </Tooltip>
        </div>
      </section>

      {/* 実用例：統計情報 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">実用例：統計情報</h2>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex gap-6">
            <Tooltip
              tooltip={{
                content: '全問題に対する正解率です',
                position: 'top',
                delay: 300,
                maxWidth: 200,
              }}
            >
              <div className="text-center cursor-help">
                <div className="text-2xl font-bold text-blue-600">75%</div>
                <div className="text-sm text-gray-600">正解率</div>
              </div>
            </Tooltip>

            <Tooltip
              tooltip={{
                content: '連続して正解した問題数です',
                position: 'top',
                delay: 300,
                maxWidth: 200,
              }}
            >
              <div className="text-center cursor-help">
                <div className="text-2xl font-bold text-green-600">5</div>
                <div className="text-sm text-gray-600">連続正解</div>
              </div>
            </Tooltip>

            <Tooltip
              tooltip={{
                content: '今までに解いた問題の総数です',
                position: 'top',
                delay: 300,
                maxWidth: 200,
              }}
            >
              <div className="text-center cursor-help">
                <div className="text-2xl font-bold text-purple-600">42</div>
                <div className="text-sm text-gray-600">総問題数</div>
              </div>
            </Tooltip>
          </div>
        </div>
      </section>
    </div>
  );
};
