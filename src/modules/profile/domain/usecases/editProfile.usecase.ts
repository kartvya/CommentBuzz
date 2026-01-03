/**
 * Edit Profile Use Case
 * Handles the business logic for editing user profile
 */

import { IProfileRepository } from "../profile.repository";
import {
  EditProfileRequest,
  EditProfileResponse,
} from "../profile.entity";

export class EditProfileUseCase {
  constructor(private profileRepository: IProfileRepository) {}

  async execute(
    profileData: EditProfileRequest
  ): Promise<EditProfileResponse> {
    return await this.profileRepository.editProfile(profileData);
  }
}

