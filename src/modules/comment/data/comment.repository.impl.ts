/**
 * Comment Repository Implementation
 * Implements ICommentRepository using API client abstraction
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
import { IApiClient } from "../../../infrastructure/api/IApiClient";
import { endPoints } from "../../../infrastructure/api/endPoints";
import { mapToDomainError } from "../../../shared/errors";
import {
  CreateCommentResponseDto,
  GetPostCommentsResponseDto,
  DeleteCommentResponseDto,
  ToggleCommentVoteResponseDto,
  GetOnlyUserCommentsResponseDto,
} from "../../../infrastructure/api/dtos";

export class CommentRepositoryImpl implements ICommentRepository {
  constructor(private apiClient: IApiClient) {}
  async createComment(
    commentData: CreateCommentRequest
  ): Promise<CreateCommentResponse> {
    try {
      const response = await this.apiClient.post<CreateCommentResponseDto>(
        endPoints.CreateComment,
        commentData
      );
      return response.data as CreateCommentResponse;
    } catch (error) {
      throw mapToDomainError(error);
    }
  }

  async getComments(
    request: GetCommentsRequest
  ): Promise<GetCommentsResponse> {
    try {
      const postId = typeof request === "string" ? request : request.postId;
      const response = await this.apiClient.get<GetPostCommentsResponseDto>(
        `${endPoints.GetPostComments}/${postId}`
      );
      return response.data as GetCommentsResponse;
    } catch (error) {
      throw mapToDomainError(error);
    }
  }

  async deleteComment(commentId: string): Promise<DeleteCommentResponse> {
    try {
      const response = await this.apiClient.delete<DeleteCommentResponseDto>(
        `${endPoints.DeleteComment}/${commentId}`
      );
      return response.data as DeleteCommentResponse;
    } catch (error) {
      throw mapToDomainError(error);
    }
  }

  async toggleVote(
    voteData: ToggleCommentVoteRequest
  ): Promise<ToggleCommentVoteResponse> {
    try {
      const response = await this.apiClient.patch<ToggleCommentVoteResponseDto>(
        endPoints.ToggleCommentVote,
        voteData
      );
      return response.data as ToggleCommentVoteResponse;
    } catch (error) {
      throw mapToDomainError(error);
    }
  }

  async getOnlyUserComments(
    limit: number = 10
  ): Promise<GetOnlyUserCommentsResponse> {
    try {
      const response = await this.apiClient.get<GetOnlyUserCommentsResponseDto>(
        endPoints.GetOnlyUserComments,
        { page: 1, limit }
      );
      return response.data as GetOnlyUserCommentsResponse;
    } catch (error) {
      throw mapToDomainError(error);
    }
  }
}

