/**
 * useGetPostById Hook
 * React hook for fetching a single post by ID
 * Uses the GetPostByIdUseCase from the domain layer via DI container
 */

import { useState, useCallback } from "react";
import { getContainer, TOKENS } from "@/src/infrastructure/di";
import { GetPostByIdUseCase } from "../domain/usecases/getPostById.usecase";
import { GetPostByIdResponse } from "../domain/post.entity";

interface UseGetPostByIdReturn {
  getPostById: (postId: string) => Promise<GetPostByIdResponse>;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook for fetching a post by ID
 * @returns Object containing getPostById function, loading state, and error
 */
export const useGetPostById = (): UseGetPostByIdReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getPostById = useCallback(
    async (postId: string): Promise<GetPostByIdResponse> => {
      setIsLoading(true);
      setError(null);

      try {
        const container = getContainer();
        const getPostByIdUseCase = container.resolve<GetPostByIdUseCase>(
          TOKENS.GetPostByIdUseCase
        );

        const result = await getPostByIdUseCase.execute(postId);
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
    getPostById,
    isLoading,
    error,
  };
};

