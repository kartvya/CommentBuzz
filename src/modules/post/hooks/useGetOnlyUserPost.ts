/**
 * useGetOnlyUserPost Hook
 * React hook for fetching only user's posts
 * Uses the GetOnlyUserPostUseCase from the domain layer via DI container
 */

import { useState, useCallback } from "react";
import { getContainer, TOKENS } from "@/src/infrastructure/di";
import { GetOnlyUserPostUseCase } from "../domain/usecases/getOnlyUserPost.usecase";
import { GetOnlyUserPostResponse } from "../domain/post.entity";

interface UseGetOnlyUserPostReturn {
  getOnlyUserPost: (limit?: number) => Promise<GetOnlyUserPostResponse>;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook for fetching only user's posts
 * @returns Object containing getOnlyUserPost function, loading state, and error
 */
export const useGetOnlyUserPost = (): UseGetOnlyUserPostReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getOnlyUserPost = useCallback(
    async (limit: number = 10): Promise<GetOnlyUserPostResponse> => {
      setIsLoading(true);
      setError(null);

      try {
        const container = getContainer();
        const getOnlyUserPostUseCase = container.resolve<GetOnlyUserPostUseCase>(
          TOKENS.GetOnlyUserPostUseCase
        );

        const result = await getOnlyUserPostUseCase.execute(limit);
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
    getOnlyUserPost,
    isLoading,
    error,
  };
};

