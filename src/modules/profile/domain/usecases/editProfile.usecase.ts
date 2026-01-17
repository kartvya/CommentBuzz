/**
 * Edit Profile Use Case
 * Handles the business logic for editing user profile including validation and FormData construction
 */

import { IProfileRepository } from "../profile.repository";
import { EditProfileRequest, EditProfileResponse } from "../profile.entity";
import { ValidationError } from "@/src/shared/errors/domain.errors";

/**
 * FormData file object structure for React Native
 * This matches the expected format for FormData.append() in React Native
 */
interface FormDataFile {
  uri: string;
  type: string;
  name: string;
}

export class EditProfileUseCase {
  private readonly MAX_BIO_LENGTH = 200;
  private readonly ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
  ];

  constructor(private profileRepository: IProfileRepository) {}

  /**
   * Validates profile edit request
   * @throws ValidationError if validation fails
   */
  private validateProfileData(profileData: EditProfileRequest): void {
    const errors: Record<string, string[]> = {};

    // Validate username if provided
    if (profileData.username !== undefined) {
      const trimmedUsername = profileData.username.trim();
      if (!trimmedUsername) {
        errors.username = ["Name is required"];
      }
    }

    // Validate bio length if provided
    if (profileData.bio !== undefined) {
      if (profileData.bio.length > this.MAX_BIO_LENGTH) {
        errors.bio = [
          `Bio must be less than ${this.MAX_BIO_LENGTH} characters`,
        ];
      }
    }

    // Validate that at least one field is being updated
    if (
      profileData.username === undefined &&
      profileData.bio === undefined &&
      profileData.profilePic === undefined &&
      profileData.gender === undefined
    ) {
      errors.general = ["At least one field must be provided for update"];
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError("Profile validation failed", errors);
    }
  }

  /**
   * Constructs FormData from EditProfileRequest
   * This is business logic as it defines how the data should be structured
   */
  private createEditProfileFormData(profileData: EditProfileRequest): FormData {
    const formData = new FormData();

    // Append username if provided
    if (profileData.username !== undefined) {
      formData.append("username", profileData.username.trim());
    }

    // Append bio if provided
    if (profileData.bio !== undefined) {
      formData.append("bio", profileData.bio);
    }

    // Append gender if provided
    if (profileData.gender !== undefined) {
      formData.append("gender", profileData.gender);
    }

    // Append profile picture if provided
    if (profileData.profilePic) {
      // profilePic is a URI string, convert to file object
      const fileName = profileData.profilePic.split("/").pop() || "profile.jpg";

      // Try to determine MIME type from file extension
      let mimeType = "image/jpeg"; // default
      const extension = fileName.toLowerCase().split(".").pop();
      if (extension === "png") {
        mimeType = "image/png";
      } else if (extension === "gif") {
        mimeType = "image/gif";
      } else if (extension === "jpg" || extension === "jpeg") {
        mimeType = "image/jpeg";
      }

      const fileObject: FormDataFile = {
        uri: profileData.profilePic,
        type: mimeType,
        name: fileName,
      };

      formData.append("profilePic", fileObject as unknown as Blob);
    }

    return formData;
  }

  /**
   * Executes the edit profile use case
   * Validates input, constructs FormData, and delegates to repository
   */
  async execute(profileData: EditProfileRequest): Promise<EditProfileResponse> {
    // Validate business rules
    this.validateProfileData(profileData);

    // Construct FormData (business logic for data structure)
    const formData = this.createEditProfileFormData(profileData);

    // Delegate to repository
    return await this.profileRepository.editProfile(formData);
  }
}
