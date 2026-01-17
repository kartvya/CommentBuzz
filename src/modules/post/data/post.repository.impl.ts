/**
 * Post Repository Implementation
 * Implements IPostRepository using API client abstraction
 */

import { IPostRepository } from "../domain/post.repository";
import {
  CreatePostResponse,
  GetPostsResponse,
  GetPostByIdResponse,
  ToggleVoteRequest,
  ToggleVoteResponse,
  DeletePostResponse,
  GetOnlyUserPostResponse,
} from "../domain/post.entity";
import { IApiClient } from "../../../infrastructure/api/IApiClient";
import { endPoints } from "../../../infrastructure/api/endPoints";
import { mapToDomainError } from "../../../shared/errors";
import {
  CreatePostResponseDto,
  GetPostsResponseDto,
  GetPostByIdResponseDto,
  ToggleVotePostResponseDto,
  DeletePostResponseDto,
  GetOnlyUserPostResponseDto,
} from "../../../infrastructure/api/dtos";

export class PostRepositoryImpl implements IPostRepository {
  constructor(private apiClient: IApiClient) {}

  async createPost(formData: FormData): Promise<CreatePostResponse> {
    try {
      const response = await this.apiClient.post<CreatePostResponseDto>(
        endPoints.CreatePost,
        formData
      );
      return response.data as CreatePostResponse;
    } catch (error) {
      throw mapToDomainError(error);
    }
  }

  async getPosts(limit: number = 10): Promise<GetPostsResponse> {
    try {
      console.log("[PostRepository] Fetching posts with limit:", limit);
      const response = await this.apiClient.get<GetPostsResponseDto>(
        endPoints.GetAllPost,
        { page: 1, limit }
      );
      console.log("[PostRepository] Raw API response:", JSON.stringify(response, null, 2));
      
      // response.data is GetPostsResponseDto (the DTO from the API)
      const responseDto = response.data;
      
      if (responseDto?.data?.posts) {
        // Server returns { success: true, data: { posts: [...], total, page, totalPages } }
        const mappedResponse: GetPostsResponse = {
          success: responseDto.success ?? true,
          data: responseDto.data.posts,
          message: responseDto.message,
        };
        console.log("[PostRepository] Mapped response:", {
          success: mappedResponse.success,
          postCount: mappedResponse.data?.length ?? 0,
        });
        return mappedResponse;
      } else if (Array.isArray(responseDto?.data)) {
        // Fallback: if data is already an array (backward compatibility)
        return responseDto as GetPostsResponse;
      } else {
        console.warn("[PostRepository] Unexpected response structure:", responseDto);
        return {
          success: responseDto?.success ?? false,
          data: [],
          message: responseDto?.message ?? "No posts found",
        };
      }
    } catch (error) {
      console.error("[PostRepository] Error fetching posts:", error);
      throw mapToDomainError(error);
    }
  }

  async getPostById(postId: string): Promise<GetPostByIdResponse> {
    try {
      const response = await this.apiClient.get<GetPostByIdResponseDto>(
        `${endPoints.GetAllPost}/${postId}`
      );
      return response.data as GetPostByIdResponse;
    } catch (error) {
      throw mapToDomainError(error);
    }
  }

  async toggleVote(voteData: ToggleVoteRequest): Promise<ToggleVoteResponse> {
    try {
      const response = await this.apiClient.patch<ToggleVotePostResponseDto>(
        endPoints.ToggleVote,
        voteData
      );
      return response.data as ToggleVoteResponse;
    } catch (error) {
      throw mapToDomainError(error);
    }
  }

  async deletePost(postId: string): Promise<DeletePostResponse> {
    try {
      const response = await this.apiClient.delete<DeletePostResponseDto>(
        `${endPoints.DeletePost}/${postId}`
      );
      return response.data as DeletePostResponse;
    } catch (error) {
      throw mapToDomainError(error);
    }
  }

  async getOnlyUserPost(limit: number = 10): Promise<GetOnlyUserPostResponse> {
    try {
      const response = await this.apiClient.get<GetOnlyUserPostResponseDto>(
        endPoints.GetOnlyUserPost,
        { page: 1, limit }
      );
      return response.data as GetOnlyUserPostResponse;
    } catch (error) {
      throw mapToDomainError(error);
    }
  }
}
