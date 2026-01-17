/**
 * Auth Repository Implementation
 * Implements IAuthRepository using API client abstraction
 */

import { IAuthRepository } from "../domain/auth.repository";
import {
  LoginRequest,
  LoginApiResponse,
  SignupRequest,
  SignupResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from "../domain/auth.entity";
import { IApiClient } from "../../../infrastructure/api/IApiClient";
import { ITokenStorage } from "../../../infrastructure/storage/ITokenStorage";
import { endPoints } from "../../../infrastructure/api/endPoints";
import { mapToDomainError } from "../../../shared/errors";
import {
  LoginResponseDto,
  SignupResponseDto,
  RefreshTokenResponseDto,
} from "../../../infrastructure/api/dtos";

export class AuthRepositoryImpl implements IAuthRepository {
  constructor(
    private apiClient: IApiClient,
    private tokenStorage: ITokenStorage
  ) {}

  async login(credentials: LoginRequest): Promise<LoginApiResponse> {
    try {
      const response = await this.apiClient.post<LoginResponseDto>(
        endPoints.Login,
        credentials
      );

      // Extract auth header from response headers
      const authHeader =
        response.headers?.["authorization"] ||
        response.headers?.["Authorization"] ||
        "";

      // Transform to domain response format
      return {
        data: response.data,
        authHeader,
      };
    } catch (error) {
      throw mapToDomainError(error);
    }
  }

  async signup(userData: SignupRequest): Promise<SignupResponse> {
    try {
      const response = await this.apiClient.post<SignupResponseDto>(
        endPoints.Register,
        userData
      );

      return response.data;
    } catch (error) {
      throw mapToDomainError(error);
    }
  }

  async refreshToken(
    refreshToken: RefreshTokenRequest
  ): Promise<RefreshTokenResponse> {
    try {
      const response = await this.apiClient.post<RefreshTokenResponseDto>(
        endPoints.RefreshToken,
        refreshToken
      );

      return response.data;
    } catch (error) {
      throw mapToDomainError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await this.tokenStorage.clearAllTokens();
    } catch (error) {
      throw mapToDomainError(error);
    }
  }
}
