/**
 * Toggle Vote Use Case
 * Handles voting on posts business logic
 */

import { IPostRepository } from "../post.repository";
import {
  ToggleVoteRequest,
  ToggleVoteResponse,
} from "../post.entity";

export class ToggleVoteUseCase {
  constructor(private postRepository: IPostRepository) {}

  async execute(voteData: ToggleVoteRequest): Promise<ToggleVoteResponse> {
    return await this.postRepository.toggleVote(voteData);
  }
}

