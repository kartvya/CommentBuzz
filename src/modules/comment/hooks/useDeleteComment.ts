/**
 * useDeleteComment Hook
 * React hook for deleting a comment
 * Uses the DeleteCommentUseCase from the domain layer via DI container
 */

import { useState, useCallback } from "react";
import { getContainer, TOKENS } from "@/src/infrastructure/di";
import { DeleteCommentUseCase } from "../domain/usecases/deleteComment.usecase";
import { DeleteCommentResponse } from "../domain/comment.entity";

interface UseDeleteCommentReturn {
  deleteComment: (commentId: string) => Promise<DeleteCommentResponse>;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook for deleting a comment
 * @returns Object containing deleteComment function, loading state, and error
 */
export const useDeleteComment = (): UseDeleteCommentReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteComment = useCallback(
    async (commentId: string): Promise<DeleteCommentResponse> => {
      setIsLoading(true);
      setError(null);

      try {
        const container = getContainer();
        const deleteCommentUseCase = container.resolve<DeleteCommentUseCase>(
          TOKENS.DeleteCommentUseCase
        );

        const result = await deleteCommentUseCase.execute(commentId);
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
    deleteComment,
    isLoading,
    error,
  };
};

