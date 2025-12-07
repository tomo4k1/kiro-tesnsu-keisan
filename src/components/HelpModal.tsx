import React, { useState } from 'react';

/**
 * ヘルプセクションの型定義
 */
interface HelpSection {
  id: string;
  title: string;
  icon: string;
  content: React.ReactNode;
}

/**
 * ヘルプモーダルコンポーネントのプロパティ
 */
export interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * ヘルプモーダルコンポーネント
 * 
 * 各機能の説明を表示するモーダル。
 * 要件 10.2 を満たす。
 * 
 * @example
 * ```tsx
 * const [isHelpOpen, setIsHelpOpen] = useState(false);
 * 
 * <button onClick={() => setIsHelpOpen(true)}>ヘルプ</button>
 * <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
 * ```
 */
export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<string>('overview');

  // ヘルプセクションの定義
  const helpSections: HelpSection[] = [
    {
      id: 'overview',
      title: '概要',
      icon: '📖',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            このアプリケーションは、麻雀の点数計算を学習するためのクイズアプリです。
            手牌と状況が提示され、符・飜数・点数を回答することで、点数計算のスキルを向上させることができます。
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">基本的な使い方</h4>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>表示された手牌と状況を確認します</li>
              <li>符・飜数・点数を選択します</li>
              <li>「回答する」ボタンをクリックします</li>
              <li>結果を確認し、解説を読んで学習します</li>
              <li>「次の問題」ボタンで次に進みます</li>
            </ol>
          </div>
        </div>
      ),
    },
    {
      id: 'scoring',
      title: '点数計算',
      icon: '🎲',
      content: (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800">符の計算</h4>
          <p className="text-gray-700 leading-relaxed">
            符は手牌の構成によって決まります。基本符20符に、面子や待ちの形によって加算されます。
          </p>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-700">基本符</span>
              <span className="font-mono text-gray-900">20符</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">門前ロン</span>
              <span className="font-mono text-gray-900">+10符</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">ツモ</span>
              <span className="font-mono text-gray-900">+2符</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">明刻（中張牌）</span>
              <span className="font-mono text-gray-900">+2符</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">暗刻（中張牌）</span>
              <span className="font-mono text-gray-900">+4符</span>
            </div>
          </div>

          <h4 className="font-semibold text-gray-800 mt-6">飜数の計算</h4>
          <p className="text-gray-700 leading-relaxed">
            飜数は成立した役によって決まります。複数の役が成立した場合は合計されます。
          </p>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-700">立直</span>
              <span className="font-mono text-gray-900">1飜</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">タンヤオ</span>
              <span className="font-mono text-gray-900">1飜</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">平和</span>
              <span className="font-mono text-gray-900">1飜</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">ホンイツ</span>
              <span className="font-mono text-gray-900">3飜（鳴き2飜）</span>
            </div>
          </div>

          <h4 className="font-semibold text-gray-800 mt-6">点数の計算</h4>
          <p className="text-gray-700 leading-relaxed">
            符と飜数から点数を計算します。親と子で点数が異なります。
          </p>
        </div>
      ),
    },
    {
      id: 'keyboard',
      title: 'キーボード操作',
      icon: '⌨️',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            キーボードショートカットを使用すると、より効率的に学習できます。
          </p>
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-800">数字キー（1-9）</span>
                <kbd className="px-3 py-1 bg-white border border-gray-300 rounded shadow-sm font-mono text-sm">
                  1-9
                </kbd>
              </div>
              <p className="text-sm text-gray-600">
                対応する選択肢を選択します
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-800">Enter</span>
                <kbd className="px-3 py-1 bg-white border border-gray-300 rounded shadow-sm font-mono text-sm">
                  Enter
                </kbd>
              </div>
              <p className="text-sm text-gray-600">
                回答を送信します
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-800">Space</span>
                <kbd className="px-3 py-1 bg-white border border-gray-300 rounded shadow-sm font-mono text-sm">
                  Space
                </kbd>
              </div>
              <p className="text-sm text-gray-600">
                次の問題に進みます
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-800">Escape</span>
                <kbd className="px-3 py-1 bg-white border border-gray-300 rounded shadow-sm font-mono text-sm">
                  Esc
                </kbd>
              </div>
              <p className="text-sm text-gray-600">
                開いているモーダルを閉じます
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-800">Tab</span>
                <kbd className="px-3 py-1 bg-white border border-gray-300 rounded shadow-sm font-mono text-sm">
                  Tab
                </kbd>
              </div>
              <p className="text-sm text-gray-600">
                次のフォーカス可能な要素に移動します
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'statistics',
      title: '統計情報',
      icon: '📊',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            学習の進捗を詳細に確認できます。
          </p>
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">基本統計</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>総回答数：これまでに回答した問題の総数</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>正解率：正解した問題の割合</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">詳細統計</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>難易度別正解率：簡単・普通・難しいの各難易度での正解率</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>最近10問：直近10問の正誤履歴</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>連続正解数：現在の連続正解数と最高記録</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>学習時間：累計の学習時間</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'settings',
      title: '設定',
      icon: '⚙️',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            アプリケーションの動作をカスタマイズできます。
          </p>
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">ルール設定</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span><strong>赤ドラ：</strong>赤5の牌をドラとして扱います</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span><strong>喰いタン：</strong>鳴いた状態でタンヤオを成立させることができます</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span><strong>後付け：</strong>鳴いた後に役を確定させることを認めます</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">アニメーション設定</h4>
              <p className="text-gray-700">
                画面の動きの速さを調整できます（なし・速い・標準・遅い）
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">音声設定</h4>
              <p className="text-gray-700">
                正解・不正解時の音声フィードバックのオン・オフと音量を調整できます
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">表示設定</h4>
              <p className="text-gray-700">
                フォントサイズを調整できます（小・中・大）
              </p>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>💡 ヒント：</strong>すべての設定は自動的に保存され、即座に反映されます。
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'features',
      title: 'その他の機能',
      icon: '✨',
      content: (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2">解説機能</h4>
            <p className="text-gray-700 leading-relaxed">
              不正解の場合は自動的に、正解の場合は「解説を見る」ボタンで、
              符の内訳・役の一覧・計算過程を確認できます。
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2">ツールチップ</h4>
            <p className="text-gray-700 leading-relaxed">
              各UI要素にマウスをホバーすると、補足情報が表示されます。
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2">チュートリアル</h4>
            <p className="text-gray-700 leading-relaxed">
              初回訪問時にチュートリアルが表示されます。
              スキップした場合でも、設定から再度表示できます。
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2">レスポンシブデザイン</h4>
            <p className="text-gray-700 leading-relaxed">
              スマートフォン、タブレット、PCなど、様々な画面サイズに対応しています。
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2">アクセシビリティ</h4>
            <p className="text-gray-700 leading-relaxed">
              スクリーンリーダー対応、キーボードナビゲーション、
              高コントラスト表示など、アクセシビリティに配慮した設計です。
            </p>
          </div>
        </div>
      ),
    },
  ];

  // Escapeキーでモーダルを閉じる
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const activeContent = helpSections.find(s => s.id === activeSection);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
    >
      {/* 背景オーバーレイ */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* モーダルコンテンツ */}
      <div className="relative bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2
            id="help-modal-title"
            className="text-2xl font-bold text-gray-900 flex items-center gap-2"
          >
            <span aria-hidden="true">❓</span>
            <span>ヘルプ</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
            aria-label="ヘルプを閉じる"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* コンテンツエリア */}
        <div className="flex flex-1 overflow-hidden">
          {/* サイドバー */}
          <nav
            className="w-64 border-r border-gray-200 overflow-y-auto bg-gray-50"
            aria-label="ヘルプセクション"
          >
            <ul className="p-4 space-y-2">
              {helpSections.map((section) => (
                <li key={section.id}>
                  <button
                    onClick={() => setActiveSection(section.id)}
                    className={`
                      w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3
                      ${
                        activeSection === section.id
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-200'
                      }
                    `}
                    aria-current={activeSection === section.id ? 'page' : undefined}
                  >
                    <span className="text-xl" aria-hidden="true">
                      {section.icon}
                    </span>
                    <span className="font-medium">{section.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* メインコンテンツ */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeContent && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl" aria-hidden="true">
                    {activeContent.icon}
                  </span>
                  <span>{activeContent.title}</span>
                </h3>
                <div className="prose prose-sm max-w-none">
                  {activeContent.content}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* フッター */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              さらに質問がある場合は、チュートリアルを再度確認してください。
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              閉じる
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
