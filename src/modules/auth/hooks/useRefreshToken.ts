/**
 * useRefreshToken Hook
 * React hook for refreshing authentication tokens
 * Uses the RefreshTokenUseCase from the domain layer via DI container
 */

import { useState, useCallback } from "react";
import { getContainer, TOKENS } from "@/src/infrastructure/di";
import { RefreshTokenUseCase } from "../domain/usecases/refresh.usecase";
import {
  RefreshTokenRequest,
  RefreshTokenResponse,
} from "../domain/auth.entity";

interface UseRefreshTokenReturn {
  refreshToken: (
    refreshToken: RefreshTokenRequest
  ) => Promise<RefreshTokenResponse>;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook for refreshing authentication tokens
 * @returns Object containing refreshToken function, loading state, and error
 */
export const useRefreshToken = (): UseRefreshTokenReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refreshToken = useCallback(
    async (
      refreshTokenRequest: RefreshTokenRequest
    ): Promise<RefreshTokenResponse> => {
      setIsLoading(true);
      setError(null);

      try {
        const container = getContainer();
        const refreshTokenUseCase = container.resolve<RefreshTokenUseCase>(
          TOKENS.RefreshTokenUseCase
        );

        const result = await refreshTokenUseCase.execute(refreshTokenRequest);
        setIsLoading(false);
        return result;
      } catch (err) {
        setIsLoading(false);

        // Handle errors
        const error =
          err instanceof Error ? err : new Error("An unexpected error occurred");
        setError(error);
        throw error;
      }
    },
    []
  );

  return {
    refreshToken,
    isLoading,
    error,
  };
};

