/**
 * Get Comments Use Case
 * Handles the business logic for fetching comments for a post
 */

import { ICommentRepository } from "../comment.repository";
import {
  GetCommentsRequest,
  GetCommentsResponse,
} from "../comment.entity";

export class GetCommentsUseCase {
  constructor(private commentRepository: ICommentRepository) {}

  async execute(postId: GetCommentsRequest): Promise<GetCommentsResponse> {
    return await this.commentRepository.getComments(postId);
  }
}

