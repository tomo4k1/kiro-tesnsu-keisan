// 牌の型定義
export type TileType = 'man' | 'pin' | 'sou' | 'honor';
export type TileValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type HonorType = 'east' | 'south' | 'west' | 'north' | 'white' | 'green' | 'red';

export interface Tile {
  type: TileType;
  value?: TileValue;
  honor?: HonorType;
  isRed?: boolean; // 赤ドラ
}

// 鳴きの型定義
export interface Meld {
  type: 'chi' | 'pon' | 'kan' | 'ankan';
  tiles: Tile[];
}

// 手牌の型定義
export interface Hand {
  closedTiles: Tile[];
  melds: Meld[];
  winningTile: Tile;
  isDealer: boolean;
  winType: 'tsumo' | 'ron';
  prevalentWind: 'east' | 'south' | 'west' | 'north';
  seatWind: 'east' | 'south' | 'west' | 'north';
  dora: Tile[];
}

// 和了条件の型定義
export interface WinCondition {
  isDealer: boolean;
  winType: 'tsumo' | 'ron';
  prevalentWind: 'east' | 'south' | 'west' | 'north';
  seatWind: 'east' | 'south' | 'west' | 'north';
}

// 難易度の型定義
export type Difficulty = 'easy' | 'medium' | 'hard';

// 問題の型定義
export interface Problem {
  id: string;
  hand: Hand;
  correctFu: number;
  correctHan: number;
  correctScore: number;
  fuOptions: number[];
  hanOptions: number[];
  scoreOptions: number[];
  difficulty: Difficulty;
}

// 回答の型定義
export interface Answer {
  fu: number;
  han: number;
  score: number;
}

// ゲーム設定の型定義
export interface GameSettings {
  redDora: boolean;      // 赤ドラ有無
  kuitan: boolean;       // 喰いタン有無
  atozuke: boolean;      // 後付け有無
}

// アニメーション設定の型定義
export interface AnimationSettings {
  enabled: boolean;
  speed: 'slow' | 'normal' | 'fast' | 'none';
  reducedMotion: boolean;
}

// 音声設定の型定義
export interface SoundSettings {
  enabled: boolean;
  volume: number;
  correctSound: boolean;
  incorrectSound: boolean;
}

// 表示設定の型定義
export interface DisplaySettings {
  fontSize: 'small' | 'medium' | 'large';
  highContrast: boolean;
  showTooltips: boolean;
}

// チュートリアル設定の型定義
export interface TutorialSettings {
  completed: boolean;
  skipped: boolean;
  lastShownVersion: string;
}

// チュートリアルステップの型定義
export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  targetElement?: string;  // CSSセレクタ
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: () => void;
}

// UI設定の型定義
export interface UISettings {
  animation: AnimationSettings;
  sound: SoundSettings;
  display: DisplaySettings;
  tutorial: TutorialSettings;
}

// アプリケーション全体の設定
export interface AppSettings {
  game: GameSettings;
  ui: UISettings;
}

// 統計情報の型定義
export interface Statistics {
  totalAnswered: number;
  correctCount: number;
  incorrectCount: number;
  correctRate: number; // パーセンテージ
}

// 拡張統計情報の型のインポート
import type { ExtendedStatistics } from '../utils/statisticsCalculator';

// セッション状態の型定義
export interface SessionState {
  currentProblem: Problem | null;
  userAnswer: Partial<Answer>;
  isAnswered: boolean;
  statistics: Statistics;
  extendedStatistics: ExtendedStatistics;
  settings: GameSettings;
}

// 和了タイプの型定義
export type WinType = 'tsumo' | 'ron';

// エラー型のエクスポート
export * from './errors';

// 拡張統計情報の型のエクスポート
export type { 
  AnswerHistory, 
  DifficultyStats, 
  ExtendedStatistics 
} from '../utils/statisticsCalculator';
