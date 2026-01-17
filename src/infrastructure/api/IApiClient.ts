/**
 * API Client Abstraction Interface
 * 
 * This interface defines a contract for making HTTP requests, allowing
 * the data layer to be independent of the specific HTTP client implementation.
 * 
 * This follows the Dependency Inversion Principle - repositories depend on
 * this abstraction rather than concrete implementations like RTK Query.
 */

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiRequestConfig {
  url: string;
  method: HttpMethod;
  body?: unknown;
  params?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
}

export interface ApiResponse<T = unknown> {
  data: T;
  status?: number;
  headers?: Record<string, string>;
}

export interface ApiError {
  status?: number;
  data?: unknown;
  message?: string;
}

/**
 * API Client Interface
 * 
 * Implementations of this interface handle the actual HTTP communication.
 * This allows swapping out RTK Query for other HTTP clients (Axios, Fetch, etc.)
 * without changing repository implementations.
 */
export interface IApiClient {
  /**
   * Execute an HTTP request
   * 
   * @param config Request configuration
   * @returns Promise resolving to the response data
   * @throws ApiError if the request fails
   */
  request<T = unknown>(config: ApiRequestConfig): Promise<ApiResponse<T>>;

  /**
   * Convenience method for GET requests
   */
  get<T = unknown>(
    url: string,
    params?: Record<string, string | number | boolean>,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>>;

  /**
   * Convenience method for POST requests
   */
  post<T = unknown>(
    url: string,
    body?: unknown,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>>;

  /**
   * Convenience method for PUT requests
   */
  put<T = unknown>(
    url: string,
    body?: unknown,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>>;

  /**
   * Convenience method for PATCH requests
   */
  patch<T = unknown>(
    url: string,
    body?: unknown,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>>;

  /**
   * Convenience method for DELETE requests
   */
  delete<T = unknown>(
    url: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>>;
}

