import AsyncStorage from "@react-native-async-storage/async-storage";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BaseUrl, endPoints } from "../endPoints";

interface LoginResponse {
  success: boolean;
  message: string;
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

interface LoginApiResponse {
  data: LoginResponse;
  authHeader: string;
}

const AuthApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BaseUrl,
    prepareHeaders: async (headers, { getState }) => {
      const token = await AsyncStorage.getItem("UserToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginApiResponse, Record<string, any>>({
      query: (body) => ({
        url: endPoints.Login,
        method: "POST",
        body,
      }),
      transformResponse: (response: LoginResponse, meta) => {
        const authHeader = meta?.response?.headers.get("Authorization") || "";
        return {
          data: response,
          authHeader,
        };
      },
    }),

    // Refresh Token API
    refreshToken: builder.mutation<
      { accessToken: string },
      { refreshToken: string }
    >({
      query: ({ refreshToken }) => ({
        url: endPoints.RefreshToken,
        method: "POST",
        body: { refreshToken },
      }),
      transformResponse: (response: { accessToken: string }) => {
        return { accessToken: response.accessToken };
      },
    }),
  }),
});

export const { useLoginMutation, useRefreshTokenMutation } = AuthApi;
export default AuthApi;
