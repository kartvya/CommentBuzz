/**
 * Profile Domain Entities
 * Defines the core domain types for user profile
 */

export interface UserProfile {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  gender?: string;
  profilePic: string;
  bio: string;
  buzzCoins: number;
  followers: string[];
  following: string[];
}

export interface GetProfileResponse {
  success: boolean;
  user?: UserProfile;
  message?: string;
}

export interface EditProfileRequest {
  username?: string;
  email?: string;
  bio?: string;
  gender?: string;
  profilePic?: string;
}

export interface EditProfileResponse {
  success: boolean;
  message?: string;
  user?: UserProfile;
}

export interface TrackSessionTimeRequest {
  duration: number;
  sessionType?: "login" | "app_open";
}

export interface TrackSessionTimeResponse {
  success: boolean;
  message?: string;
}

export interface WeeklyAverageTime {
  averageTime: number;
  weekStart: string;
  weekEnd: string;
}

export interface GetWeeklyAverageTimeResponse {
  success: boolean;
  data?: WeeklyAverageTime[];
  message?: string;
}

