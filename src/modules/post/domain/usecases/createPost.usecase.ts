/**
 * Create Post Use Case
 * Handles post creation business logic
 */

import { IPostRepository } from "../post.repository";
import {
  CreatePostRequest,
  CreatePostResponse,
} from "../post.entity";

export class CreatePostUseCase {
  constructor(private postRepository: IPostRepository) {}

  async execute(postData: CreatePostRequest): Promise<CreatePostResponse> {
    return await this.postRepository.createPost(postData);
  }
}

