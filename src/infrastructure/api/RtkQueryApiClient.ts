/**
 * RTK Query API Client Implementation
 * 
 * This adapter implements IApiClient using fetch with the same authentication
 * and retry logic as RTK Query's baseQueryWithAutoRefresh, but without requiring
 * Redux store dependency.
 * 
 * This follows the Adapter pattern, translating between the generic IApiClient
 * interface and HTTP fetch requests with token management.
 */

import { IApiClient, ApiRequestConfig, ApiResponse, ApiError } from './IApiClient';
import { BaseUrl, endPoints } from './endPoints';
import { tokenStorage } from '../storage/tokenStorage';
import { LogoutRequiredError } from '../../shared/errors/domain.errors';

/**
 * RTK Query API Client
 * 
 * Implements IApiClient using fetch with authentication and auto-refresh logic.
 * This removes the dependency on Redux store from repository implementations.
 */
export class RtkQueryApiClient implements IApiClient {
  private baseUrl: string;
  private maxRetries: number;

  constructor(baseUrl?: string, maxRetries: number = 1) {
    this.baseUrl = baseUrl || BaseUrl;
    this.maxRetries = maxRetries;
  }

  /**
   * Execute an HTTP request with authentication and retry logic
   */
  async request<T = unknown>(config: ApiRequestConfig): Promise<ApiResponse<T>> {
    try {
      // Build full URL
      let url = config.url.startsWith('http') 
        ? config.url 
        : `${this.baseUrl}${config.url}`;

      // Build query string from params
      if (config.params && Object.keys(config.params).length > 0) {
        const queryString = Object.entries(config.params)
          .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
          .join('&');
        url = `${url}${url.includes('?') ? '&' : '?'}${queryString}`;
      }

      // Execute with retry logic
      const result = await this.executeWithRetry<T>(url, config);

      return result;
    } catch (error) {
      // Re-throw ApiError as-is
      if (error && typeof error === 'object' && 'status' in error) {
        throw error;
      }

      // Wrap unexpected errors
      const apiError: ApiError = {
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      };
      throw apiError;
    }
  }

  /**
   * Execute request with retry and token refresh logic
   */
  private async executeWithRetry<T>(
    url: string,
    config: ApiRequestConfig,
    attempt: number = 0
  ): Promise<ApiResponse<T>> {
    // Prepare headers
    const headers = await this.prepareHeaders(config);

    // Prepare request options
    // Create abort controller for timeout (React Native compatible)
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), 60000); // 60 second timeout

    const requestOptions: RequestInit = {
      method: config.method,
      headers,
      signal: abortController.signal,
    };

    // Add body for non-GET requests
    if (config.method !== 'GET' && config.body !== undefined) {
      // If body is FormData, don't set Content-Type (browser will set it with boundary)
      if (config.body instanceof FormData) {
        // FormData handles its own Content-Type
        requestOptions.body = config.body;
      } else {
        // For JSON, ensure Content-Type is set
        if (!headers['Content-Type']) {
          headers['Content-Type'] = 'application/json';
        }
        requestOptions.body = JSON.stringify(config.body);
      }
    }

    // Execute fetch
    let response: Response;
    try {
      response = await fetch(url, requestOptions);
      clearTimeout(timeoutId);
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        const apiError: ApiError = {
          message: 'Request timeout',
        };
        throw apiError;
      }
      throw error;
    }

    // Handle 401 - token expired, try refresh
    if (response.status === 401 && attempt < this.maxRetries) {
      console.log('Token expired. Attempting refresh...');

      const refreshToken = await tokenStorage.getRefreshToken();

      if (refreshToken) {
        // Try to refresh token
        const refreshResponse = await fetch(`${this.baseUrl}${endPoints.RefreshToken}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          const newAccessToken = refreshData.accessToken;

          // Store new token
          await tokenStorage.setAccessToken(newAccessToken);

          // Retry the original request with new token
          return this.executeWithRetry<T>(url, config, attempt + 1);
        } else {
          console.log('Refresh token failed. Logout required.');
          await tokenStorage.clearAllTokens();
          // Throw error instead of navigating - UI layer will handle navigation
          throw new LogoutRequiredError('Session expired. Please login again');
        }
      }
    }

    // Parse response
    const responseData = await this.parseResponse<T>(response);

    // Handle errors
    if (!response.ok) {
      const error: ApiError = {
        status: response.status,
        data: responseData,
        message: `Request failed with status ${response.status}`,
      };
      throw error;
    }

    // Extract headers
    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    return {
      data: responseData,
      status: response.status,
      headers: responseHeaders,
    };
  }

  /**
   * Prepare headers for request
   */
  private async prepareHeaders(config: ApiRequestConfig): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      ...config.headers,
    };

    // Get access token
    const token = await tokenStorage.getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Parse response based on content type
   */
  private async parseResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      return await response.json();
    }
    
    if (contentType?.includes('text/')) {
      return (await response.text()) as unknown as T;
    }
    
    // For binary data or other types, return as-is
    return await response.json().catch(() => ({} as T));
  }

  /**
   * GET request
   */
  async get<T = unknown>(
    url: string,
    params?: Record<string, string | number | boolean>,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'GET',
      params,
      headers,
    });
  }

  /**
   * POST request
   */
  async post<T = unknown>(
    url: string,
    body?: unknown,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'POST',
      body,
      headers,
    });
  }

  /**
   * PUT request
   */
  async put<T = unknown>(
    url: string,
    body?: unknown,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'PUT',
      body,
      headers,
    });
  }

  /**
   * PATCH request
   */
  async patch<T = unknown>(
    url: string,
    body?: unknown,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'PATCH',
      body,
      headers,
    });
  }

  /**
   * DELETE request
   */
  async delete<T = unknown>(
    url: string,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'DELETE',
      headers,
    });
  }
}

