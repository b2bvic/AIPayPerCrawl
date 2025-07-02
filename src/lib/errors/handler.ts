// Centralized error handling for the application

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  
  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404);
  }
}

export class RateLimitError extends AppError {
  constructor(retryAfter: number) {
    super(`Rate limit exceeded. Try again in ${retryAfter} seconds`, 429);
  }
}

// Error handler middleware for API routes
export function handleApiError(error: unknown) {
  console.error('API Error:', error);
  
  if (error instanceof AppError) {
    return new Response(
      JSON.stringify({ 
        error: error.message,
        statusCode: error.statusCode 
      }),
      { 
        status: error.statusCode,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
  
  // Log unhandled errors (integrate with monitoring service)
  console.error('Unhandled error:', error);
  
  return new Response(
    JSON.stringify({ 
      error: 'Internal server error',
      statusCode: 500
    }),
    { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}

// Client-side error boundary component would go here
export function logError(error: Error, context?: Record<string, any>) {
  // TODO: Integrate with error monitoring service (Sentry, etc.)
  console.error('Application error:', {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString()
  });
}