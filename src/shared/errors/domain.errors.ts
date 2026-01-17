/**
 * Domain Error Types
 *
 * These error types represent domain-level errors that are independent
 * of infrastructure concerns. They provide a clean abstraction for
 * error handling across the application.
 */

/**
 * Base domain error class
 */
export class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode?: number,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Network-related errors
 */
export class NetworkError extends DomainError {
  constructor(
    message: string = "Network request failed",
    originalError?: unknown
  ) {
    super(message, "NETWORK_ERROR", undefined, originalError);
  }
}

export class TimeoutError extends DomainError {
  constructor(message: string = "Request timed out", originalError?: unknown) {
    super(message, "TIMEOUT_ERROR", undefined, originalError);
  }
}

/**
 * Authentication and authorization errors
 */
export class AuthenticationError extends DomainError {
  constructor(
    message: string = "Authentication failed",
    originalError?: unknown
  ) {
    super(message, "AUTHENTICATION_ERROR", 401, originalError);
  }
}

export class AuthorizationError extends DomainError {
  constructor(
    message: string = "You don't have permission to perform this action",
    originalError?: unknown
  ) {
    super(message, "AUTHORIZATION_ERROR", 403, originalError);
  }
}

export class TokenExpiredError extends DomainError {
  constructor(
    message: string = "Authentication token has expired",
    originalError?: unknown
  ) {
    super(message, "TOKEN_EXPIRED_ERROR", 401, originalError);
  }
}

/**
 * Error indicating that user logout is required (e.g., refresh token expired)
 * UI layer should handle this by clearing state and navigating to login
 */
export class LogoutRequiredError extends DomainError {
  constructor(
    message: string = "Session expired. Please login again",
    originalError?: unknown
  ) {
    super(message, "LOGOUT_REQUIRED_ERROR", 401, originalError);
  }
}

/**
 * Client errors (4xx)
 */
export class ValidationError extends DomainError {
  constructor(
    message: string = "Validation failed",
    public readonly validationErrors?: Record<string, string[]>,
    originalError?: unknown
  ) {
    super(message, "VALIDATION_ERROR", 400, originalError);
  }
}

export class NotFoundError extends DomainError {
  constructor(message: string = "Resource not found", originalError?: unknown) {
    super(message, "NOT_FOUND_ERROR", 404, originalError);
  }
}

export class ConflictError extends DomainError {
  constructor(message: string = "Resource conflict", originalError?: unknown) {
    super(message, "CONFLICT_ERROR", 409, originalError);
  }
}

/**
 * Server errors (5xx)
 */
export class ServerError extends DomainError {
  constructor(
    message: string = "Server error occurred",
    originalError?: unknown
  ) {
    super(message, "SERVER_ERROR", 500, originalError);
  }
}

export class ServiceUnavailableError extends DomainError {
  constructor(
    message: string = "Service temporarily unavailable",
    originalError?: unknown
  ) {
    super(message, "SERVICE_UNAVAILABLE_ERROR", 503, originalError);
  }
}

/**
 * Unknown/unexpected errors
 */
export class UnknownError extends DomainError {
  constructor(
    message: string = "An unexpected error occurred",
    originalError?: unknown
  ) {
    super(message, "UNKNOWN_ERROR", undefined, originalError);
  }
}
