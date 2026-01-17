/**
 * useGetProfile Hook
 * React hook for fetching user profile
 * Uses the GetProfileUseCase from the domain layer via DI container
 */

import { useState, useCallback } from "react";
import { getContainer, TOKENS } from "@/src/infrastructure/di";
import { GetProfileUseCase } from "../domain/usecases/getProfile.usecase";
import { GetProfileResponse } from "../domain/profile.entity";

interface UseGetProfileReturn {
  getProfile: () => Promise<GetProfileResponse>;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook for fetching user profile
 * @returns Object containing getProfile function, loading state, and error
 */
export const useGetProfile = (): UseGetProfileReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getProfile = useCallback(async (): Promise<GetProfileResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const container = getContainer();
      const getProfileUseCase = container.resolve<GetProfileUseCase>(
        TOKENS.GetProfileUseCase
      );

      const result = await getProfileUseCase.execute();
      setIsLoading(false);
      return result;
    } catch (err) {
      setIsLoading(false);
      const error =
        err instanceof Error ? err : new Error("An unexpected error occurred");
      setError(error);
      throw error;
    }
  }, []);

  return {
    getProfile,
    isLoading,
    error,
  };
};

