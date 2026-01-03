import {
  fetchBaseQuery,
  retry,
  BaseQueryFn,
} from "@reduxjs/toolkit/query/react";
import { BaseUrl, endPoints } from "../api/endPoints";
import type { FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { NavigationContainerRef } from "@react-navigation/native";
import { navigateTo } from "../../shared/utils/navigation";
import { tokenStorage } from "../storage/tokenStorage";

let navigationRef: NavigationContainerRef<any> | null = null;

export const setNavigationRef = (ref: NavigationContainerRef<any>) => {
  navigationRef = ref;
};

const baseQuery = fetchBaseQuery({
  baseUrl: BaseUrl,
  prepareHeaders: async (headers, { type, extra }) => {
    headers.set("Accept", "application/json");

    // Only set Content-Type for JSON, not for FormData
    // FormData will be detected by checking if body is FormData instance
    if (type === "mutation") {
      const body = (extra as any)?.body;
      const isFormData = body instanceof FormData;

      if (!isFormData && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }
    }

    const token = await tokenStorage.getAccessToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
  timeout: 60000, // Increase timeout to 60 seconds for file uploads
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

    const refreshToken = await tokenStorage.getRefreshToken();

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
        await tokenStorage.setAccessToken(newAccessToken);

        // Retry the original query with new token
        result = await baseQuery(args, api, extraOptions);
      } else {
        console.log("Refresh token failed. Logging out.");

        await tokenStorage.clearAllTokens();

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

