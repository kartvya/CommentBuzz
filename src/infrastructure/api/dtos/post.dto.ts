/**
 * Post API DTOs
 * Data Transfer Objects for Post API endpoints
 */

/**
 * DTO for creating a post request
 * Note: FormData is a global in React Native
 * The actual request body is FormData with fields: description (string) and media (file)
 */
export type CreatePostRequestDto = FormData;

/**
 * DTO for create post response
 */
export interface CreatePostResponseDto {
  success: boolean;
  message?: string;
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
}

/**
 * DTO for get posts response
 */
export interface GetPostsResponseDto {
  success: boolean;
  data?: {
    posts: {
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
    }[];
    total: number;
    page: number;
    totalPages: number;
  };
  message?: string;
}

/**
 * DTO for get post by ID response
 */
export interface GetPostByIdResponseDto {
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
  message?: string;
}

/**
 * DTO for toggle vote request
 */
export interface ToggleVotePostRequestDto {
  postId: string;
  voteType: "upvote" | "downvote";
}

/**
 * DTO for toggle vote response
 */
export interface ToggleVotePostResponseDto {
  success: boolean;
  message?: string;
  data?: {
    post: {
      _id: string;
      upvotes: string[];
      downvotes: string[];
    };
  };
}

/**
 * DTO for delete post request (postId is passed as path parameter)
 */
export type DeletePostRequestDto = string;

/**
 * DTO for delete post response
 */
export interface DeletePostResponseDto {
  success: boolean;
  message?: string;
}

/**
 * DTO for get only user posts response
 */
export interface GetOnlyUserPostResponseDto {
  success: boolean;
  posts?: {
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
  }[];
  message?: string;
}
