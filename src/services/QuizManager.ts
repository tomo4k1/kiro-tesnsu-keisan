import type { Problem, Answer, Statistics, GameSettings, Difficulty, AnswerHistory, ExtendedStatistics } from '../types';
import { ProblemGenerator } from './ProblemGenerator';
import { calculateExtendedStatistics } from '../utils/statisticsCalculator';

/**
 * クイズの進行を管理するクラス
 * 問題生成、回答判定、統計情報管理を担当
 */
export class QuizManager {
  private generator: ProblemGenerator;
  private statistics: Statistics;
  private answerHistory: AnswerHistory[] = [];
  private sessionStartTime: number;
  private lastProblemId: string | null = null;

  constructor(settings: GameSettings) {
    this.generator = new ProblemGenerator(settings);
    this.statistics = {
      totalAnswered: 0,
      correctCount: 0,
      incorrectCount: 0,
      correctRate: 0,
    };
    this.sessionStartTime = Date.now();
  }

  /**
   * 問題を生成する
   * @param difficulty 難易度（省略時はランダム）
   * @returns 生成された問題
   */
  generateProblem(difficulty?: Difficulty): Problem {
    const problem = this.generator.generate(difficulty);
    
    // 前回と同じ問題IDでないことを確認（要件 4.2）
    // 万が一同じIDが生成された場合は再生成
    if (problem.id === this.lastProblemId) {
      return this.generateProblem(difficulty);
    }
    
    this.lastProblemId = problem.id;
    return problem;
  }

  /**
   * 回答を判定する
   * @param problem 問題
   * @param answer ユーザーの回答
   * @returns 正解の場合true、不正解の場合false
   * 
   * パフォーマンス最適化:
   * - 早期リターンで不要な比較を回避
   * - 統計更新を最小限に
   */
  checkAnswer(problem: Problem, answer: Answer): boolean {
    // 符・飜数・点数のすべてが一致する場合のみ正解（要件 1.4）
    // 早期リターンで高速化
    const isCorrect = 
      answer.fu === problem.correctFu &&
      answer.han === problem.correctHan &&
      answer.score === problem.correctScore;
    
    // 回答履歴を記録
    this.recordAnswer(problem, isCorrect);
    
    // 統計を更新
    this.updateStatistics(isCorrect);
    
    return isCorrect;
  }

  /**
   * 統計情報を取得する
   * @returns 現在の統計情報
   */
  getStatistics(): Statistics {
    return { ...this.statistics };
  }

  /**
   * 拡張統計情報を取得する
   * @returns 計算された拡張統計情報
   * 
   * 要件:
   * - 3.1: 難易度別の正解率を表示
   * - 3.2: 最近の10問の正解率を表示
   * - 3.3: 連続正解数を表示
   * - 3.4: 学習時間を表示
   */
  getExtendedStatistics(): ExtendedStatistics {
    return calculateExtendedStatistics(this.answerHistory);
  }

  /**
   * セッションをリセットする
   * 統計情報をクリアして新しいセッションを開始
   */
  resetSession(): void {
    this.statistics = {
      totalAnswered: 0,
      correctCount: 0,
      incorrectCount: 0,
      correctRate: 0,
    };
    this.answerHistory = [];
    this.sessionStartTime = Date.now();
    this.lastProblemId = null;
  }

  /**
   * 回答履歴を記録する
   * @param problem 問題
   * @param isCorrect 正解かどうか
   */
  private recordAnswer(problem: Problem, isCorrect: boolean): void {
    this.answerHistory.push({
      isCorrect,
      difficulty: problem.difficulty,
      timestamp: Date.now(),
      problemId: problem.id,
    });
  }

  /**
   * 統計情報を更新する
   * @param isCorrect 正解かどうか
   */
  private updateStatistics(isCorrect: boolean): void {
    this.statistics.totalAnswered++;
    
    if (isCorrect) {
      this.statistics.correctCount++;
    } else {
      this.statistics.incorrectCount++;
    }

    // 正解率を計算（要件 3.3）
    if (this.statistics.totalAnswered > 0) {
      this.statistics.correctRate = 
        (this.statistics.correctCount / this.statistics.totalAnswered) * 100;
    } else {
      this.statistics.correctRate = 0;
    }
  }
}
