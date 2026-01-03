/**
 * Post Repository Interface
 * Defines the contract for post operations
 */

import {
  CreatePostRequest,
  CreatePostResponse,
  GetPostsResponse,
  GetPostByIdResponse,
  ToggleVoteRequest,
  ToggleVoteResponse,
  DeletePostResponse,
  GetOnlyUserPostResponse,
} from "./post.entity";

export interface IPostRepository {
  /**
   * Create a new post
   */
  createPost(postData: CreatePostRequest): Promise<CreatePostResponse>;

  /**
   * Get all posts with pagination
   */
  getPosts(limit?: number): Promise<GetPostsResponse>;

  /**
   * Get a single post by ID
   */
  getPostById(postId: string): Promise<GetPostByIdResponse>;

  /**
   * Toggle vote (upvote/downvote) on a post
   */
  toggleVote(voteData: ToggleVoteRequest): Promise<ToggleVoteResponse>;

  /**
   * Delete a post
   */
  deletePost(postId: string): Promise<DeletePostResponse>;

  /**
   * Get only posts created by the current user
   */
  getOnlyUserPost(limit?: number): Promise<GetOnlyUserPostResponse>;
}

