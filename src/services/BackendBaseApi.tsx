import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { BaseUrl } from "./ApiEndpoints";
import { store } from "../redux/Store";

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
    // const token = store.getState().root?.authReducer.accessToken;
    // if (token !== null) {
    //   return headers.set("Authorization", `Bearer ${token}`);
    // } else {
    //   return headers;
    // }
  },
});

const baseQueryWithRetriesAndBailout = retry(
  async (args, api, options) => {
    const result = await baseQuery(args, api, options);
    // if (result.error?.status && Number(result.error.status) < 500) {
    //   retry.fail(result.error);
    // }

    return result;
  },
  { maxRetries: 5 }
);

const backendBaseApi = createApi({
  reducerPath: "primaPaintBackend",
  baseQuery: baseQueryWithRetriesAndBailout,
  endpoints: () => ({}),
  tagTypes: TAG_TYPES,
});

export const {
  util: { resetApiState: resetBackendApiState },
} = backendBaseApi;
export default backendBaseApi;
