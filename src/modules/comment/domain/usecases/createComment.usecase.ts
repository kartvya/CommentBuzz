/**
 * Create Comment Use Case
 * Handles the business logic for creating a comment
 */

import { ICommentRepository } from "../comment.repository";
import {
  CreateCommentRequest,
  CreateCommentResponse,
} from "../comment.entity";

export class CreateCommentUseCase {
  constructor(private commentRepository: ICommentRepository) {}

  async execute(
    commentData: CreateCommentRequest
  ): Promise<CreateCommentResponse> {
    return await this.commentRepository.createComment(commentData);
  }
}

