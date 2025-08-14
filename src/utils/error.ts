import { logger } from './logger';
import { 
  RepositoryError, 
  NotFoundError, 
  DuplicateError, 
  ValidationError 
} from '../repo/types';

// Extended error types for different layers
export class ServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'ServiceError';
  }
}

export class ControllerError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'ControllerError';
  }
}

export class AuthenticationError extends Error {
  constructor(message: string = 'Authentication failed') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends Error {
  constructor(message: string = 'Access denied') {
    super(message);
    this.name = 'AuthorizationError';
  }
}

// Error response interface for API responses
export interface ErrorResponse {
  error: {
    message: string;
    code: string;
    statusCode: number;
    timestamp: string;
    details?: any;
  };
}

// Error handler class
export class ErrorHandler {
  /**
   * Handle repository errors and convert them to appropriate service errors
   */
  static handleRepositoryError(error: Error, context?: string): ServiceError {
    const contextMsg = context ? ` in ${context}` : '';
    
    if (error instanceof NotFoundError) {
      logger.warn(`Not found error${contextMsg}`, { error: error.message });
      return new ServiceError(error.message, 'NOT_FOUND', 404, error);
    }
    
    if (error instanceof DuplicateError) {
      logger.warn(`Duplicate error${contextMsg}`, { error: error.message });
      return new ServiceError(error.message, 'DUPLICATE_ENTRY', 409, error);
    }
    
    if (error instanceof ValidationError) {
      logger.warn(`Validation error${contextMsg}`, { error: error.message, field: error.field });
      return new ServiceError(error.message, 'VALIDATION_ERROR', 400, error);
    }
    
    if (error instanceof RepositoryError) {
      logger.error(`Repository error${contextMsg}`, { 
        error: error.message, 
        code: error.code,
        originalError: error.originalError?.message 
      });
      return new ServiceError(
        'Database operation failed', 
        'DATABASE_ERROR', 
        500, 
        error
      );
    }
    
    // Unknown error
    logger.error(`Unexpected error${contextMsg}`, { 
      error: error.message, 
      stack: error.stack 
    });
    return new ServiceError(
      'An unexpected error occurred', 
      'INTERNAL_ERROR', 
      500, 
      error
    );
  }

  /**
   * Handle service errors and convert them to appropriate controller errors
   */
  static handleServiceError(error: Error, context?: string): ControllerError {
    const contextMsg = context ? ` in ${context}` : '';
    
    if (error instanceof ServiceError) {
      logger.info(`Service error${contextMsg}`, { 
        error: error.message, 
        code: error.code,
        statusCode: error.statusCode 
      });
      return new ControllerError(error.message, error.code, error.statusCode, error);
    }
    
    if (error instanceof AuthenticationError) {
      logger.warn(`Authentication error${contextMsg}`, { error: error.message });
      return new ControllerError(error.message, 'AUTHENTICATION_ERROR', 401, error);
    }
    
    if (error instanceof AuthorizationError) {
      logger.warn(`Authorization error${contextMsg}`, { error: error.message });
      return new ControllerError(error.message, 'AUTHORIZATION_ERROR', 403, error);
    }
    
    // Unknown error
    logger.error(`Unexpected service error${contextMsg}`, { 
      error: error.message, 
      stack: error.stack 
    });
    return new ControllerError(
      'An unexpected error occurred', 
      'INTERNAL_ERROR', 
      500, 
      error
    );
  }

  /**
   * Create error response object for API responses
   */
  static createErrorResponse(error: ControllerError): ErrorResponse {
    return {
      error: {
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
        timestamp: new Date().toISOString(),
        ...(process.env.NODE_ENV === 'development' && {
          details: {
            stack: error.stack,
            originalError: error.originalError?.message,
          },
        }),
      },
    };
  }

  /**
   * Log and handle any error with proper context
   */
  static async safeExecute<T>(
    operation: () => Promise<T>,
    context: string,
    errorHandler?: (error: Error) => Error
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      const handledError = errorHandler 
        ? errorHandler(error as Error) 
        : this.handleRepositoryError(error as Error, context);
      
      throw handledError;
    }
  }

  /**
   * Async wrapper that catches and handles errors
   */
  static asyncHandler<T extends any[], R>(
    fn: (...args: T) => Promise<R>
  ) {
    return async (...args: T): Promise<R> => {
      try {
        return await fn(...args);
      } catch (error) {
        throw this.handleRepositoryError(error as Error);
      }
    };
  }

  /**
   * Validation helper that throws ValidationError
   */
  static validateRequired(value: any, fieldName: string): void {
    if (value === undefined || value === null || value === '') {
      throw new ValidationError(`${fieldName} is required`, fieldName);
    }
  }

  /**
   * Validation helper for email format
   */
  static validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ValidationError('Invalid email format', 'email');
    }
  }

  /**
   * Validation helper for string length
   */
  static validateLength(
    value: string, 
    fieldName: string, 
    min?: number, 
    max?: number
  ): void {
    if (min !== undefined && value.length < min) {
      throw new ValidationError(
        `${fieldName} must be at least ${min} characters long`, 
        fieldName
      );
    }
    if (max !== undefined && value.length > max) {
      throw new ValidationError(
        `${fieldName} must be no more than ${max} characters long`, 
        fieldName
      );
    }
  }

  /**
   * Validation helper for positive numbers
   */
  static validatePositiveNumber(value: number, fieldName: string): void {
    if (value <= 0) {
      throw new ValidationError(`${fieldName} must be a positive number`, fieldName);
    }
  }

  /**
   * Validation helper for UUID format
   */
  static validateUUID(value: string, fieldName: string): void {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(value)) {
      throw new ValidationError(`${fieldName} must be a valid UUID`, fieldName);
    }
  }
}

// Export specific error types for convenience
export {
  RepositoryError,
  NotFoundError,
  DuplicateError,
  ValidationError,
};

// Helper functions for common validation scenarios
export const validate = {
  required: ErrorHandler.validateRequired,
  email: ErrorHandler.validateEmail,
  length: ErrorHandler.validateLength,
  positiveNumber: ErrorHandler.validatePositiveNumber,
  uuid: ErrorHandler.validateUUID,
};

// Helper function to create standardized error messages
export const createErrorMessage = (operation: string, resource: string, details?: string): string => {
  const baseMessage = `Failed to ${operation} ${resource}`;
  return details ? `${baseMessage}: ${details}` : baseMessage;
};

// Type guards for error checking
export const isRepositoryError = (error: any): error is RepositoryError => {
  return error instanceof RepositoryError;
};

export const isServiceError = (error: any): error is ServiceError => {
  return error instanceof ServiceError;
};

export const isControllerError = (error: any): error is ControllerError => {
  return error instanceof ControllerError;
};
