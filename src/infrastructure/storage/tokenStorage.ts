import AsyncStorage from "@react-native-async-storage/async-storage";
import { ITokenStorage } from "./ITokenStorage";

const TOKEN_KEYS = {
  USER_TOKEN: "UserToken",
  REFRESH_TOKEN: "RefreshToken",
} as const;

/**
 * Token Storage Implementation
 * Implements ITokenStorage using AsyncStorage
 */
export class TokenStorage implements ITokenStorage {
  /**
   * Get the user access token
   */
  async getAccessToken(): Promise<string | null> {
    return await AsyncStorage.getItem(TOKEN_KEYS.USER_TOKEN);
  }

  /**
   * Get the refresh token
   */
  async getRefreshToken(): Promise<string | null> {
    return await AsyncStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);
  }

  /**
   * Set the user access token
   */
  async setAccessToken(token: string): Promise<void> {
    await AsyncStorage.setItem(TOKEN_KEYS.USER_TOKEN, token);
  }

  /**
   * Set the refresh token
   */
  async setRefreshToken(token: string): Promise<void> {
    await AsyncStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, token);
  }

  /**
   * Remove the user access token
   */
  async removeAccessToken(): Promise<void> {
    await AsyncStorage.removeItem(TOKEN_KEYS.USER_TOKEN);
  }

  /**
   * Remove the refresh token
   */
  async removeRefreshToken(): Promise<void> {
    await AsyncStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
  }

  /**
   * Remove all tokens (logout)
   */
  async clearAllTokens(): Promise<void> {
    await AsyncStorage.multiRemove([
      TOKEN_KEYS.USER_TOKEN,
      TOKEN_KEYS.REFRESH_TOKEN,
    ]);
  }
}

// Export singleton instance for backward compatibility
export const tokenStorage: ITokenStorage = new TokenStorage();

