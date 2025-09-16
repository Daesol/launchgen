// Error Handling Utilities

export interface DashboardError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

export class DashboardErrorHandler {
  private static instance: DashboardErrorHandler;
  private errorLog: DashboardError[] = [];

  static getInstance(): DashboardErrorHandler {
    if (!DashboardErrorHandler.instance) {
      DashboardErrorHandler.instance = new DashboardErrorHandler();
    }
    return DashboardErrorHandler.instance;
  }

  /**
   * Create a standardized error object
   */
  createError(code: string, message: string, details?: any): DashboardError {
    return {
      code,
      message,
      details,
      timestamp: new Date(),
    };
  }

  /**
   * Log error for debugging
   */
  logError(error: DashboardError): void {
    this.errorLog.push(error);
    console.error('Dashboard Error:', error);
  }

  /**
   * Get error log
   */
  getErrorLog(): DashboardError[] {
    return [...this.errorLog];
  }

  /**
   * Clear error log
   */
  clearErrorLog(): void {
    this.errorLog = [];
  }

  /**
   * Handle API errors
   */
  handleApiError(error: any): DashboardError {
    let code = 'UNKNOWN_ERROR';
    let message = 'An unexpected error occurred';

    if (error.response) {
      // Server responded with error status
      code = `API_ERROR_${error.response.status}`;
      message = error.response.data?.message || error.response.statusText || message;
    } else if (error.request) {
      // Request was made but no response received
      code = 'NETWORK_ERROR';
      message = 'Network error - please check your connection';
    } else {
      // Something else happened
      code = 'REQUEST_ERROR';
      message = error.message || message;
    }

    const dashboardError = this.createError(code, message, error);
    this.logError(dashboardError);
    return dashboardError;
  }

  /**
   * Handle validation errors
   */
  handleValidationError(field: string, message: string): DashboardError {
    const error = this.createError('VALIDATION_ERROR', message, { field });
    this.logError(error);
    return error;
  }

  /**
   * Handle authentication errors
   */
  handleAuthError(message: string = 'Authentication failed'): DashboardError {
    const error = this.createError('AUTH_ERROR', message);
    this.logError(error);
    return error;
  }

  /**
   * Handle permission errors
   */
  handlePermissionError(resource: string): DashboardError {
    const error = this.createError('PERMISSION_ERROR', `Access denied to ${resource}`);
    this.logError(error);
    return error;
  }
}

// Error codes constants
export const ERROR_CODES = {
  // API Errors
  API_ERROR_400: 'API_ERROR_400',
  API_ERROR_401: 'API_ERROR_401',
  API_ERROR_403: 'API_ERROR_403',
  API_ERROR_404: 'API_ERROR_404',
  API_ERROR_500: 'API_ERROR_500',
  
  // Network Errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  
  // Validation Errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  REQUIRED_FIELD: 'REQUIRED_FIELD',
  INVALID_FORMAT: 'INVALID_FORMAT',
  
  // Authentication Errors
  AUTH_ERROR: 'AUTH_ERROR',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  
  // Permission Errors
  PERMISSION_ERROR: 'PERMISSION_ERROR',
  ACCESS_DENIED: 'ACCESS_DENIED',
  
  // General Errors
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  REQUEST_ERROR: 'REQUEST_ERROR',
} as const;

// Error messages
export const ERROR_MESSAGES = {
  [ERROR_CODES.API_ERROR_400]: 'Bad request - please check your input',
  [ERROR_CODES.API_ERROR_401]: 'Unauthorized - please log in again',
  [ERROR_CODES.API_ERROR_403]: 'Forbidden - you do not have permission',
  [ERROR_CODES.API_ERROR_404]: 'Not found - the resource does not exist',
  [ERROR_CODES.API_ERROR_500]: 'Server error - please try again later',
  [ERROR_CODES.NETWORK_ERROR]: 'Network error - please check your connection',
  [ERROR_CODES.TIMEOUT_ERROR]: 'Request timeout - please try again',
  [ERROR_CODES.VALIDATION_ERROR]: 'Validation error - please check your input',
  [ERROR_CODES.REQUIRED_FIELD]: 'This field is required',
  [ERROR_CODES.INVALID_FORMAT]: 'Invalid format - please check your input',
  [ERROR_CODES.AUTH_ERROR]: 'Authentication failed - please log in again',
  [ERROR_CODES.TOKEN_EXPIRED]: 'Session expired - please log in again',
  [ERROR_CODES.INVALID_CREDENTIALS]: 'Invalid credentials - please try again',
  [ERROR_CODES.PERMISSION_ERROR]: 'Access denied - you do not have permission',
  [ERROR_CODES.ACCESS_DENIED]: 'Access denied - insufficient permissions',
  [ERROR_CODES.UNKNOWN_ERROR]: 'An unexpected error occurred',
  [ERROR_CODES.REQUEST_ERROR]: 'Request failed - please try again',
} as const;

// Get user-friendly error message
export function getErrorMessage(error: DashboardError): string {
  return ERROR_MESSAGES[error.code as keyof typeof ERROR_MESSAGES] || error.message;
}

// Global error handler instance
export const errorHandler = DashboardErrorHandler.getInstance();
