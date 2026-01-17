/**
 * Profile Repository Interface
 * Defines the contract for profile operations
 */

import {
  GetProfileResponse,
  EditProfileRequest,
  EditProfileResponse,
  TrackSessionTimeRequest,
  TrackSessionTimeResponse,
  GetWeeklyAverageTimeResponse,
} from "./profile.entity";

export interface IProfileRepository {
  /**
   * Get user profile details
   */
  getProfile(): Promise<GetProfileResponse>;

  /**
   * Edit user profile details
   * @param formData - FormData containing profile information (username, bio, profilePic, gender)
   */
  editProfile(formData: FormData): Promise<EditProfileResponse>;

  /**
   * Track session time
   */
  trackSessionTime(
    sessionData: TrackSessionTimeRequest
  ): Promise<TrackSessionTimeResponse>;

  /**
   * Get weekly average time
   */
  getWeeklyAverageTime(): Promise<GetWeeklyAverageTimeResponse>;
}

