/**
 * Auth API DTOs
 * Data Transfer Objects for Auth API endpoints
 */

/**
 * DTO for login request
 */
export interface LoginRequestDto {
  email: string;
  password: string;
}

/**
 * DTO for login response user data
 */
export interface LoginResponseUserDto {
  id: string;
  username: string;
  email: string;
}

/**
 * DTO for login response
 */
export interface LoginResponseDto {
  success: boolean;
  message: string;
  accessToken: string;
  refreshToken: string;
  user: LoginResponseUserDto;
}

/**
 * DTO for login API response (includes auth header from transform)
 */
export interface LoginApiResponseDto {
  data: LoginResponseDto;
  authHeader: string;
}

/**
 * DTO for signup/register request
 */
export interface SignupRequestDto {
  username: string;
  email: string;
  password: string;
}

/**
 * DTO for signup/register response
 */
export interface SignupResponseDto {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    username: string;
    email: string;
  };
}

/**
 * DTO for refresh token request
 */
export interface RefreshTokenRequestDto {
  refreshToken: string;
}

/**
 * DTO for refresh token response
 */
export interface RefreshTokenResponseDto {
  accessToken: string;
}

