/**
 * Profile Repository Implementation
 * Implements IProfileRepository using API client abstraction
 */

import { IProfileRepository } from "../domain/profile.repository";
import {
  GetProfileResponse,
  EditProfileResponse,
  TrackSessionTimeRequest,
  TrackSessionTimeResponse,
  GetWeeklyAverageTimeResponse,
} from "../domain/profile.entity";
import { IApiClient } from "../../../infrastructure/api/IApiClient";
import { endPoints } from "../../../infrastructure/api/endPoints";
import { mapToDomainError } from "../../../shared/errors";
import {
  GetUserProfileDetailsResponseDto,
  EditUserProfileDetailsResponseDto,
  TrackSessionTimeResponseDto,
  GetWeeklyAverageTimeResponseDto,
} from "../../../infrastructure/api/dtos";

export class ProfileRepositoryImpl implements IProfileRepository {
  constructor(private apiClient: IApiClient) {}

  async getProfile(): Promise<GetProfileResponse> {
    try {
      const response = await this.apiClient.get<GetUserProfileDetailsResponseDto>(
        endPoints.GetUserProfileDetails
      );
      return response.data as GetProfileResponse;
    } catch (error) {
      throw mapToDomainError(error);
    }
  }

  async editProfile(formData: FormData): Promise<EditProfileResponse> {
    try {
      const response = await this.apiClient.put<EditUserProfileDetailsResponseDto>(
        endPoints.EditProfile,
        formData
      );
      return response.data as EditProfileResponse;
    } catch (error) {
      throw mapToDomainError(error);
    }
  }

  async trackSessionTime(
    sessionData: TrackSessionTimeRequest
  ): Promise<TrackSessionTimeResponse> {
    try {
      const response = await this.apiClient.post<TrackSessionTimeResponseDto>(
        endPoints.TrackSessionTime,
        sessionData
      );
      return response.data as TrackSessionTimeResponse;
    } catch (error) {
      throw mapToDomainError(error);
    }
  }

  async getWeeklyAverageTime(): Promise<GetWeeklyAverageTimeResponse> {
    try {
      const response = await this.apiClient.get<GetWeeklyAverageTimeResponseDto>(
        endPoints.GetWeeklyAverageTime
      );
      return response.data as GetWeeklyAverageTimeResponse;
    } catch (error) {
      throw mapToDomainError(error);
    }
  }
}
