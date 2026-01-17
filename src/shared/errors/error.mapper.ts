/**
 * Error Mapper
 * 
 * Maps infrastructure-level errors (RTK Query, API errors, etc.)
 * to domain-level errors. This ensures the domain layer remains
 * independent of infrastructure concerns.
 */

import {
  DomainError,
  NetworkError,
  TimeoutError,
  AuthenticationError,
  AuthorizationError,
  TokenExpiredError,
  ValidationError,
  NotFoundError,
  ConflictError,
  ServerError,
  ServiceUnavailableError,
  UnknownError,
} from "./domain.errors";
import { ApiError } from "../../infrastructure/api/IApiClient";

/**
 * RTK Query error structure
 */
interface RtkQueryError {
  status?: number;
  data?: unknown;
  error?: string;
  message?: string;
}

/**
 * Checks if an error is an RTK Query error
 */
function isRtkQueryError(error: unknown): error is RtkQueryError {
  return (
    typeof error === "object" &&
    error !== null &&
    ("status" in error || "data" in error || "error" in error)
  );
}

/**
 * Type guard to check if error is an ApiError
 */
function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error
  );
}

/**
 * Extracts error message from various error formats
 */
function extractErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (isRtkQueryError(error)) {
    // Try to extract message from RTK Query error
    if (error.message) {
      return error.message;
    }
    if (error.error) {
      return String(error.error);
    }
    if (error.data && typeof error.data === "object") {
      const data = error.data as Record<string, unknown>;
      if (data.message && typeof data.message === "string") {
        return data.message;
      }
      if (data.error && typeof data.error === "string") {
        return data.error;
      }
    }
  }

  if (typeof error === "string") {
    return error;
  }

  return "An unexpected error occurred";
}

/**
 * Extracts validation errors from error data
 */
function extractValidationErrors(error: unknown): Record<string, string[]> | undefined {
  if (isRtkQueryError(error) && error.data && typeof error.data === "object") {
    const data = error.data as Record<string, unknown>;
    
    // Check for express-validator format
    if (data.errors && Array.isArray(data.errors)) {
      const validationErrors: Record<string, string[]> = {};
      data.errors.forEach((err: unknown) => {
        if (err && typeof err === "object" && "param" in err && "msg" in err) {
          const param = String(err.param);
          const msg = String(err.msg);
          if (!validationErrors[param]) {
            validationErrors[param] = [];
          }
          validationErrors[param].push(msg);
        }
      });
      if (Object.keys(validationErrors).length > 0) {
        return validationErrors;
      }
    }

    // Check for other validation error formats
    if (data.validationErrors && typeof data.validationErrors === "object") {
      return data.validationErrors as Record<string, string[]>;
    }
  }

  return undefined;
}

/**
 * Maps infrastructure errors to domain errors
 */
export function mapToDomainError(error: unknown): DomainError {
  // If it's already a domain error, return as-is
  if (error instanceof DomainError) {
    return error;
  }

  // Handle ApiError from IApiClient
  if (isApiError(error)) {
    const apiError = error;
    const message = extractErrorMessage(error);
    const statusCode = apiError.status;

    // Map HTTP status codes to domain errors
    switch (statusCode) {
      case 400: {
        const validationErrors = extractValidationErrors(error);
        return new ValidationError(message, validationErrors, error);
      }
      case 401: {
        // Check if it's a token expiration
        if (
          message.toLowerCase().includes("expired") ||
          message.toLowerCase().includes("token")
        ) {
          return new TokenExpiredError(message, error);
        }
        return new AuthenticationError(message, error);
      }
      case 403:
        return new AuthorizationError(message, error);
      case 404:
        return new NotFoundError(message, error);
      case 409:
        return new ConflictError(message, error);
      case 500:
      case 502:
      case 504:
        return new ServerError(message, error);
      case 503:
        return new ServiceUnavailableError(message, error);
      default:
        // For other 4xx errors, treat as client error
        if (statusCode && statusCode >= 400 && statusCode < 500) {
          return new ValidationError(message, undefined, error);
        }
        // For other 5xx errors, treat as server error
        if (statusCode && statusCode >= 500) {
          return new ServerError(message, error);
        }
    }
  }

  // Handle RTK Query errors
  if (isRtkQueryError(error)) {
    const message = extractErrorMessage(error);
    const statusCode = error.status;

    // Map HTTP status codes to domain errors
    switch (statusCode) {
      case 400: {
        const validationErrors = extractValidationErrors(error);
        return new ValidationError(message, validationErrors, error);
      }
      case 401: {
        if (
          message.toLowerCase().includes("expired") ||
          message.toLowerCase().includes("token")
        ) {
          return new TokenExpiredError(message, error);
        }
        return new AuthenticationError(message, error);
      }
      case 403:
        return new AuthorizationError(message, error);
      case 404:
        return new NotFoundError(message, error);
      case 409:
        return new ConflictError(message, error);
      case 500:
      case 502:
      case 504:
        return new ServerError(message, error);
      case 503:
        return new ServiceUnavailableError(message, error);
      default:
        if (statusCode && statusCode >= 400 && statusCode < 500) {
          return new ValidationError(message, undefined, error);
        }
        if (statusCode && statusCode >= 500) {
          return new ServerError(message, error);
        }
    }
  }

  // Handle network errors
  if (error instanceof TypeError && error.message.includes("fetch")) {
    return new NetworkError("Network request failed. Please check your connection.", error);
  }

  // Handle timeout errors
  if (error instanceof Error && (error.name === "TimeoutError" || error.message.includes("timeout"))) {
    return new TimeoutError("Request timed out. Please try again.", error);
  }

  // Fallback to unknown error
  const message = extractErrorMessage(error);
  return new UnknownError(message, error);
}

