import backendBaseApi from "./baseApi";
import { endPoints } from "./endPoints";
import {
  GetPostCommentsResponseDto,
  CreateCommentRequestDto,
  CreateCommentResponseDto,
  DeleteCommentRequestDto,
  DeleteCommentResponseDto,
  ToggleCommentVoteRequestDto,
  ToggleCommentVoteResponseDto,
  GetOnlyUserCommentsResponseDto,
} from "./dtos";

const CommentService = backendBaseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getPostComments: build.query<GetPostCommentsResponseDto, string>({
      query: (postId) => ({
        url: endPoints.GetPostComments + "/" + postId,
        method: "GET",
      }),
      keepUnusedDataFor: 0,
    }),

    uploadComment: build.mutation<
      CreateCommentResponseDto,
      CreateCommentRequestDto
    >({
      query: (body) => {
        return {
          url: endPoints.CreateComment,
          method: "POST",
          body,
        };
      },
    }),

    deleteComment: build.mutation<
      DeleteCommentResponseDto,
      DeleteCommentRequestDto
    >({
      query: (commentID) => {
        return {
          url: `${endPoints.DeleteComment}/${commentID}`,
          method: "DELETE",
        };
      },
    }),

    toggleCommentVote: build.mutation<
      ToggleCommentVoteResponseDto,
      ToggleCommentVoteRequestDto
    >({
      query: (body) => {
        return {
          url: endPoints.ToggleCommentVote,
          method: "PATCH",
          body,
        };
      },
    }),

    getOnlyUsersComments: build.query<GetOnlyUserCommentsResponseDto, number>({
      query: (limit) => ({
        url: endPoints.GetOnlyUserComments + `?page=1&limit=${limit}`,
        method: "GET",
      }),
      keepUnusedDataFor: 0,
    }),
  }),
});

export const {
  useLazyGetPostCommentsQuery,
  useUploadCommentMutation,
  useDeleteCommentMutation,
  useToggleCommentVoteMutation,
  useLazyGetOnlyUsersCommentsQuery,
} = CommentService;

// Export the service for use in repository implementations
export default CommentService;

