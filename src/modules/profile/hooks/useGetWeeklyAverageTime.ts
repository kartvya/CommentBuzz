/**
 * useGetWeeklyAverageTime Hook
 * React hook for fetching weekly average time
 * Uses the GetWeeklyAverageTimeUseCase from the domain layer via DI container
 */

import { useState, useCallback } from "react";
import { getContainer, TOKENS } from "@/src/infrastructure/di";
import { GetWeeklyAverageTimeUseCase } from "../domain/usecases/getWeeklyAverageTime.usecase";
import { GetWeeklyAverageTimeResponse } from "../domain/profile.entity";

interface UseGetWeeklyAverageTimeReturn {
  getWeeklyAverageTime: () => Promise<GetWeeklyAverageTimeResponse>;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook for fetching weekly average time
 * @returns Object containing getWeeklyAverageTime function, loading state, and error
 */
export const useGetWeeklyAverageTime = (): UseGetWeeklyAverageTimeReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getWeeklyAverageTime = useCallback(async (): Promise<GetWeeklyAverageTimeResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const container = getContainer();
      const getWeeklyAverageTimeUseCase = container.resolve<GetWeeklyAverageTimeUseCase>(
        TOKENS.GetWeeklyAverageTimeUseCase
      );

      const result = await getWeeklyAverageTimeUseCase.execute();
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
    getWeeklyAverageTime,
    isLoading,
    error,
  };
};

