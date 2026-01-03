/**
 * Get Only User Post Use Case
 * Handles fetching posts created by the current user business logic
 */

import { IPostRepository } from "../post.repository";
import { GetOnlyUserPostResponse } from "../post.entity";

export class GetOnlyUserPostUseCase {
  constructor(private postRepository: IPostRepository) {}

  async execute(limit?: number): Promise<GetOnlyUserPostResponse> {
    return await this.postRepository.getOnlyUserPost(limit);
  }
}

