import { NextResponse } from 'next/server';

// Define error types
export interface AppError {
  code: string;
  message: string;
  statusCode: number;
  details?: any;
}

// Common error types
export const ErrorTypes = {
  UNAUTHORIZED: {
    code: 'UNAUTHORIZED',
    message: 'Unauthorized access',
    statusCode: 401
  },
  FORBIDDEN: {
    code: 'FORBIDDEN', 
    message: 'Access forbidden',
    statusCode: 403
  },
  NOT_FOUND: {
    code: 'NOT_FOUND',
    message: 'Resource not found',
    statusCode: 404
  },
  VALIDATION_ERROR: {
    code: 'VALIDATION_ERROR',
    message: 'Invalid input data',
    statusCode: 400
  },
  RATE_LIMIT_EXCEEDED: {
    code: 'RATE_LIMIT_EXCEEDED',
    message: 'Too many requests',
    statusCode: 429
  },
  INTERNAL_ERROR: {
    code: 'INTERNAL_ERROR',
    message: 'Internal server error',
    statusCode: 500
  },
  DATABASE_ERROR: {
    code: 'DATABASE_ERROR',
    message: 'Service temporarily unavailable',
    statusCode: 503
  }
} as const;

// Error handler function
export function handleError(error: any, errorType?: typeof ErrorTypes[keyof typeof ErrorTypes] | { code: string; message: string; statusCode: number }): NextResponse {
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Log the full error for debugging (server-side only)
  if (!isProduction) {
    console.error('Detailed error:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      timestamp: new Date().toISOString()
    });
  } else {
    // In production, log minimal information
    console.error(`Error ${new Date().toISOString()}:`, error.message || 'Unknown error');
  }

  // Determine error type
  let responseError = errorType || ErrorTypes.INTERNAL_ERROR;
  
  // Check for specific database errors
  if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
    responseError = {
      code: 'DUPLICATE_ENTRY' as const,
      message: 'Resource already exists',
      statusCode: 409 as const
    };
  } else if (error.code === 'ER_NO_REFERENCED_ROW_2' || error.errno === 1452) {
    responseError = ErrorTypes.NOT_FOUND;
  } else if (error.code?.startsWith('ER_') || error.errno) {
    // Generic database error
    responseError = ErrorTypes.DATABASE_ERROR;
  }

  // Create response object
  const responseData: any = {
    error: responseError.message,
    code: responseError.code,
    timestamp: new Date().toISOString()
  };

  // Only include details in development
  if (!isProduction && error.message) {
    responseData.details = error.message;
  }

  return NextResponse.json(responseData, { status: responseError.statusCode });
}

// Specific error handlers for common cases
export function createUnauthorizedResponse(): NextResponse {
  return handleError(new Error('Unauthorized'), ErrorTypes.UNAUTHORIZED);
}

export function createNotFoundResponse(resource: string = 'Resource'): NextResponse {
  return handleError(new Error(`${resource} not found`), ErrorTypes.NOT_FOUND);
}

export function createValidationErrorResponse(message: string): NextResponse {
  return handleError(new Error(message), ErrorTypes.VALIDATION_ERROR);
}

export function createRateLimitResponse(message?: string): NextResponse {
  const error = new Error(message || 'Rate limit exceeded');
  return handleError(error, ErrorTypes.RATE_LIMIT_EXCEEDED);
}

export function createForbiddenResponse(message?: string): NextResponse {
  const error = new Error(message || 'Access forbidden');
  return handleError(error, ErrorTypes.FORBIDDEN);
}

// Database error wrapper
export function handleDatabaseError(error: any): NextResponse {
  // This will automatically categorize database errors
  return handleError(error);
}

// Async wrapper for API routes
export function withErrorHandler<T extends any[], R>(
  handler: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R | NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleError(error);
    }
  };
} 