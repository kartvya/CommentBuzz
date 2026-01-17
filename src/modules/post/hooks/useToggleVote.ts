/**
 * useToggleVote Hook
 * React hook for toggling vote on a post
 * Uses the ToggleVoteUseCase from the domain layer via DI container
 */

import { useState, useCallback } from "react";
import { getContainer, TOKENS } from "@/src/infrastructure/di";
import { ToggleVoteUseCase } from "../domain/usecases/toggleVote.usecase";
import { ToggleVoteRequest, ToggleVoteResponse } from "../domain/post.entity";

interface UseToggleVoteReturn {
  toggleVote: (voteData: ToggleVoteRequest) => Promise<ToggleVoteResponse>;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook for toggling vote on a post
 * @returns Object containing toggleVote function, loading state, and error
 */
export const useToggleVote = (): UseToggleVoteReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const toggleVote = useCallback(
    async (voteData: ToggleVoteRequest): Promise<ToggleVoteResponse> => {
      setIsLoading(true);
      setError(null);

      try {
        const container = getContainer();
        const toggleVoteUseCase = container.resolve<ToggleVoteUseCase>(
          TOKENS.ToggleVoteUseCase
        );

        const result = await toggleVoteUseCase.execute(voteData);
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
    toggleVote,
    isLoading,
    error,
  };
};

