/**
 * useGetPosts Hook
 * React hook for fetching posts
 * Uses the GetPostsUseCase from the domain layer via DI container
 */

import { useState, useCallback } from "react";
import { getContainer, TOKENS } from "@/src/infrastructure/di";
import { GetPostsUseCase } from "../domain/usecases/getPosts.usecase";
import { GetPostsResponse } from "../domain/post.entity";

interface UseGetPostsReturn {
  getPosts: (limit?: number) => Promise<GetPostsResponse>;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook for fetching posts
 * @returns Object containing getPosts function, loading state, and error
 */
export const useGetPosts = (): UseGetPostsReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getPosts = useCallback(
    async (limit: number = 10): Promise<GetPostsResponse> => {
      setIsLoading(true);
      setError(null);

      try {
        const container = getContainer();
        const getPostsUseCase = container.resolve<GetPostsUseCase>(
          TOKENS.GetPostsUseCase
        );

        const result = await getPostsUseCase.execute(limit);
        setIsLoading(false);
        return result;
      } catch (err) {
        setIsLoading(false);
        const error =
          err instanceof Error
            ? err
            : new Error("An unexpected error occurred");
        setError(error);
        console.error("[useGetPosts] Error details:", {
          message: error.message,
          name: error.name,
          stack: error.stack,
        });
        throw error;
      }
    },
    []
  );

  return {
    getPosts,
    isLoading,
    error,
  };
};
