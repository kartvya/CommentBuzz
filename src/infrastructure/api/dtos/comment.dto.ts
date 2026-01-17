/**
 * Comment API DTOs
 * Data Transfer Objects for Comment API endpoints
 */

/**
 * DTO for get post comments response
 */
export interface GetPostCommentsResponseDto {
  success: boolean;
  post?: {
    _id: string;
    user: {
      _id: string;
      username: string;
      profilePic: string;
    };
    description: string;
    media: string[];
    upvotes: string[];
    downvotes: string[];
    views: number;
    buzzCoinsEarned: number;
    comments: string[];
    createdAt: string;
    updatedAt: string;
    commentCount: number;
    __v: number;
  };
  comments?: {
    _id: string;
    post: string;
    user: {
      _id: string;
      username: string;
      profilePic: string;
    };
    text: string;
    parentComment: string | null;
    upvotes: string[];
    downvotes: string[];
    buzzCoins: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }[];
  message?: string;
}

/**
 * DTO for create comment request
 */
export interface CreateCommentRequestDto {
  postId: string;
  description: string;
}

/**
 * DTO for create comment response
 */
export interface CreateCommentResponseDto {
  success: boolean;
  message?: string;
  comment?: {
    _id: string;
    post: string;
    user: {
      _id: string;
      username: string;
      profilePic: string;
    };
    text: string;
    parentComment: string | null;
    upvotes: string[];
    downvotes: string[];
    buzzCoins: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

/**
 * DTO for delete comment request (commentId is passed as path parameter)
 */
export type DeleteCommentRequestDto = string;

/**
 * DTO for delete comment response
 */
export interface DeleteCommentResponseDto {
  success: boolean;
  message?: string;
}

/**
 * DTO for toggle comment vote request
 */
export interface ToggleCommentVoteRequestDto {
  type: "upvote" | "downvote" | "none";
  userId: string;
  commentId: string;
}

/**
 * DTO for toggle comment vote response
 */
export interface ToggleCommentVoteResponseDto {
  success: boolean;
  message?: string;
  data?: {
    comment: {
      _id: string;
      upvotes: string[];
      downvotes: string[];
    };
  };
}

/**
 * DTO for get only user comments response
 */
export interface GetOnlyUserCommentsResponseDto {
  success: boolean;
  comments?: {
    _id: string;
    post: string;
    user: {
      _id: string;
      username: string;
      profilePic: string;
    };
    text: string;
    parentComment: string | null;
    upvotes: string[];
    downvotes: string[];
    buzzCoins: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }[];
  message?: string;
}
