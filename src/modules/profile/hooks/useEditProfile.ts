/**
 * useEditProfile Hook
 * React hook for editing user profile
 * Uses the EditProfileUseCase from the domain layer via DI container
 */

import { useState, useCallback } from "react";
import { getContainer, TOKENS } from "@/src/infrastructure/di";
import { EditProfileUseCase } from "../domain/usecases/editProfile.usecase";
import { EditProfileRequest, EditProfileResponse } from "../domain/profile.entity";
import { ValidationError } from "@/src/shared/errors/domain.errors";

interface UseEditProfileReturn {
  editProfile: (profileData: EditProfileRequest) => Promise<EditProfileResponse>;
  isLoading: boolean;
  error: Error | null;
  validationErrors: Record<string, string[]> | null;
}

/**
 * Hook for editing user profile
 * @returns Object containing editProfile function, loading state, error, and validation errors
 */
export const useEditProfile = (): UseEditProfileReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<
    string,
    string[]
  > | null>(null);

  const editProfile = useCallback(
    async (profileData: EditProfileRequest): Promise<EditProfileResponse> => {
      setIsLoading(true);
      setError(null);
      setValidationErrors(null);

      try {
        const container = getContainer();
        const editProfileUseCase = container.resolve<EditProfileUseCase>(
          TOKENS.EditProfileUseCase
        );

        const result = await editProfileUseCase.execute(profileData);
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
    editProfile,
    isLoading,
    error,
    validationErrors,
  };
};

