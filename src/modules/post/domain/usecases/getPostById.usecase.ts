/**
 * Get Post By ID Use Case
 * Handles fetching a single post by ID business logic
 */

import { IPostRepository } from "../post.repository";
import { GetPostByIdResponse } from "../post.entity";

export class GetPostByIdUseCase {
  constructor(private postRepository: IPostRepository) {}

  async execute(postId: string): Promise<GetPostByIdResponse> {
    return await this.postRepository.getPostById(postId);
  }
}

