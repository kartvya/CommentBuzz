/**
 * Post Repository Implementation
 * Implements IPostRepository using RTK Query APIs
 */

import { IPostRepository } from "../domain/post.repository";
import {
  CreatePostRequest,
  CreatePostResponse,
  GetPostsResponse,
  GetPostByIdResponse,
  ToggleVoteRequest,
  ToggleVoteResponse,
  DeletePostResponse,
  GetOnlyUserPostResponse,
} from "../domain/post.entity";
import PostApi from "../../../infrastructure/api/postApi";
import { store } from "../../../redux/Store";

export class PostRepositoryImpl implements IPostRepository {
  async createPost(postData: CreatePostRequest): Promise<CreatePostResponse> {
    const result = await store.dispatch(
      PostApi.endpoints.createPost.initiate(postData)
    );
    if ("error" in result) {
      throw result.error;
    }
    return result.data as CreatePostResponse;
  }

  async getPosts(limit: number = 10): Promise<GetPostsResponse> {
    const result = await store.dispatch(
      PostApi.endpoints.getPost.initiate(limit)
    );
    if ("error" in result) {
      throw result.error;
    }
    return result.data as GetPostsResponse;
  }

  async getPostById(postId: string): Promise<GetPostByIdResponse> {
    const result = await store.dispatch(
      PostApi.endpoints.getPostById.initiate(postId)
    );
    if ("error" in result) {
      throw result.error;
    }
    return result.data as GetPostByIdResponse;
  }

  async toggleVote(voteData: ToggleVoteRequest): Promise<ToggleVoteResponse> {
    const result = await store.dispatch(
      PostApi.endpoints.toggleVotePost.initiate(voteData)
    );
    if ("error" in result) {
      throw result.error;
    }
    return result.data as ToggleVoteResponse;
  }

  async deletePost(postId: string): Promise<DeletePostResponse> {
    const result = await store.dispatch(
      PostApi.endpoints.deletePost.initiate(postId)
    );
    if ("error" in result) {
      throw result.error;
    }
    return result.data as DeletePostResponse;
  }

  async getOnlyUserPost(limit: number = 10): Promise<GetOnlyUserPostResponse> {
    const result = await store.dispatch(
      PostApi.endpoints.getOnlyUserPost.initiate(limit)
    );
    if ("error" in result) {
      throw result.error;
    }
    return result.data as GetOnlyUserPostResponse;
  }
}
