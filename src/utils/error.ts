import { IResponse } from "@/types/IResponse";


export function handleDatabaseError<T>(
  operation: string,
  tableName: string,
  error: any,
  context?: any
): IResponse<T> {
  // Detailed logging for developers
  console.error(`Database Error - ${operation} ${tableName}:`, {
    timestamp: new Date().toISOString(),
    operation,
    tableName,
    errorCode: error?.code,
    errorMessage: error?.message,
    errorDetails: error?.details,
    errorHint: error?.hint,
    context
  });
  return {
    success: false,
    message: getUserFriendlyMessage(operation, error)
  };
}

// 5xx errors
export function handleUnexpectedError<T>(
  operation: string,
  tableName: string,
  error: any
): IResponse<T> {
  // Log unexpected errors with a stack trace
  console.error(`Unexpected Error - ${operation} ${tableName}:`, {
    timestamp: new Date().toISOString(),
    operation,
    tableName,
    error
  });
  
  return {
    success: false,
    message: getUserFriendlyMessage(operation, error)
  };
}

// 4xx errors
export function handleBadRequest<T>(
  operation: string,
  tableName: string,
  error: any,
  context?: any
): IResponse<T> {
  // Detailed logging for developers
  console.error(`Bad request - ${operation} ${tableName}:`, {
    timestamp: new Date().toISOString(),
    operation,
    tableName,
    errorCode: error?.code,
    errorMessage: error?.message,
    errorDetails: error?.details,
    errorHint: error?.hint,
    context
  });
  return {
    success: false,
    message: getUserFriendlyMessage(operation, error)
  };
}
