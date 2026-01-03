/**
 * Login Use Case
 * Handles user login business logic
 */

import { IAuthRepository } from "../auth.repository";
import { LoginRequest, LoginApiResponse } from "../auth.entity";

export class LoginUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(credentials: LoginRequest): Promise<LoginApiResponse> {
    return await this.authRepository.login(credentials);
  }
}
