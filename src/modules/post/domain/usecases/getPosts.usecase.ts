/**
 * Get Posts Use Case
 * Handles fetching all posts business logic
 */

import { IPostRepository } from "../post.repository";
import { GetPostsResponse } from "../post.entity";

export class GetPostsUseCase {
  constructor(private postRepository: IPostRepository) {}

  async execute(limit?: number): Promise<GetPostsResponse> {
    return await this.postRepository.getPosts(limit);
  }
}

