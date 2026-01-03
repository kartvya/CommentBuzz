/**
 * Delete Comment Use Case
 * Handles the business logic for deleting a comment
 */

import { ICommentRepository } from "../comment.repository";
import { DeleteCommentResponse } from "../comment.entity";

export class DeleteCommentUseCase {
  constructor(private commentRepository: ICommentRepository) {}

  async execute(commentId: string): Promise<DeleteCommentResponse> {
    return await this.commentRepository.deleteComment(commentId);
  }
}

