import React, { useState } from 'react';
import { HelpModal } from './HelpModal';

/**
 * HelpModalの使用例
 * 
 * このコンポーネントは、HelpModalの基本的な使い方を示します。
 */
export const HelpModalExample: React.FC = () => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            ヘルプモーダルの使用例
          </h1>

          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                基本的な使い方
              </h2>
              <p className="text-gray-700 mb-4">
                ヘルプボタンをクリックすると、アプリケーションの使い方を説明するモーダルが表示されます。
              </p>
              <button
                onClick={() => setIsHelpOpen(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
              >
                <span aria-hidden="true">❓</span>
                <span>ヘルプを開く</span>
              </button>
            </section>

            <section className="pt-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                機能
              </h2>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>6つのヘルプセクション（概要、点数計算、キーボード操作、統計情報、設定、その他の機能）</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>サイドバーでセクションを切り替え可能</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Escapeキーでモーダルを閉じる</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>背景クリックでモーダルを閉じる</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>スクロール可能なコンテンツエリア</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>アクセシビリティ対応（ARIA属性、キーボードナビゲーション）</span>
                </li>
              </ul>
            </section>

            <section className="pt-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                実装例
              </h2>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <code>{`import { useState } from 'react';
import { HelpModal } from './HelpModal';

function App() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsHelpOpen(true)}>
        ヘルプ
      </button>
      
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </>
  );
}`}</code>
              </pre>
            </section>

            <section className="pt-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                ヘルプセクション
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <span aria-hidden="true">📖</span>
                    <span>概要</span>
                  </h3>
                  <p className="text-sm text-gray-600">
                    アプリケーションの基本的な使い方を説明します
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <span aria-hidden="true">🎲</span>
                    <span>点数計算</span>
                  </h3>
                  <p className="text-sm text-gray-600">
                    符・飜数・点数の計算方法を説明します
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <span aria-hidden="true">⌨️</span>
                    <span>キーボード操作</span>
                  </h3>
                  <p className="text-sm text-gray-600">
                    利用可能なキーボードショートカットを説明します
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <span aria-hidden="true">📊</span>
                    <span>統計情報</span>
                  </h3>
                  <p className="text-sm text-gray-600">
                    学習統計の見方を説明します
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <span aria-hidden="true">⚙️</span>
                    <span>設定</span>
                  </h3>
                  <p className="text-sm text-gray-600">
                    各種設定項目について説明します
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <span aria-hidden="true">✨</span>
                    <span>その他の機能</span>
                  </h3>
                  <p className="text-sm text-gray-600">
                    解説、ツールチップなどの機能を説明します
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* ヘルプモーダル */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
};
