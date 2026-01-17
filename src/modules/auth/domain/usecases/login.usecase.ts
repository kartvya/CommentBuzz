/**
 * Login Use Case
 * Handles user login business logic including validation
 */

import { IAuthRepository } from "../auth.repository";
import { LoginRequest, LoginApiResponse } from "../auth.entity";
import { ValidationError } from "@/src/shared/errors/domain.errors";
import { Email } from "../value-objects";

export class LoginUseCase {
  constructor(private authRepository: IAuthRepository) {}

  /**
   * Executes the login use case with validation
   * 
   * @param credentials - User login credentials (email and password)
   * @returns Promise resolving to login response with tokens
   * @throws {ValidationError} If validation fails
   */
  async execute(credentials: LoginRequest): Promise<LoginApiResponse> {
    // Validate and normalize inputs
    const validationErrors: Record<string, string[]> = {};
    
    // Trim and validate email
    const email = credentials.email?.trim() || "";
    if (!email) {
      validationErrors.email = ["Email is required"];
    } else {
      // Validate email format using Email value object
      try {
        new Email(email);
      } catch (error) {
        if (error instanceof ValidationError) {
          validationErrors.email = [error.message];
        } else {
          validationErrors.email = ["Invalid email format"];
        }
      }
    }

    // Trim and validate password
    const password = credentials.password?.trim() || "";
    if (!password) {
      validationErrors.password = ["Password is required"];
    }

    // If there are validation errors, throw them all at once
    if (Object.keys(validationErrors).length > 0) {
      throw new ValidationError(
        "Login validation failed",
        validationErrors
      );
    }

    // All validations passed, proceed with login
    const normalizedCredentials: LoginRequest = {
      email,
      password,
    };

    return await this.authRepository.login(normalizedCredentials);
  }
}
