/**
 * Create Post Use Case
 * Handles post creation business logic including validation and FormData construction
 */

import { IPostRepository } from "../post.repository";
import { CreatePostRequest, CreatePostResponse } from "../post.entity";
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

export class CreatePostUseCase {
  private readonly MAX_DESCRIPTION_LENGTH = 300;
  private readonly ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
  ];
  private readonly ALLOWED_VIDEO_TYPES = ["video/mp4", "video/quicktime"];

  constructor(private postRepository: IPostRepository) {}

  /**
   * Determines file type from raw file data
   * Business logic: determines if file is image or video based on mimeType or type field
   */
  private determineFileType(
    files: CreatePostRequest["files"]
  ): "image" | "video" {
    if (!files) {
      throw new ValidationError("Files are required for type determination");
    }

    // First try to determine from mimeType
    if (files.mimeType) {
      if (this.ALLOWED_IMAGE_TYPES.includes(files.mimeType.toLowerCase())) {
        return "image";
      }
      if (this.ALLOWED_VIDEO_TYPES.includes(files.mimeType.toLowerCase())) {
        return "video";
      }
    }

    // Fall back to type field if mimeType is not available
    if (files.type) {
      const normalizedType = files.type.toLowerCase();
      if (normalizedType === "image" || normalizedType.startsWith("image/")) {
        return "image";
      }
      if (normalizedType === "video" || normalizedType.startsWith("video/")) {
        return "video";
      }
    }

    // Try to infer from URI extension as last resort
    if (files.uri) {
      const uri = files.uri.toLowerCase();
      if (uri.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
        return "image";
      }
      if (uri.match(/\.(mp4|mov|avi|mkv)$/)) {
        return "video";
      }
    }

    throw new ValidationError(
      "Unable to determine file type. Please provide a valid image or video file."
    );
  }

  /**
   * Validates post creation request
   * @throws ValidationError if validation fails
   */
  private validatePostData(postData: CreatePostRequest): void {
    const errors: Record<string, string[]> = {};

    // Validate that at least description or files must be provided
    if (!postData.description?.trim() && !postData.files) {
      errors.general = ["Please share your thoughts or share some memory"];
    }

    // Validate description length if provided
    if (
      postData.description &&
      postData.description.length > this.MAX_DESCRIPTION_LENGTH
    ) {
      errors.description = [
        `Description must be at most ${this.MAX_DESCRIPTION_LENGTH} characters`,
      ];
    }

    // Validate file if provided
    if (postData.files) {
      if (!postData.files.uri || postData.files.uri.trim() === "") {
        errors.files = ["File URI is required"];
      } else {
        // Try to determine file type - this will throw if type cannot be determined
        try {
          this.determineFileType(postData.files);
        } catch (error) {
          if (error instanceof ValidationError) {
            errors.files = errors.files || [];
            errors.files.push(error.message);
          }
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError("Post validation failed", errors);
    }
  }

  /**
   * Constructs FormData from CreatePostRequest
   * This is business logic as it defines how the data should be structured
   */
  private createPostFormData(postData: CreatePostRequest): FormData {
    const formData = new FormData();

    // Append description if provided
    if (postData.description?.trim()) {
      formData.append("description", postData.description.trim());
    }

    // Append media file if provided
    if (postData.files) {
      // Determine file type (business logic)
      const fileType = this.determineFileType(postData.files);

      // Determine MIME type based on file type
      let mimeType: string;
      if (fileType === "image") {
        // Use provided mimeType if available and valid, otherwise default to image/jpeg
        mimeType =
          postData.files.mimeType &&
          this.ALLOWED_IMAGE_TYPES.includes(
            postData.files.mimeType.toLowerCase()
          )
            ? postData.files.mimeType
            : "image/jpeg";
      } else {
        // Use provided mimeType if available and valid, otherwise default to video/mp4
        mimeType =
          postData.files.mimeType &&
          this.ALLOWED_VIDEO_TYPES.includes(
            postData.files.mimeType.toLowerCase()
          )
            ? postData.files.mimeType
            : "video/mp4";
      }

      // Extract filename from URI
      const fileName = postData.files.uri.split("/").pop() || "file";

      const fileObject: FormDataFile = {
        uri: postData.files.uri,
        type: mimeType,
        name: fileName,
      };

      formData.append("media", fileObject as unknown as Blob);
    }

    return formData;
  }

  /**
   * Executes the post creation use case
   * Validates input, constructs FormData, and delegates to repository
   */
  async execute(postData: CreatePostRequest): Promise<CreatePostResponse> {
    // Validate business rules
    this.validatePostData(postData);

    // Construct FormData (business logic for data structure)
    const formData = this.createPostFormData(postData);

    // Delegate to repository
    return await this.postRepository.createPost(formData);
  }
}
