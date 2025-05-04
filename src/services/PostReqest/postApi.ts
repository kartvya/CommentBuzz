import backendBaseApi from "../BackendBaseApi";
import { endPoints } from "../endPoints";

const PostService = backendBaseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    createPost: build.mutation<any, any>({
      query: (body) => {
        return {
          url: endPoints.CreatePost,
          method: "POST",
          body,
        };
      },
    }),

    getPost: build.query<any, void>({
      query: (limit) => ({
        url: endPoints.GetAllPost + `?page=1&limit=${limit}`,
        method: "GET",
      }),
      keepUnusedDataFor: 0,
    }),
  }),
});

export const { useCreatePostMutation, useLazyGetPostQuery } = PostService;
