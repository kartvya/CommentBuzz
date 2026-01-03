/**
 * Comment Repository Implementation
 * Implements ICommentRepository using RTK Query APIs
 */

import { ICommentRepository } from "../domain/comment.repository";
import {
  CreateCommentRequest,
  CreateCommentResponse,
  GetCommentsRequest,
  GetCommentsResponse,
  DeleteCommentResponse,
  ToggleCommentVoteRequest,
  ToggleCommentVoteResponse,
  GetOnlyUserCommentsResponse,
} from "../domain/comment.entity";
import PostApi from "../../../infrastructure/api/postApi";
import { store } from "../../../redux/Store";

export class CommentRepositoryImpl implements ICommentRepository {
  async createComment(
    commentData: CreateCommentRequest
  ): Promise<CreateCommentResponse> {
    const result = await store.dispatch(
      PostApi.endpoints.uploadComment.initiate(commentData)
    );
    if ("error" in result) {
      throw result.error;
    }
    return result.data as CreateCommentResponse;
  }

  async getComments(
    request: GetCommentsRequest
  ): Promise<GetCommentsResponse> {
    const postId = typeof request === "string" ? request : request.postId;
    const result = await store.dispatch(
      PostApi.endpoints.getPostComments.initiate(postId)
    );
    if ("error" in result) {
      throw result.error;
    }
    return result.data as GetCommentsResponse;
  }

  async deleteComment(commentId: string): Promise<DeleteCommentResponse> {
    const result = await store.dispatch(
      PostApi.endpoints.deleteComment.initiate(commentId)
    );
    if ("error" in result) {
      throw result.error;
    }
    return result.data as DeleteCommentResponse;
  }

  async toggleVote(
    voteData: ToggleCommentVoteRequest
  ): Promise<ToggleCommentVoteResponse> {
    const result = await store.dispatch(
      PostApi.endpoints.toggleCommentVote.initiate(voteData)
    );
    if ("error" in result) {
      throw result.error;
    }
    return result.data as ToggleCommentVoteResponse;
  }

  async getOnlyUserComments(
    limit: number = 10
  ): Promise<GetOnlyUserCommentsResponse> {
    const result = await store.dispatch(
      PostApi.endpoints.getOnlyUsersComments.initiate(limit)
    );
    if ("error" in result) {
      throw result.error;
    }
    return result.data as GetOnlyUserCommentsResponse;
  }
}

