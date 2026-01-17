import backendBaseApi from "./baseApi";
import { endPoints } from "./endPoints";
import {
  CreatePostRequestDto,
  CreatePostResponseDto,
  GetPostsResponseDto,
  GetPostByIdResponseDto,
  ToggleVotePostRequestDto,
  ToggleVotePostResponseDto,
  DeletePostRequestDto,
  DeletePostResponseDto,
  GetOnlyUserPostResponseDto,
} from "./dtos";

const PostService = backendBaseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    createPost: build.mutation<CreatePostResponseDto, CreatePostRequestDto>({
      query: (body) => {
        return {
          url: endPoints.CreatePost,
          method: "POST",
          body,
        };
      },
    }),

    getPost: build.query<GetPostsResponseDto, number>({
      query: (limit) => ({
        url: endPoints.GetAllPost + `?page=1&limit=${limit}`,
        method: "GET",
      }),
      keepUnusedDataFor: 0,
    }),

    toggleVotePost: build.mutation<
      ToggleVotePostResponseDto,
      ToggleVotePostRequestDto
    >({
      query: (body) => {
        return {
          url: endPoints.ToggleVote,
          method: "PATCH",
          body,
        };
      },
    }),

    deletePost: build.mutation<DeletePostResponseDto, DeletePostRequestDto>({
      query: (postID) => {
        return {
          url: `${endPoints.DeletePost}/${postID}`,
          method: "DELETE",
        };
      },
    }),

    getOnlyUserPost: build.query<GetOnlyUserPostResponseDto, number>({
      query: (limit) => ({
        url: endPoints.GetOnlyUserPost + `?page=1&limit=${limit}`,
        method: "GET",
      }),
      keepUnusedDataFor: 0,
    }),

    getPostById: build.query<GetPostByIdResponseDto, string>({
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

// Export the service for use in repository implementations
export default PostService;

