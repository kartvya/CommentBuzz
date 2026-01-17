/**
 * Token Storage Interface
 * Abstraction for token storage operations
 * Allows swapping storage implementations without changing dependent code
 */
export interface ITokenStorage {
  /**
   * Get the user access token
   */
  getAccessToken(): Promise<string | null>;

  /**
   * Get the refresh token
   */
  getRefreshToken(): Promise<string | null>;

  /**
   * Set the user access token
   */
  setAccessToken(token: string): Promise<void>;

  /**
   * Set the refresh token
   */
  setRefreshToken(token: string): Promise<void>;

  /**
   * Remove the user access token
   */
  removeAccessToken(): Promise<void>;

  /**
   * Remove the refresh token
   */
  removeRefreshToken(): Promise<void>;

  /**
   * Remove all tokens (logout)
   */
  clearAllTokens(): Promise<void>;
}

