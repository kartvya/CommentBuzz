/**
 * Comment Domain Entities
 * Defines the core domain types for comments
 */

export interface CommentUser {
  _id: string;
  username: string;
  profilePic: string;
}

export interface Comment {
  _id: string;
  post: string;
  user: CommentUser;
  text: string;
  parentComment: string | null;
  upvotes: string[];
  downvotes: string[];
  buzzCoins: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateCommentRequest {
  postId: string;
  description: string;
}

export interface CreateCommentResponse {
  success: boolean;
  message: string;
  comment?: Comment;
}

export interface GetCommentsRequest {
  postId: string;
}

export interface GetCommentsResponse {
  success: boolean;
  post?: {
    _id: string;
    user: CommentUser;
    description: string;
    media: string[];
    upvotes: string[];
    downvotes: string[];
    views: number;
    buzzCoinsEarned: number;
    comments: Comment[];
    createdAt: string;
    updatedAt: string;
    commentCount: number;
    __v: number;
  };
  comments?: Comment[];
  message?: string;
}

export interface DeleteCommentResponse {
  success: boolean;
  message?: string;
}

export interface ToggleCommentVoteRequest {
  commentId: string;
  voteType: "upvote" | "downvote";
}

export interface ToggleCommentVoteResponseData {
  upvotes: string[];
  downvotes: string[];
  buzzCoins: number;
}

export interface ToggleCommentVoteResponse {
  success: boolean;
  message?: string;
  data?: ToggleCommentVoteResponseData;
}

export interface GetOnlyUserCommentsResponse {
  success: boolean;
  comments?: Comment[];
  message?: string;
}
