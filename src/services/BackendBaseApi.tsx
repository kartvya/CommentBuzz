import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAutoRefresh } from "./BaseQueryWithReauth";

export const TAGS = Object.freeze({
  Stands: "Stands",
});
const TAG_TYPES: string[] = Object.values(TAGS);

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
