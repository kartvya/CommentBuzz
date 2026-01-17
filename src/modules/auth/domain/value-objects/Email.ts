/**
 * Email Value Object
 * 
 * Encapsulates email validation logic and ensures email values
 * are always valid according to domain rules.
 * 
 * This is a value object following Clean Architecture principles:
 * - Immutable
 * - Self-validating
 * - Domain-specific validation rules
 */

import { ValidationError } from "@/src/shared/errors/domain.errors";

/**
 * Email validation regex pattern
 * Matches standard email format: user@domain.tld
 */
const EMAIL_PATTERN = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

/**
 * Email value object
 * 
 * @example
 * ```typescript
 * try {
 *   const email = new Email("user@example.com");
 *   console.log(email.value); // "user@example.com"
 * } catch (error) {
 *   // Handle ValidationError
 * }
 * ```
 */
export class Email {
  private readonly _value: string;

  /**
   * Creates a new Email value object
   * 
   * @param value - The email string to validate
   * @throws {ValidationError} If the email is invalid
   */
  constructor(value: string) {
    const trimmedValue = value?.trim();

    if (!trimmedValue) {
      throw new ValidationError("Email is required");
    }

    if (!EMAIL_PATTERN.test(trimmedValue)) {
      throw new ValidationError("Invalid email format");
    }

    this._value = trimmedValue;
  }

  /**
   * Gets the email value as a string
   */
  get value(): string {
    return this._value;
  }

  /**
   * Returns the email value as a string
   * Useful for serialization
   */
  toString(): string {
    return this._value;
  }

  /**
   * Checks if two Email objects are equal
   * Value objects should be compared by value, not reference
   */
  equals(other: Email): boolean {
    if (!(other instanceof Email)) {
      return false;
    }
    return this._value.toLowerCase() === other._value.toLowerCase();
  }

  /**
   * Static factory method to create Email from string
   * Returns null if invalid instead of throwing
   * 
   * @param value - The email string to validate
   * @returns Email instance or null if invalid
   */
  static tryCreate(value: string): Email | null {
    try {
      return new Email(value);
    } catch {
      return null;
    }
  }

  /**
   * Static method to validate email format without creating an instance
   * 
   * @param value - The email string to validate
   * @returns true if valid, false otherwise
   */
  static isValid(value: string): boolean {
    if (!value?.trim()) {
      return false;
    }
    return EMAIL_PATTERN.test(value.trim());
  }
}

