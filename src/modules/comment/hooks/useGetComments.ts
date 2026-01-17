/**
 * useGetComments Hook
 * React hook for fetching comments
 * Uses the GetCommentsUseCase from the domain layer via DI container
 */

import { useState, useCallback } from "react";
import { getContainer, TOKENS } from "@/src/infrastructure/di";
import { GetCommentsUseCase } from "../domain/usecases/getComments.usecase";
import { GetCommentsRequest, GetCommentsResponse } from "../domain/comment.entity";

interface UseGetCommentsReturn {
  getComments: (request: GetCommentsRequest) => Promise<GetCommentsResponse>;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook for fetching comments
 * @returns Object containing getComments function, loading state, and error
 */
export const useGetComments = (): UseGetCommentsReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getComments = useCallback(
    async (request: GetCommentsRequest): Promise<GetCommentsResponse> => {
      setIsLoading(true);
      setError(null);

      try {
        const container = getContainer();
        const getCommentsUseCase = container.resolve<GetCommentsUseCase>(
          TOKENS.GetCommentsUseCase
        );

        const result = await getCommentsUseCase.execute(request);
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
    getComments,
    isLoading,
    error,
  };
};

