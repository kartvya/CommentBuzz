/**
 * Delete Post Use Case
 * Handles post deletion business logic
 */

import { IPostRepository } from "../post.repository";
import { DeletePostResponse } from "../post.entity";

export class DeletePostUseCase {
  constructor(private postRepository: IPostRepository) {}

  async execute(postId: string): Promise<DeletePostResponse> {
    return await this.postRepository.deletePost(postId);
  }
}

