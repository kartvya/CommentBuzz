/**
 * Refresh Token Use Case
 * Handles token refresh business logic
 */

import { IAuthRepository } from "../auth.repository";
import { RefreshTokenRequest, RefreshTokenResponse } from "../auth.entity";

export class RefreshTokenUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(
    refreshToken: RefreshTokenRequest
  ): Promise<RefreshTokenResponse> {
    return await this.authRepository.refreshToken(refreshToken);
  }
}

