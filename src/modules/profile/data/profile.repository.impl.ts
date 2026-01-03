/**
 * Profile Repository Implementation
 * Implements IProfileRepository using RTK Query APIs
 */

import { IProfileRepository } from "../domain/profile.repository";
import {
  GetProfileResponse,
  EditProfileRequest,
  EditProfileResponse,
  TrackSessionTimeRequest,
  TrackSessionTimeResponse,
  GetWeeklyAverageTimeResponse,
} from "../domain/profile.entity";
import UserApi from "../../../infrastructure/api/userApi";
import { store } from "../../../redux/Store";

export class ProfileRepositoryImpl implements IProfileRepository {
  async getProfile(): Promise<GetProfileResponse> {
    const result = await store.dispatch(
      UserApi.endpoints.getUserProfileDetails.initiate(undefined)
    );
    if ("error" in result) {
      throw result.error;
    }
    return result.data as GetProfileResponse;
  }

  async editProfile(
    profileData: EditProfileRequest
  ): Promise<EditProfileResponse> {
    const result = await store.dispatch(
      UserApi.endpoints.editUserProfileDetails.initiate(profileData)
    );
    if ("error" in result) {
      throw result.error;
    }
    return result.data as EditProfileResponse;
  }

  async trackSessionTime(
    sessionData: TrackSessionTimeRequest
  ): Promise<TrackSessionTimeResponse> {
    const result = await store.dispatch(
      UserApi.endpoints.trackSessionTime.initiate(sessionData)
    );
    if ("error" in result) {
      throw result.error;
    }
    return result.data as TrackSessionTimeResponse;
  }

  async getWeeklyAverageTime(): Promise<GetWeeklyAverageTimeResponse> {
    const result = await store.dispatch(
      UserApi.endpoints.getWeeklyAverageTime.initiate(undefined)
    );
    if ("error" in result) {
      throw result.error;
    }
    return result.data as GetWeeklyAverageTimeResponse;
  }
}

