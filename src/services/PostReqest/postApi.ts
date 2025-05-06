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

    toggleVotePost: build.mutation<any, any>({
      query: (body) => {
        return {
          url: endPoints.ToggleVote,
          method: "PATCH",
          body,
        };
      },
    }),

    deletePost: build.mutation<any, any>({
      query: (postID) => {
        return {
          url: `${endPoints.DeletePost}/${postID}`,
          method: "DELETE",
        };
      },
    }),

    getOnlyUserPost: build.query<any, void>({
      query: (limit) => ({
        url: endPoints.GetOnlyUserPost + `?page=1&limit=${limit}`,
        method: "GET",
      }),
      keepUnusedDataFor: 0,
    }),

    getPostById: build.query<any, void>({
      query: (postId) => ({
        url: endPoints.GetAllPost + "/" + postId,
        method: "GET",
      }),
      keepUnusedDataFor: 0,
    }),
  }),
});

export const {
  useCreatePostMutation,
  useLazyGetPostQuery,
  useToggleVotePostMutation,
  useDeletePostMutation,
  useLazyGetOnlyUserPostQuery,
  useLazyGetPostByIdQuery,
} = PostService;
