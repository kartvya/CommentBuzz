/**
 * Logout Use Case
 * Handles user logout business logic
 */

import { IAuthRepository } from "../auth.repository";

export class LogoutUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(): Promise<void> {
    return await this.authRepository.logout();
  }
}

