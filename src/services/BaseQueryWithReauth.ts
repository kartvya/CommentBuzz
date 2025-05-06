import {
  fetchBaseQuery,
  retry,
  BaseQueryFn,
} from "@reduxjs/toolkit/query/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BaseUrl, endPoints } from "./endPoints";
import type { FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { NavigationContainerRef } from "@react-navigation/native";
import { navigateTo } from "../helpers/navigation";

let navigationRef: NavigationContainerRef<any> | null = null;

export const setNavigationRef = (ref: NavigationContainerRef<any>) => {
  navigationRef = ref;
};

const baseQuery = fetchBaseQuery({
  baseUrl: BaseUrl,
  prepareHeaders: async (headers, { type }) => {
    headers.set("Accept", "application/json");

    if (type === "mutation" && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    const token = await AsyncStorage.getItem("UserToken");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
  timeout: 10000,
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // If token is expired
  if (result?.error?.status === 401) {
    console.log("Token expired. Attempting refresh...");

    const refreshToken = await AsyncStorage.getItem("RefreshToken");

    if (refreshToken) {
      // Try to get a new token
      const refreshResult = await baseQuery(
        {
          url: endPoints.RefreshToken,
          method: "POST",
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        const newAccessToken = (refreshResult.data as any).accessToken;

        // Store new token
        await AsyncStorage.setItem("UserToken", newAccessToken);

        // Retry the original query with new token
        result = await baseQuery(args, api, extraOptions);
      } else {
        console.log("Refresh token failed. Logging out.");

        await AsyncStorage.removeItem("UserToken");
        await AsyncStorage.removeItem("RefreshToken");

        // Navigate to the welcome screen
        navigateTo("/welcome");
      }
    }
  }

  return result;
};

export const baseQueryWithAutoRefresh = retry(baseQueryWithReauth, {
  maxRetries: 1,
});
