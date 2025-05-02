import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BaseUrl } from "./endPoints";
import { baseQueryWithAutoRefresh } from "./BaseQueryWithReauth";

export const TAGS = Object.freeze({
  Stands: "Stands",
});
const TAG_TYPES: string[] = Object.values(TAGS);

const baseQuery = fetchBaseQuery({
  baseUrl: `${BaseUrl}`,
  prepareHeaders: async (headers, { type }) => {
    headers.set("Accept", "application/json");
    if (type === "mutation") {
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }
    }
    const token = await AsyncStorage.getItem("UserToken");
    if (token !== null) {
      return headers.set("Authorization", `Bearer ${token}`);
    } else {
      return headers;
    }
  },
  timeout: 10000,
});

// const baseQueryWithRetriesAndBailout = retry(
//   async (args, api, options) => {
//     const result = await baseQuery(args, api, options);
//     return result;
//   },
//   { maxRetries: 2 }
// );

const backendBaseApi = createApi({
  reducerPath: "commentBuzzBackend",
  baseQuery: baseQueryWithAutoRefresh,
  endpoints: () => ({}),
  tagTypes: TAG_TYPES,
});

export const {
  util: { resetApiState: resetBackendApiState },
} = backendBaseApi;

export default backendBaseApi;
