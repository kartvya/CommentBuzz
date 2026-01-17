/**
 * Password Value Object
 *
 * Encapsulates password validation logic and ensures password values
 * meet domain security requirements.
 *
 * This is a value object following Clean Architecture principles:
 * - Immutable
 * - Self-validating
 * - Domain-specific validation rules
 */

import { ValidationError } from "@/src/shared/errors/domain.errors";

/**
 * Password validation requirements:
 * - Minimum 8 characters
 * - At least one lowercase letter
 * - At least one uppercase letter
 * - At least one digit
 * - At least one special character (@$!%*?&)
 */
const PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

/**
 * Minimum password length requirement
 */
const MIN_PASSWORD_LENGTH = 8;

/**
 * Password value object
 *
 * @example
 * ```typescript
 * try {
 *   const password = new Password("SecurePass123!");
 *   console.log(password.value); // "SecurePass123!"
 * } catch (error) {
 *   // Handle ValidationError
 * }
 * ```
 */
export class Password {
  private readonly _value: string;

  /**
   * Creates a new Password value object
   *
   * @param value - The password string to validate
   * @throws {ValidationError} If the password is invalid
   */
  constructor(value: string) {
    if (!value) {
      throw new ValidationError("Password is required");
    }

    if (value.length < MIN_PASSWORD_LENGTH) {
      throw new ValidationError(
        `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`
      );
    }

    if (!PASSWORD_PATTERN.test(value)) {
      throw new ValidationError(
        "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character (@$!%*?&)"
      );
    }

    this._value = value;
  }

  /**
   * Gets the password value as a string
   *
   * Note: In production, consider never exposing the raw password value
   * and only using it for hashing operations
   */
  get value(): string {
    return this._value;
  }

  /**
   * Returns the password value as a string
   * Useful for serialization (though passwords should typically not be serialized)
   */
  toString(): string {
    return this._value;
  }

  /**
   * Checks if two Password objects are equal
   * Value objects should be compared by value, not reference
   */
  equals(other: Password): boolean {
    if (!(other instanceof Password)) {
      return false;
    }
    return this._value === other._value;
  }

  /**
   * Static factory method to create Password from string
   * Returns null if invalid instead of throwing
   *
   * @param value - The password string to validate
   * @returns Password instance or null if invalid
   */
  static tryCreate(value: string): Password | null {
    try {
      return new Password(value);
    } catch {
      return null;
    }
  }

  /**
   * Static method to validate password format without creating an instance
   *
   * @param value - The password string to validate
   * @returns true if valid, false otherwise
   */
  static isValid(value: string): boolean {
    if (!value) {
      return false;
    }

    if (value.length < MIN_PASSWORD_LENGTH) {
      return false;
    }

    return PASSWORD_PATTERN.test(value);
  }

  /**
   * Gets validation requirements as a human-readable message
   * Useful for displaying password requirements to users
   */
  static getRequirements(): string {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters long and contain:
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one digit (0-9)
- At least one special character (@$!%*?&)`;
  }
}
