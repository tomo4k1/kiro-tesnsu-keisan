import type { Problem, Answer, Statistics, GameSettings, Difficulty } from '../types';
import { ProblemGenerator } from './ProblemGenerator';

/**
 * クイズの進行を管理するクラス
 * 問題生成、回答判定、統計情報管理を担当
 */
export class QuizManager {
  private generator: ProblemGenerator;
  private statistics: Statistics;
  private lastProblemId: string | null = null;

  constructor(settings: GameSettings) {
    this.generator = new ProblemGenerator(settings);
    this.statistics = {
      totalAnswered: 0,
      correctCount: 0,
      incorrectCount: 0,
      correctRate: 0,
    };
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
    if (answer.fu !== problem.correctFu) {
      this.updateStatistics(false);
      return false;
    }
    
    if (answer.han !== problem.correctHan) {
      this.updateStatistics(false);
      return false;
    }
    
    if (answer.score !== problem.correctScore) {
      this.updateStatistics(false);
      return false;
    }

    // すべて一致した場合のみここに到達
    this.updateStatistics(true);
    return true;
  }

  /**
   * 統計情報を取得する
   * @returns 現在の統計情報
   */
  getStatistics(): Statistics {
    return { ...this.statistics };
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
    this.lastProblemId = null;
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
