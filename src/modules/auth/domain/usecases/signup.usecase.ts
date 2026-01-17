/**
 * Signup Use Case
 * Handles user registration business logic including validation
 */

import { IAuthRepository } from "../auth.repository";
import { SignupRequest, SignupResponse } from "../auth.entity";
import { ValidationError } from "@/src/shared/errors/domain.errors";
import { Email, Password } from "../value-objects";

export class SignupUseCase {
  constructor(private authRepository: IAuthRepository) {}

  /**
   * Executes the signup use case with validation
   * 
   * @param userData - User registration data (username, email, password)
   * @returns Promise resolving to signup response
   * @throws {ValidationError} If validation fails
   */
  async execute(userData: SignupRequest): Promise<SignupResponse> {
    // Validate and normalize inputs
    const validationErrors: Record<string, string[]> = {};

    // Trim and validate username
    const username = userData.username?.trim() || "";
    if (!username) {
      validationErrors.username = ["Username is required"];
    } else if (username.length < 3) {
      validationErrors.username = ["Username must be at least 3 characters long"];
    } else if (username.length > 20) {
      validationErrors.username = ["Username must not exceed 20 characters"];
    }

    // Trim and validate email
    const email = userData.email?.trim() || "";
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

    // Validate password using Password value object
    const password = userData.password?.trim() || "";
    if (!password) {
      validationErrors.password = ["Password is required"];
    } else {
      try {
        new Password(password);
      } catch (error) {
        if (error instanceof ValidationError) {
          validationErrors.password = [error.message];
        } else {
          validationErrors.password = ["Password does not meet security requirements"];
        }
      }
    }

    // If there are validation errors, throw them all at once
    if (Object.keys(validationErrors).length > 0) {
      throw new ValidationError(
        "Signup validation failed",
        validationErrors
      );
    }

    // All validations passed, proceed with signup
    const normalizedUserData: SignupRequest = {
      username,
      email,
      password,
    };

    return await this.authRepository.signup(normalizedUserData);
  }
}
