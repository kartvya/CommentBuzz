/**
 * Get Profile Use Case
 * Handles the business logic for fetching user profile
 */

import { IProfileRepository } from "../profile.repository";
import { GetProfileResponse } from "../profile.entity";

export class GetProfileUseCase {
  constructor(private profileRepository: IProfileRepository) {}

  async execute(): Promise<GetProfileResponse> {
    return await this.profileRepository.getProfile();
  }
}

