// Error handling utilities for comprehensive error management
import React from 'react';

// Error type constants
export const ERROR_TYPES = {
  NETWORK: 'network',
  API: 'api',
  VALIDATION: 'validation',
  PERMISSION: 'permission',
  TIMEOUT: 'timeout',
  UNKNOWN: 'unknown'
};

// Error severity level constants
export const ERROR_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

// Error handler class for centralized error management
class ErrorHandler {
  constructor() {
    this.errorLog = [];
    this.maxLogSize = 100;
  }

  // Log error for debugging and monitoring
  logError(error, context = {}) {
    const errorEntry = {
      timestamp: new Date().toISOString(),
      message: error.message || 'Unknown error',
      stack: error.stack,
      type: this.getErrorType(error),
      severity: this.getErrorSeverity(error),
      context,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    this.errorLog.unshift(errorEntry);
    
    // Keep only the most recent errors
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(0, this.maxLogSize);
    }

    console.error('ERROR: Error logged:', errorEntry);
    
    // Send to external logging service if available
    this.sendToExternalService(errorEntry);
  }

  // Get error type based on error properties
  getErrorType(error) {
    if (error.name === 'NetworkError' || error.message.includes('network')) {
      return ERROR_TYPES.NETWORK;
    }
    if (error.name === 'TimeoutError' || error.message.includes('timeout')) {
      return ERROR_TYPES.TIMEOUT;
    }
    if (error.name === 'ValidationError' || error.message.includes('validation')) {
      return ERROR_TYPES.VALIDATION;
    }
    if (error.name === 'PermissionError' || error.message.includes('permission')) {
      return ERROR_TYPES.PERMISSION;
    }
    if (error.name === 'APIError' || error.message.includes('API')) {
      return ERROR_TYPES.API;
    }
    return ERROR_TYPES.UNKNOWN;
  }

  // Get error severity based on error type and context
  getErrorSeverity(error) {
    const type = this.getErrorType(error);
    
    switch (type) {
      case ERROR_TYPES.NETWORK:
        return ERROR_SEVERITY.MEDIUM;
      case ERROR_TYPES.API:
        return ERROR_SEVERITY.HIGH;
      case ERROR_TYPES.PERMISSION:
        return ERROR_SEVERITY.HIGH;
      case ERROR_TYPES.TIMEOUT:
        return ERROR_SEVERITY.MEDIUM;
      case ERROR_TYPES.VALIDATION:
        return ERROR_SEVERITY.LOW;
      default:
        return ERROR_SEVERITY.MEDIUM;
    }
  }

  // Send error to external logging service
  sendToExternalService(errorEntry) {
    // Example: Send to external service like Sentry, LogRocket, etc.
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: errorEntry.message,
        fatal: errorEntry.severity === ERROR_SEVERITY.CRITICAL
      });
    }

    // Example: Send to custom logging endpoint
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/logs/error', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorEntry)
      }).catch(() => {
        // Silently fail if logging service is unavailable
      });
    }
  }

  // Get user-friendly error message
  getUserFriendlyMessage(error) {
    const type = this.getErrorType(error);
    
    switch (type) {
      case ERROR_TYPES.NETWORK:
        return 'Network connection error. Please check your internet connection and try again.';
      case ERROR_TYPES.API:
        return 'Server error occurred. Please try again in a few moments.';
      case ERROR_TYPES.TIMEOUT:
        return 'Request timed out. Please try again with a simpler request.';
      case ERROR_TYPES.VALIDATION:
        return error.message || 'Invalid input. Please check your topic and try again.';
      case ERROR_TYPES.PERMISSION:
        return 'API key is missing or invalid. Please check your configuration.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }

  // Get error recovery suggestions
  getRecoverySuggestions(error) {
    const type = this.getErrorType(error);
    
    switch (type) {
      case ERROR_TYPES.NETWORK:
        return [
          'Check your internet connection',
          'Try refreshing the page',
          'Check if the server is running'
        ];
      case ERROR_TYPES.API:
        return [
          'Try again in a few moments',
          'Check your API configuration',
          'Contact support if the issue persists'
        ];
      case ERROR_TYPES.TIMEOUT:
        return [
          'Try again with a simpler request',
          'Check your internet speed',
          'Wait a moment and retry'
        ];
      case ERROR_TYPES.VALIDATION:
        return [
          'Check your input format',
          'Ensure all required fields are filled',
          'Try a different topic or tone'
        ];
      default:
        return [
          'Try refreshing the page',
          'Clear your browser cache',
          'Contact support if the issue persists'
        ];
    }
  }

  // Get error log for debugging
  getErrorLog() {
    return this.errorLog;
  }

  // Clear error log
  clearErrorLog() {
    this.errorLog = [];
  }

  // Check if error is retryable
  isRetryable(error) {
    const type = this.getErrorType(error);
    return [ERROR_TYPES.NETWORK, ERROR_TYPES.TIMEOUT, ERROR_TYPES.API].includes(type);
  }

  // Get retry delay based on error type
  getRetryDelay(error, attemptNumber = 1) {
    const baseDelay = 1000; // 1 second
    const maxDelay = 30000; // 30 seconds
    const exponentialDelay = baseDelay * Math.pow(2, attemptNumber - 1);
    return Math.min(exponentialDelay, maxDelay);
  }
}

// Create singleton instance
const errorHandler = new ErrorHandler();

// Utility functions
export const handleError = (error, context = {}) => {
  errorHandler.logError(error, context);
  return errorHandler.getUserFriendlyMessage(error);
};

export const getErrorSuggestions = (error) => {
  return errorHandler.getRecoverySuggestions(error);
};

export const isRetryableError = (error) => {
  return errorHandler.isRetryable(error);
};

export const getRetryDelay = (error, attemptNumber = 1) => {
  return errorHandler.getRetryDelay(error, attemptNumber);
};

export const logError = (error, context = {}) => {
  errorHandler.logError(error, context);
};

export const getErrorLog = () => {
  return errorHandler.getErrorLog();
};

export const clearErrorLog = () => {
  errorHandler.clearErrorLog();
};

// Custom error classes
export class APIError extends Error {
  constructor(message, status, response) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.response = response;
  }
}

export class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

export class NetworkError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends Error {
  constructor(message) {
    super(message);
    this.name = 'TimeoutError';
  }
}

export class PermissionError extends Error {
  constructor(message) {
    super(message);
    this.name = 'PermissionError';
  }
}

// Retry utility with exponential backoff
export const withRetry = async (fn, maxAttempts = 3, context = {}) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Log the error
      logError(error, { ...context, attempt, maxAttempts });
      
      // If it's the last attempt or not retryable, throw the error
      if (attempt === maxAttempts || !isRetryableError(error)) {
        throw error;
      }
      
      // Wait before retrying
      const delay = getRetryDelay(error, attempt);
      console.log(`INFO: Retrying in ${delay}ms (attempt ${attempt}/${maxAttempts})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

// Error boundary helper
export const createErrorBoundary = (FallbackComponent) => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
      return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
      logError(error, { componentStack: errorInfo.componentStack });
    }

    render() {
      if (this.state.hasError) {
        return <FallbackComponent error={this.state.error} />;
      }

      return this.props.children;
    }
  };
};

export default errorHandler;