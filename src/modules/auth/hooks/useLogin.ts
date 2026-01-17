/**
 * useLogin Hook
 * React hook for handling user login
 * Uses the LoginUseCase from the domain layer via DI container
 */

import { useState, useCallback } from "react";
import { getContainer, TOKENS } from "@/src/infrastructure/di";
import { LoginUseCase } from "../domain/usecases/login.usecase";
import { LoginRequest, LoginApiResponse } from "../domain/auth.entity";
import { ValidationError } from "@/src/shared/errors/domain.errors";
import { ITokenStorage } from "@/src/infrastructure/storage/ITokenStorage";

interface UseLoginReturn {
  login: (credentials: LoginRequest) => Promise<LoginApiResponse>;
  isLoading: boolean;
  error: Error | null;
  validationErrors: Record<string, string[]> | null;
}

/**
 * Hook for user login
 * Handles login, token storage, and error management
 * @returns Object containing login function, loading state, error, and validation errors
 */
export const useLogin = (): UseLoginReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<
    string,
    string[]
  > | null>(null);

  const login = useCallback(
    async (credentials: LoginRequest): Promise<LoginApiResponse> => {
      setIsLoading(true);
      setError(null);
      setValidationErrors(null);
      try {
        const container = getContainer();

        const loginUseCase = container.resolve<LoginUseCase>(
          TOKENS.LoginUseCase
        );
        const tokenStorage = container.resolve<ITokenStorage>(
          TOKENS.ITokenStorage
        );

        const result = await loginUseCase.execute(credentials);

        // Store tokens after successful login
        if (result?.data?.accessToken) {
          await tokenStorage.setAccessToken(result.data.accessToken);
        }
        if (result?.data?.refreshToken) {
          await tokenStorage.setRefreshToken(result.data.refreshToken);
        }

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
          err instanceof Error
            ? err
            : new Error("An unexpected error occurred");
        setError(error);
        throw error;
      }
    },
    []
  );

  return {
    login,
    isLoading,
    error,
    validationErrors,
  };
};
