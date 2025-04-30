import backendBaseApi from "../BackendBaseApi";
import { BaseUrl, endPoints } from "../endPoints";

interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
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

const AuthApi = backendBaseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    login: build.mutation<LoginApiResponse, Record<string, any>>({
      query: (credentials) => ({
        url: BaseUrl + endPoints.Login,
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: LoginResponse, meta): LoginApiResponse => {
        const authHeader = meta?.response?.headers.get("Authorization") || "";
        return {
          data: response,
          authHeader,
        };
      },
    }),
  }),
});

export const { useLoginMutation } = AuthApi;
