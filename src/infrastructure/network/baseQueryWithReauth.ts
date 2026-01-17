import {
  fetchBaseQuery,
  retry,
  BaseQueryFn,
} from "@reduxjs/toolkit/query/react";
import { BaseUrl, endPoints } from "../api/endPoints";
import type { FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { tokenStorage } from "../storage/tokenStorage";

/**
 * NOTE: This file contains legacy RTK Query code that may still be used
 * by some parts of the application. The primary API client is RtkQueryApiClient
 * which implements IApiClient interface. This baseQuery is kept for
 * backward compatibility with any remaining RTK Query hooks.
 */

interface ExtraOptions {
  body?: unknown;
}

const baseQuery = fetchBaseQuery({
  baseUrl: BaseUrl,
  prepareHeaders: async (headers, { type, extra }) => {
    headers.set("Accept", "application/json");

    // Only set Content-Type for JSON, not for FormData
    // FormData will be detected by checking if body is FormData instance
    if (type === "mutation") {
      const extraOptions = extra as ExtraOptions | undefined;
      const body = extraOptions?.body;
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
        interface RefreshTokenResponse {
          accessToken: string;
        }
        const refreshData = refreshResult.data as RefreshTokenResponse;
        const newAccessToken = refreshData.accessToken;

        // Store new token
        await tokenStorage.setAccessToken(newAccessToken);

        // Retry the original query with new token
        result = await baseQuery(args, api, extraOptions);
      } else {
        console.log("Refresh token failed. Logout required.");

        await tokenStorage.clearAllTokens();

        // Return error - UI layer should handle navigation
        // This is legacy code - new code should use RtkQueryApiClient
        return {
          error: {
            status: 401,
            data: { message: "Session expired. Please login again" },
          },
        };
      }
    }
  }

  return result;
};

export const baseQueryWithAutoRefresh = retry(baseQueryWithReauth, {
  maxRetries: 1,
});
