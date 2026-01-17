/**
 * useSignup Hook
 * React hook for handling user registration
 * Uses the SignupUseCase from the domain layer via DI container
 */

import { useState, useCallback } from "react";
import { getContainer, TOKENS } from "@/src/infrastructure/di";
import { SignupUseCase } from "../domain/usecases/signup.usecase";
import { SignupRequest, SignupResponse } from "../domain/auth.entity";
import { ValidationError } from "@/src/shared/errors/domain.errors";

interface UseSignupReturn {
  signup: (userData: SignupRequest) => Promise<SignupResponse>;
  isLoading: boolean;
  error: Error | null;
  validationErrors: Record<string, string[]> | null;
}

/**
 * Hook for user registration
 * @returns Object containing signup function, loading state, error, and validation errors
 */
export const useSignup = (): UseSignupReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [validationErrors, setValidationErrors] =
    useState<Record<string, string[]> | null>(null);

  const signup = useCallback(
    async (userData: SignupRequest): Promise<SignupResponse> => {
      setIsLoading(true);
      setError(null);
      setValidationErrors(null);

      try {
        const container = getContainer();
        const signupUseCase = container.resolve<SignupUseCase>(
          TOKENS.SignupUseCase
        );

        const result = await signupUseCase.execute(userData);
        setIsLoading(false);
        return result;
      } catch (err) {
        setIsLoading(false);

        // Handle validation errors
        if (err instanceof ValidationError) {
          setValidationErrors(err.validationErrors || null);
          setError(err);
          throw err;
        }

        // Handle other errors
        const error =
          err instanceof Error ? err : new Error("An unexpected error occurred");
        setError(error);
        throw error;
      }
    },
    []
  );

  return {
    signup,
    isLoading,
    error,
    validationErrors,
  };
};

