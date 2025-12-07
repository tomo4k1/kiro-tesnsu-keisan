import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  ErrorHandler, 
  ErrorType, 
  AppError,
  InvalidHandError,
  CalculationError,
  StorageError,
  GenerationError,
  InvalidSelectionError,
  type ErrorInfo,
} from './errors';

describe('ErrorHandler', () => {
  let errorHandler: ErrorHandler;

  beforeEach(() => {
    errorHandler = new ErrorHandler();
    // コンソールをモック
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'info').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  describe('createErrorInfo', () => {
    it('should create ErrorInfo with all required fields', () => {
      const errorInfo = errorHandler.createErrorInfo(
        'TEST_ERROR',
        'Test error message',
        'Test suggestion',
        'error'
      );

      expect(errorInfo.code).toBe('TEST_ERROR');
      expect(errorInfo.message).toBe('Test error message');
      expect(errorInfo.suggestion).toBe('Test suggestion');
      expect(errorInfo.severity).toBe('error');
      expect(errorInfo.timestamp).toBeGreaterThan(0);
    });

    it('should create ErrorInfo with context', () => {
      const context = { userId: '123', action: 'submit' };
      const errorInfo = errorHandler.createErrorInfo(
        'TEST_ERROR',
        'Test error',
        'Test suggestion',
        'error',
        context
      );

      expect(errorInfo.context).toEqual(context);
    });
  });

  describe('logError', () => {
    it('should add error to log', () => {
      const errorInfo = errorHandler.createErrorInfo(
        'TEST_ERROR',
        'Test error',
        'Test suggestion',
        'error'
      );

      errorHandler.logError(errorInfo);

      const log = errorHandler.getErrorLog();
      expect(log).toHaveLength(1);
      expect(log[0]).toEqual(errorInfo);
    });

    it('should limit log size to maxLogSize', () => {
      // 101個のエラーを追加
      for (let i = 0; i < 101; i++) {
        const errorInfo = errorHandler.createErrorInfo(
          `ERROR_${i}`,
          `Error ${i}`,
          'Suggestion',
          'error'
        );
        errorHandler.logError(errorInfo);
      }

      const log = errorHandler.getErrorLog();
      expect(log.length).toBeLessThanOrEqual(100);
    });

    it('should log to console based on severity', () => {
      const errorInfo = errorHandler.createErrorInfo(
        'TEST_ERROR',
        'Test error',
        'Test suggestion',
        'error'
      );

      errorHandler.logError(errorInfo);

      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('showError', () => {
    it('should log error and call callback', () => {
      const callback = vi.fn();
      errorHandler.setErrorCallback(callback);

      const errorInfo = errorHandler.createErrorInfo(
        'TEST_ERROR',
        'Test error',
        'Test suggestion',
        'error'
      );

      errorHandler.showError(errorInfo);

      expect(callback).toHaveBeenCalledWith(errorInfo);
      expect(errorHandler.getErrorLog()).toHaveLength(1);
    });
  });

  describe('fromAppError', () => {
    it('should convert InvalidHandError to ErrorInfo', () => {
      const appError = new InvalidHandError('Invalid hand data');
      const errorInfo = errorHandler.fromAppError(appError);

      expect(errorInfo.code).toBe(ErrorType.INVALID_HAND);
      expect(errorInfo.message).toBe('Invalid hand data');
      expect(errorInfo.suggestion).toBe('新しい問題を生成してください');
      expect(errorInfo.severity).toBe('error');
    });

    it('should convert CalculationError to ErrorInfo', () => {
      const appError = new CalculationError();
      const errorInfo = errorHandler.fromAppError(appError);

      expect(errorInfo.code).toBe(ErrorType.CALCULATION_ERROR);
      expect(errorInfo.severity).toBe('error');
    });

    it('should convert StorageError to ErrorInfo with warning severity', () => {
      const appError = new StorageError();
      const errorInfo = errorHandler.fromAppError(appError);

      expect(errorInfo.code).toBe(ErrorType.STORAGE_ERROR);
      expect(errorInfo.severity).toBe('warning');
    });

    it('should convert GenerationError to ErrorInfo', () => {
      const appError = new GenerationError();
      const errorInfo = errorHandler.fromAppError(appError);

      expect(errorInfo.code).toBe(ErrorType.GENERATION_ERROR);
      expect(errorInfo.severity).toBe('error');
    });

    it('should convert InvalidSelectionError to ErrorInfo with warning severity', () => {
      const appError = new InvalidSelectionError();
      const errorInfo = errorHandler.fromAppError(appError);

      expect(errorInfo.code).toBe(ErrorType.INVALID_SELECTION);
      expect(errorInfo.severity).toBe('warning');
    });
  });

  describe('fromUnknownError', () => {
    it('should convert AppError to ErrorInfo', () => {
      const appError = new InvalidHandError('Test error');
      const errorInfo = errorHandler.fromUnknownError(appError);

      expect(errorInfo.code).toBe(ErrorType.INVALID_HAND);
    });

    it('should convert Error to ErrorInfo', () => {
      const error = new Error('Test error message');
      const errorInfo = errorHandler.fromUnknownError(error);

      expect(errorInfo.code).toBe(ErrorType.UNKNOWN_ERROR);
      expect(errorInfo.message).toBe('Test error message');
    });

    it('should convert unknown error to ErrorInfo', () => {
      const errorInfo = errorHandler.fromUnknownError('string error');

      expect(errorInfo.code).toBe(ErrorType.UNKNOWN_ERROR);
      expect(errorInfo.message).toBe('予期しないエラーが発生しました');
    });

    it('should include context in ErrorInfo', () => {
      const context = { action: 'test' };
      const errorInfo = errorHandler.fromUnknownError('error', context);

      expect(errorInfo.context).toEqual(context);
    });
  });

  describe('retry', () => {
    it('should retry action on failure', async () => {
      let attempts = 0;
      const action = vi.fn(async () => {
        attempts++;
        if (attempts < 3) {
          throw new Error('Temporary failure');
        }
        return 'success';
      });

      const result = await errorHandler.retry(action, 3, 10);

      expect(result).toBe('success');
      expect(action).toHaveBeenCalledTimes(3);
    });

    it('should throw error after max attempts', async () => {
      const action = vi.fn(async () => {
        throw new Error('Permanent failure');
      });

      await expect(errorHandler.retry(action, 3, 10)).rejects.toThrow('Permanent failure');
      expect(action).toHaveBeenCalledTimes(3);
    });

    it('should succeed on first attempt', async () => {
      const action = vi.fn(async () => 'success');

      const result = await errorHandler.retry(action, 3, 10);

      expect(result).toBe('success');
      expect(action).toHaveBeenCalledTimes(1);
    });
  });

  describe('clearErrorLog', () => {
    it('should clear all errors from log', () => {
      const errorInfo = errorHandler.createErrorInfo(
        'TEST_ERROR',
        'Test error',
        'Test suggestion',
        'error'
      );

      errorHandler.logError(errorInfo);
      expect(errorHandler.getErrorLog()).toHaveLength(1);

      errorHandler.clearErrorLog();
      expect(errorHandler.getErrorLog()).toHaveLength(0);
    });
  });
});
