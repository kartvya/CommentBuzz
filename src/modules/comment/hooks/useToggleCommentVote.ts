/**
 * useToggleCommentVote Hook
 * React hook for toggling vote on a comment
 * Uses the ToggleCommentVoteUseCase from the domain layer via DI container
 */

import { useState, useCallback } from "react";
import { getContainer, TOKENS } from "@/src/infrastructure/di";
import { ToggleCommentVoteUseCase } from "../domain/usecases/toggleVote.usecase";
import { ToggleCommentVoteRequest, ToggleCommentVoteResponse } from "../domain/comment.entity";

interface UseToggleCommentVoteReturn {
  toggleCommentVote: (voteData: ToggleCommentVoteRequest) => Promise<ToggleCommentVoteResponse>;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook for toggling vote on a comment
 * @returns Object containing toggleCommentVote function, loading state, and error
 */
export const useToggleCommentVote = (): UseToggleCommentVoteReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const toggleCommentVote = useCallback(
    async (voteData: ToggleCommentVoteRequest): Promise<ToggleCommentVoteResponse> => {
      setIsLoading(true);
      setError(null);

      try {
        const container = getContainer();
        const toggleCommentVoteUseCase = container.resolve<ToggleCommentVoteUseCase>(
          TOKENS.ToggleCommentVoteUseCase
        );

        const result = await toggleCommentVoteUseCase.execute(voteData);
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
    toggleCommentVote,
    isLoading,
    error,
  };
};

