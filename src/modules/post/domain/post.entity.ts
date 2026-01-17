/**
 * Post Domain Entities
 * Defines the core domain types for posts
 */

export interface PostUser {
  _id: string;
  username: string;
  profilePic: string;
}

export interface PostData {
  _id: string;
  user: PostUser;
  description: string;
  media: string[];
  upvotes: string[];
  downvotes: string[];
  views: number;
  buzzCoinsEarned: number;
  comments: string[]; // Array of comment IDs
  createdAt: string;
  updatedAt: string;
  commentCount: number;
  __v: number;
}

export interface Post {
  _id: string;
  user: PostUser;
  description: string;
  media: string[];
  upvotes: string[];
  downvotes: string[];
  views: number;
  buzzCoinsEarned: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostRequest {
  description?: string;
  media?: string[];
  files?: {
    uri: string;
    mimeType?: string; // Raw mime type from image picker (e.g., "image/jpeg", "video/mp4")
    type?: string; // Raw type from image picker (e.g., "image", "video")
  };
}

export interface CreatePostResponse {
  success: boolean;
  message: string;
  post?: PostData;
}

export interface GetPostsResponse {
  success: boolean;
  data?: PostData[];
  message?: string;
}

export interface GetPostByIdResponse {
  success: boolean;
  post?: PostData;
  message?: string;
}

export interface ToggleVoteRequest {
  postId: string;
  voteType: "upvote" | "downvote";
}

export interface ToggleVoteResponseData {
  post: {
    _id: string;
    upvotes: string[];
    downvotes: string[];
  };
}

export interface ToggleVoteResponse {
  success: boolean;
  message?: string;
  data?: ToggleVoteResponseData;
}

export interface DeletePostResponse {
  success: boolean;
  message?: string;
}

export interface GetOnlyUserPostResponse {
  success: boolean;
  posts?: PostData[];
  message?: string;
}
