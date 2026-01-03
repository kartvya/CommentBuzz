/**
 * Get Only User Comments Use Case
 * Handles the business logic for fetching only the current user's comments
 */

import { ICommentRepository } from "../comment.repository";
import { GetOnlyUserCommentsResponse } from "../comment.entity";

export class GetOnlyUserCommentsUseCase {
  constructor(private commentRepository: ICommentRepository) {}

  async execute(limit: number = 10): Promise<GetOnlyUserCommentsResponse> {
    return await this.commentRepository.getOnlyUserComments(limit);
  }
}

