import { createApi, fetchBaseQuery, FetchBaseQueryMeta } from "@reduxjs/toolkit/query/react";
import { BaseUrl, endPoints } from "./endPoints";
import { tokenStorage } from "../storage/tokenStorage";
import {
  LoginRequestDto,
  LoginApiResponseDto,
  LoginResponseDto,
  SignupRequestDto,
  SignupResponseDto,
  RefreshTokenRequestDto,
  RefreshTokenResponseDto,
} from "./dtos";

const AuthApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BaseUrl,
    prepareHeaders: async (headers, { getState }) => {
      const token = await tokenStorage.getAccessToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginApiResponseDto, LoginRequestDto>({
      query: (body) => ({
        url: endPoints.Login,
        method: "POST",
        body,
      }),
      transformResponse: (response: LoginResponseDto, meta: FetchBaseQueryMeta | undefined) => {
        const authHeader = meta?.response?.headers.get("Authorization") || "";
        return {
          data: response,
          authHeader,
        };
      },
    }),

    refreshToken: builder.mutation<
      RefreshTokenResponseDto,
      RefreshTokenRequestDto
    >({
      query: ({ refreshToken }) => ({
        url: endPoints.RefreshToken,
        method: "POST",
        body: { refreshToken },
      }),
      transformResponse: (response: RefreshTokenResponseDto) => {
        return { accessToken: response.accessToken };
      },
    }),

    register: builder.mutation<SignupResponseDto, SignupRequestDto>({
      query: (body) => ({
        url: endPoints.Register,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRefreshTokenMutation,
  useRegisterMutation,
} = AuthApi;
export default AuthApi;

