/**
 * Auth Repository Interface
 * Defines the contract for authentication operations
 */

import {
  LoginRequest,
  LoginApiResponse,
  SignupRequest,
  SignupResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from "./auth.entity";

export interface IAuthRepository {
  /**
   * Login with email and password
   */
  login(credentials: LoginRequest): Promise<LoginApiResponse>;

  /**
   * Register a new user
   */
  signup(userData: SignupRequest): Promise<SignupResponse>;

  /**
   * Refresh access token using refresh token
   */
  refreshToken(
    refreshToken: RefreshTokenRequest
  ): Promise<RefreshTokenResponse>;

  /**
   * Logout user (clear tokens)
   */
  logout(): Promise<void>;
}
