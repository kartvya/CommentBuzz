/**
 * Signup Use Case
 * Handles user registration business logic
 */

import { IAuthRepository } from "../auth.repository";
import { SignupRequest, SignupResponse } from "../auth.entity";

export class SignupUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(userData: SignupRequest): Promise<SignupResponse> {
    return await this.authRepository.signup(userData);
  }
}
