/**
 * Track Session Time Use Case
 * Handles the business logic for tracking user session time
 */

import { IProfileRepository } from "../profile.repository";
import {
  TrackSessionTimeRequest,
  TrackSessionTimeResponse,
} from "../profile.entity";

export class TrackSessionTimeUseCase {
  constructor(private profileRepository: IProfileRepository) {}

  async execute(
    sessionData: TrackSessionTimeRequest
  ): Promise<TrackSessionTimeResponse> {
    return await this.profileRepository.trackSessionTime(sessionData);
  }
}

