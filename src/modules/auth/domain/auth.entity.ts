/**
 * Auth Domain Entities
 * Defines the core domain types for authentication
 */

export interface UserInfo {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  gender?: string;
  profilePic: string;
  bio: string;
  buzzCoins: number;
  followers: string[];
  following: string[];
}

export interface AuthState {
  userInfo: UserInfo | null;
  isDarkMode: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

export interface LoginApiResponse {
  data: LoginResponse;
  authHeader: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  success: boolean;
  message?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}
