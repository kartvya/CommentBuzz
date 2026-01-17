import backendBaseApi from "./baseApi";
import { endPoints } from "./endPoints";
import {
  GetUserProfileDetailsResponseDto,
  EditUserProfileDetailsRequestDto,
  EditUserProfileDetailsResponseDto,
  TrackSessionTimeRequestDto,
  TrackSessionTimeResponseDto,
  GetWeeklyAverageTimeResponseDto,
} from "./dtos";

const UserService = backendBaseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getUserProfileDetails: build.query<GetUserProfileDetailsResponseDto, void>({
      query: () => ({
        url: endPoints.GetUserProfileDetails,
        method: "GET",
      }),
      keepUnusedDataFor: 0,
    }),

    editUserProfileDetails: build.mutation<
      EditUserProfileDetailsResponseDto,
      EditUserProfileDetailsRequestDto
    >({
      query: (body) => {
        return {
          url: endPoints.EditProfile,
          method: "PUT",
          body,
        };
      },
    }),

    trackSessionTime: build.mutation<
      TrackSessionTimeResponseDto,
      TrackSessionTimeRequestDto
    >({
      query: (body) => {
        return {
          url: endPoints.TrackSessionTime,
          method: "POST",
          body,
        };
      },
    }),

    getWeeklyAverageTime: build.query<GetWeeklyAverageTimeResponseDto, void>({
      query: () => ({
        url: endPoints.GetWeeklyAverageTime,
        method: "GET",
      }),
      keepUnusedDataFor: 0,
    }),
  }),
});

export const {
  useLazyGetUserProfileDetailsQuery,
  useEditUserProfileDetailsMutation,
  useTrackSessionTimeMutation,
  useGetWeeklyAverageTimeQuery,
  useLazyGetWeeklyAverageTimeQuery,
} = UserService;

// Export the service for use in repository implementations
export default UserService;

