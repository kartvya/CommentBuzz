/**
 * useDeletePost Hook
 * React hook for deleting a post
 * Uses the DeletePostUseCase from the domain layer via DI container
 */

import { useState, useCallback } from "react";
import { getContainer, TOKENS } from "@/src/infrastructure/di";
import { DeletePostUseCase } from "../domain/usecases/deletePost.usecase";
import { DeletePostResponse } from "../domain/post.entity";

interface UseDeletePostReturn {
  deletePost: (postId: string) => Promise<DeletePostResponse>;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook for deleting a post
 * @returns Object containing deletePost function, loading state, and error
 */
export const useDeletePost = (): UseDeletePostReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deletePost = useCallback(
    async (postId: string): Promise<DeletePostResponse> => {
      setIsLoading(true);
      setError(null);

      try {
        const container = getContainer();
        const deletePostUseCase = container.resolve<DeletePostUseCase>(
          TOKENS.DeletePostUseCase
        );

        const result = await deletePostUseCase.execute(postId);
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
    deletePost,
    isLoading,
    error,
  };
};

