/**
 * useLogout Hook
 * React hook for handling user logout
 * Uses the LogoutUseCase from the domain layer via DI container
 */

import { useState, useCallback } from "react";
import { getContainer, TOKENS } from "@/src/infrastructure/di";
import { LogoutUseCase } from "../domain/usecases/logout.usecase";

interface UseLogoutReturn {
  logout: () => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook for user logout
 * @returns Object containing logout function, loading state, and error
 */
export const useLogout = (): UseLogoutReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const container = getContainer();
      const logoutUseCase = container.resolve<LogoutUseCase>(
        TOKENS.LogoutUseCase
      );

      await logoutUseCase.execute();
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);

      // Handle errors
      const error =
        err instanceof Error ? err : new Error("An unexpected error occurred");
      setError(error);
      throw error;
    }
  }, []);

  return {
    logout,
    isLoading,
    error,
  };
};

