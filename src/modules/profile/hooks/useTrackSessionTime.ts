/**
 * useTrackSessionTime Hook
 * React hook for tracking session time
 * Uses the TrackSessionTimeUseCase from the domain layer via DI container
 */

import { useState, useCallback } from "react";
import { getContainer, TOKENS } from "@/src/infrastructure/di";
import { TrackSessionTimeUseCase } from "../domain/usecases/trackSessionTime.usecase";
import { TrackSessionTimeRequest, TrackSessionTimeResponse } from "../domain/profile.entity";

interface UseTrackSessionTimeReturn {
  trackSessionTime: (sessionData: TrackSessionTimeRequest) => Promise<TrackSessionTimeResponse>;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook for tracking session time
 * @returns Object containing trackSessionTime function, loading state, and error
 */
export const useTrackSessionTime = (): UseTrackSessionTimeReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const trackSessionTime = useCallback(
    async (sessionData: TrackSessionTimeRequest): Promise<TrackSessionTimeResponse> => {
      setIsLoading(true);
      setError(null);

      try {
        const container = getContainer();
        const trackSessionTimeUseCase = container.resolve<TrackSessionTimeUseCase>(
          TOKENS.TrackSessionTimeUseCase
        );

        const result = await trackSessionTimeUseCase.execute(sessionData);
        setIsLoading(false);
        return result;
      } catch (err) {
        setIsLoading(false);
        const error =
          err instanceof Error ? err : new Error("An unexpected error occurred");
        setError(error);
        throw error;
      }
    },
    []
  );

  return {
    trackSessionTime,
    isLoading,
    error,
  };
};

