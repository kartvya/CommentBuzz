/**
 * useCreatePost Hook
 * React hook for creating a post
 * Uses the CreatePostUseCase from the domain layer via DI container
 */

import { useState, useCallback } from "react";
import { getContainer, TOKENS } from "@/src/infrastructure/di";
import { CreatePostUseCase } from "../domain/usecases/createPost.usecase";
import { CreatePostRequest, CreatePostResponse } from "../domain/post.entity";
import { ValidationError } from "@/src/shared/errors/domain.errors";

interface UseCreatePostReturn {
  createPost: (postData: CreatePostRequest) => Promise<CreatePostResponse>;
  isLoading: boolean;
  error: Error | null;
  validationErrors: Record<string, string[]> | null;
}

/**
 * Hook for creating a post
 * @returns Object containing createPost function, loading state, error, and validation errors
 */
export const useCreatePost = (): UseCreatePostReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<
    string,
    string[]
  > | null>(null);

  const createPost = useCallback(
    async (postData: CreatePostRequest): Promise<CreatePostResponse> => {
      setIsLoading(true);
      setError(null);
      setValidationErrors(null);

      try {
        const container = getContainer();
        const createPostUseCase = container.resolve<CreatePostUseCase>(
          TOKENS.CreatePostUseCase
        );

        const result = await createPostUseCase.execute(postData);
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
    createPost,
    isLoading,
    error,
    validationErrors,
  };
};

