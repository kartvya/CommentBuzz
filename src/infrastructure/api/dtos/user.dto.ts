/**
 * User API DTOs
 * Data Transfer Objects for User API endpoints
 */

/**
 * DTO for get user profile details response
 */
export interface GetUserProfileDetailsResponseDto {
  success: boolean;
  user?: {
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
  };
  message?: string;
}

/**
 * DTO for edit user profile details request
 * Note: FormData is a global in React Native
 * The actual request body is FormData with fields: username, bio, profilePic (file)
 */
export type EditUserProfileDetailsRequestDto = FormData;

/**
 * DTO for edit user profile details response
 */
export interface EditUserProfileDetailsResponseDto {
  success: boolean;
  message?: string;
  user?: {
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
  };
}

/**
 * DTO for track session time request
 */
export interface TrackSessionTimeRequestDto {
  duration: number;
  sessionType?: "login" | "app_open";
}

/**
 * DTO for track session time response
 */
export interface TrackSessionTimeResponseDto {
  success: boolean;
  message?: string;
}

/**
 * DTO for weekly average time data
 */
export interface WeeklyAverageTimeDto {
  totalMinutes: number;
  averageMinutes: number;
  totalSessions: number;
  dailyBreakdown: Record<string, number>;
  sessions: Array<{
    timestamp: string;
    date: string;
    duration: number;
    sessionType?: string;
  }>;
}

/**
 * DTO for get weekly average time response
 */
export interface GetWeeklyAverageTimeResponseDto {
  success: boolean;
  data?: WeeklyAverageTimeDto;
  message?: string;
}
