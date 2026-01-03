/**
 * Get Weekly Average Time Use Case
 * Handles the business logic for fetching weekly average time
 */

import { IProfileRepository } from "../profile.repository";
import { GetWeeklyAverageTimeResponse } from "../profile.entity";

export class GetWeeklyAverageTimeUseCase {
  constructor(private profileRepository: IProfileRepository) {}

  async execute(): Promise<GetWeeklyAverageTimeResponse> {
    return await this.profileRepository.getWeeklyAverageTime();
  }
}

