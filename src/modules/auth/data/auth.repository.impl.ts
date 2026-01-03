/**
 * Auth Repository Implementation
 * Implements IAuthRepository using RTK Query APIs
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
import AuthApi from "../../../infrastructure/api/authApi";
import { tokenStorage } from "../../../infrastructure/storage/tokenStorage";
import { store } from "../../../redux/Store";

export class AuthRepositoryImpl implements IAuthRepository {
  async login(credentials: LoginRequest): Promise<LoginApiResponse> {
    const result = await store.dispatch(
      AuthApi.endpoints.login.initiate(credentials)
    );
    if ("error" in result) {
      throw result.error;
    }
    return result.data as LoginApiResponse;
  }

  async signup(userData: SignupRequest): Promise<SignupResponse> {
    const result = await store.dispatch(
      AuthApi.endpoints.register.initiate(userData)
    );
    if ("error" in result) {
      throw result.error;
    }
    return result.data as SignupResponse;
  }

  async refreshToken(
    refreshToken: RefreshTokenRequest
  ): Promise<RefreshTokenResponse> {
    const result = await store.dispatch(
      AuthApi.endpoints.refreshToken.initiate(refreshToken)
    );
    if ("error" in result) {
      throw result.error;
    }
    return result.data as RefreshTokenResponse;
  }

  async logout(): Promise<void> {
    await tokenStorage.clearAllTokens();
  }
}

