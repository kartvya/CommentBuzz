/**
 * Comment Repository Interface
 * Defines the contract for comment operations
 */

import {
  CreateCommentRequest,
  CreateCommentResponse,
  GetCommentsRequest,
  GetCommentsResponse,
  DeleteCommentResponse,
  ToggleCommentVoteRequest,
  ToggleCommentVoteResponse,
  GetOnlyUserCommentsResponse,
} from "./comment.entity";

export interface ICommentRepository {
  /**
   * Create a new comment on a post
   */
  createComment(
    commentData: CreateCommentRequest
  ): Promise<CreateCommentResponse>;

  /**
   * Get all comments for a post
   */
  getComments(postId: GetCommentsRequest): Promise<GetCommentsResponse>;

  /**
   * Delete a comment
   */
  deleteComment(commentId: string): Promise<DeleteCommentResponse>;

  /**
   * Toggle vote (upvote/downvote) on a comment
   */
  toggleVote(
    voteData: ToggleCommentVoteRequest
  ): Promise<ToggleCommentVoteResponse>;

  /**
   * Get only the current user's comments
   */
  getOnlyUserComments(limit?: number): Promise<GetOnlyUserCommentsResponse>;
}

