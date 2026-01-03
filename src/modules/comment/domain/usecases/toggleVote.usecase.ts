/**
 * Toggle Comment Vote Use Case
 * Handles the business logic for toggling a vote on a comment
 */

import { ICommentRepository } from "../comment.repository";
import {
  ToggleCommentVoteRequest,
  ToggleCommentVoteResponse,
} from "../comment.entity";

export class ToggleCommentVoteUseCase {
  constructor(private commentRepository: ICommentRepository) {}

  async execute(
    voteData: ToggleCommentVoteRequest
  ): Promise<ToggleCommentVoteResponse> {
    return await this.commentRepository.toggleVote(voteData);
  }
}

