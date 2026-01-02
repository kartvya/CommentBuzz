import backendBaseApi from "../BackendBaseApi";
import { endPoints } from "../endPoints";

const UserService = backendBaseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getUserProfileDetails: build.query<any, void>({
      query: () => ({
        url: endPoints.GetUserProfileDetails,
        method: "GET",
      }),
      keepUnusedDataFor: 0,
    }),

    editUserProfileDetails: build.mutation<any, any>({
      query: (body) => {
        return {
          url: endPoints.EditProfile,
          method: "PUT",
          body,
        };
      },
    }),

    trackSessionTime: build.mutation<
      any,
      { duration: number; sessionType?: "login" | "app_open" }
    >({
      query: (body) => {
        return {
          url: endPoints.TrackSessionTime,
          method: "POST",
          body,
        };
      },
    }),

    getWeeklyAverageTime: build.query<any, void>({
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
