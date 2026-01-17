/**
 * useGetOnlyUserComments Hook
 * React hook for fetching only user's comments
 * Uses the GetOnlyUserCommentsUseCase from the domain layer via DI container
 */

import { useState, useCallback } from "react";
import { getContainer, TOKENS } from "@/src/infrastructure/di";
import { GetOnlyUserCommentsUseCase } from "../domain/usecases/getOnlyUserComments.usecase";
import { GetOnlyUserCommentsResponse } from "../domain/comment.entity";

interface UseGetOnlyUserCommentsReturn {
  getOnlyUserComments: (limit?: number) => Promise<GetOnlyUserCommentsResponse>;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook for fetching only user's comments
 * @returns Object containing getOnlyUserComments function, loading state, and error
 */
export const useGetOnlyUserComments = (): UseGetOnlyUserCommentsReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getOnlyUserComments = useCallback(
    async (limit: number = 10): Promise<GetOnlyUserCommentsResponse> => {
      setIsLoading(true);
      setError(null);

      try {
        const container = getContainer();
        const getOnlyUserCommentsUseCase = container.resolve<GetOnlyUserCommentsUseCase>(
          TOKENS.GetOnlyUserCommentsUseCase
        );

        const result = await getOnlyUserCommentsUseCase.execute(limit);
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
    getOnlyUserComments,
    isLoading,
    error,
  };
};

