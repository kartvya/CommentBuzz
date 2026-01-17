/**
 * useCreateComment Hook
 * React hook for creating a comment
 * Uses the CreateCommentUseCase from the domain layer via DI container
 */

import { useState, useCallback } from "react";
import { getContainer, TOKENS } from "@/src/infrastructure/di";
import { CreateCommentUseCase } from "../domain/usecases/createComment.usecase";
import { CreateCommentRequest, CreateCommentResponse } from "../domain/comment.entity";
import { ValidationError } from "@/src/shared/errors/domain.errors";

interface UseCreateCommentReturn {
  createComment: (commentData: CreateCommentRequest) => Promise<CreateCommentResponse>;
  isLoading: boolean;
  error: Error | null;
  validationErrors: Record<string, string[]> | null;
}

/**
 * Hook for creating a comment
 * @returns Object containing createComment function, loading state, error, and validation errors
 */
export const useCreateComment = (): UseCreateCommentReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<
    string,
    string[]
  > | null>(null);

  const createComment = useCallback(
    async (commentData: CreateCommentRequest): Promise<CreateCommentResponse> => {
      setIsLoading(true);
      setError(null);
      setValidationErrors(null);

      try {
        const container = getContainer();
        const createCommentUseCase = container.resolve<CreateCommentUseCase>(
          TOKENS.CreateCommentUseCase
        );

        const result = await createCommentUseCase.execute(commentData);
        setIsLoading(false);
        return result;
      } catch (err) {
        setIsLoading(false);

        // Handle validation errors
        if (err instanceof ValidationError) {
          setValidationErrors(err.validationErrors || null);
          setError(err);
          throw err;
        }

        // Handle other errors
        const error =
          err instanceof Error
            ? err
            : new Error("An unexpected error occurred");
        setError(error);
        throw error;
      }
    },
    []
  );

  return {
    createComment,
    isLoading,
    error,
    validationErrors,
  };
};

