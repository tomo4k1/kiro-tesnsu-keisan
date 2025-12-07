import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorAlert, ErrorAlertWithInfo } from './ErrorAlert';
import type { ErrorInfo } from '../types/errors';

describe('ErrorAlert', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should render error message', () => {
    render(<ErrorAlert message="Test error message" type="error" />);
    
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('should render suggestion when provided', () => {
    render(
      <ErrorAlert 
        message="Test error" 
        suggestion="Test suggestion"
        type="error"
      />
    );
    
    expect(screen.getByText(/Test suggestion/)).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', async () => {
    vi.useRealTimers(); // Use real timers for user interaction
    const user = userEvent.setup();
    const onClose = vi.fn();
    
    render(<ErrorAlert message="Test error" onClose={onClose} type="error" />);
    
    const closeButton = screen.getByLabelText('アラートを閉じる');
    await user.click(closeButton);
    
    expect(onClose).toHaveBeenCalledTimes(1);
    vi.useFakeTimers(); // Restore fake timers
  });

  it('should auto-dismiss after delay for non-error types', () => {
    const onClose = vi.fn();
    
    render(
      <ErrorAlert 
        message="Test warning" 
        type="warning"
        onClose={onClose}
        autoDismiss={true}
        autoDismissDelay={5000}
      />
    );
    
    expect(onClose).not.toHaveBeenCalled();
    
    // 5秒進める
    vi.advanceTimersByTime(5000);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should not auto-dismiss for error type', () => {
    const onClose = vi.fn();
    
    render(
      <ErrorAlert 
        message="Test error" 
        type="error"
        onClose={onClose}
        autoDismiss={true}
        autoDismissDelay={5000}
      />
    );
    
    // 5秒進める
    vi.advanceTimersByTime(5000);
    
    expect(onClose).not.toHaveBeenCalled();
  });

  it('should render retry button when onRetry is provided', () => {
    const onRetry = vi.fn();
    
    render(
      <ErrorAlert 
        message="Test error" 
        type="error"
        onRetry={onRetry}
      />
    );
    
    expect(screen.getByLabelText('再試行')).toBeInTheDocument();
  });

  it('should call onRetry when retry button is clicked', async () => {
    vi.useRealTimers(); // Use real timers for user interaction
    const user = userEvent.setup();
    const onRetry = vi.fn();
    
    render(
      <ErrorAlert 
        message="Test error" 
        type="error"
        onRetry={onRetry}
      />
    );
    
    const retryButton = screen.getByLabelText('再試行');
    await user.click(retryButton);
    
    expect(onRetry).toHaveBeenCalledTimes(1);
    vi.useFakeTimers(); // Restore fake timers
  });

  it('should render retry button for network errors', () => {
    const onRetry = vi.fn();
    
    render(
      <ErrorAlert 
        message="ネットワークエラーが発生しました" 
        type="error"
        onRetry={onRetry}
      />
    );
    
    expect(screen.getByLabelText('再試行')).toBeInTheDocument();
  });

  it('should render with correct styles for error type', () => {
    const { container } = render(
      <ErrorAlert message="Test error" type="error" />
    );
    
    const alert = container.querySelector('[role="alert"]');
    expect(alert).toHaveClass('bg-red-50', 'border-red-200');
  });

  it('should render with correct styles for warning type', () => {
    const { container } = render(
      <ErrorAlert message="Test warning" type="warning" />
    );
    
    const alert = container.querySelector('[role="alert"]');
    expect(alert).toHaveClass('bg-yellow-50', 'border-yellow-200');
  });

  it('should render with correct styles for info type', () => {
    const { container } = render(
      <ErrorAlert message="Test info" type="info" />
    );
    
    const alert = container.querySelector('[role="alert"]');
    expect(alert).toHaveClass('bg-blue-50', 'border-blue-200');
  });
});

describe('ErrorAlertWithInfo', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should render ErrorInfo message and suggestion', () => {
    const errorInfo: ErrorInfo = {
      code: 'TEST_ERROR',
      message: 'Test error message',
      suggestion: 'Test suggestion',
      severity: 'error',
      timestamp: Date.now(),
    };
    
    render(<ErrorAlertWithInfo errorInfo={errorInfo} />);
    
    expect(screen.getByText('Test error message')).toBeInTheDocument();
    expect(screen.getByText(/Test suggestion/)).toBeInTheDocument();
  });

  it('should map severity to correct type', () => {
    const errorInfo: ErrorInfo = {
      code: 'TEST_ERROR',
      message: 'Test warning',
      suggestion: 'Test suggestion',
      severity: 'warning',
      timestamp: Date.now(),
    };
    
    const { container } = render(<ErrorAlertWithInfo errorInfo={errorInfo} />);
    
    const alert = container.querySelector('[role="alert"]');
    expect(alert).toHaveClass('bg-yellow-50', 'border-yellow-200');
  });

  it('should not auto-dismiss critical errors', () => {
    const onClose = vi.fn();
    const errorInfo: ErrorInfo = {
      code: 'CRITICAL_ERROR',
      message: 'Critical error',
      suggestion: 'Contact support',
      severity: 'critical',
      timestamp: Date.now(),
    };
    
    render(
      <ErrorAlertWithInfo 
        errorInfo={errorInfo} 
        onClose={onClose}
        autoDismiss={true}
        autoDismissDelay={5000}
      />
    );
    
    // 5秒進める
    vi.advanceTimersByTime(5000);
    
    expect(onClose).not.toHaveBeenCalled();
  });

  it('should not auto-dismiss error severity errors', () => {
    const onClose = vi.fn();
    const errorInfo: ErrorInfo = {
      code: 'ERROR',
      message: 'Error message',
      suggestion: 'Try again',
      severity: 'error',
      timestamp: Date.now(),
    };
    
    render(
      <ErrorAlertWithInfo 
        errorInfo={errorInfo} 
        onClose={onClose}
        autoDismiss={true}
        autoDismissDelay={5000}
      />
    );
    
    // 5秒進める
    vi.advanceTimersByTime(5000);
    
    expect(onClose).not.toHaveBeenCalled();
  });

  it('should auto-dismiss info severity errors', () => {
    const onClose = vi.fn();
    const errorInfo: ErrorInfo = {
      code: 'INFO',
      message: 'Info message',
      suggestion: 'No action needed',
      severity: 'info',
      timestamp: Date.now(),
    };
    
    render(
      <ErrorAlertWithInfo 
        errorInfo={errorInfo} 
        onClose={onClose}
        autoDismiss={true}
        autoDismissDelay={5000}
      />
    );
    
    // 5秒進める
    vi.advanceTimersByTime(5000);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should auto-dismiss warning severity errors', () => {
    const onClose = vi.fn();
    const errorInfo: ErrorInfo = {
      code: 'WARNING',
      message: 'Warning message',
      suggestion: 'Check settings',
      severity: 'warning',
      timestamp: Date.now(),
    };
    
    render(
      <ErrorAlertWithInfo 
        errorInfo={errorInfo} 
        onClose={onClose}
        autoDismiss={true}
        autoDismissDelay={5000}
      />
    );
    
    // 5秒進める
    vi.advanceTimersByTime(5000);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should render retry button for network errors with ErrorInfo', () => {
    const onRetry = vi.fn();
    const errorInfo: ErrorInfo = {
      code: 'NETWORK_ERROR',
      message: 'ネットワークエラーが発生しました',
      suggestion: 'インターネット接続を確認してください',
      severity: 'error',
      timestamp: Date.now(),
    };
    
    render(
      <ErrorAlertWithInfo 
        errorInfo={errorInfo} 
        onRetry={onRetry}
      />
    );
    
    expect(screen.getByLabelText('再試行')).toBeInTheDocument();
  });

  it('should display message and suggestion from ErrorInfo', () => {
    const errorInfo: ErrorInfo = {
      code: 'CUSTOM_ERROR',
      message: 'Custom error message',
      suggestion: 'Custom suggestion',
      severity: 'error',
      timestamp: Date.now(),
    };
    
    render(<ErrorAlertWithInfo errorInfo={errorInfo} />);
    
    expect(screen.getByText('Custom error message')).toBeInTheDocument();
    expect(screen.getByText(/Custom suggestion/)).toBeInTheDocument();
  });
});
