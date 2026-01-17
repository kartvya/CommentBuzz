/**
 * Comment Module Exports
 * Central export point for the comment module
 */

// Domain
export * from "./domain/comment.entity";
export * from "./domain/comment.repository";

// Type aliases for UI compatibility
import { Comment } from "./domain/comment.entity";
import { PostData } from "../post/domain/post.entity";

/**
 * UI-specific type combining post and comments data
 * This is a convenience type for screens that display both post and comments
 */
export interface CommentsPostData {
  success: boolean;
  post: PostData;
  comments: Comment[];
}

export type LocalComment = Comment & {
  isPending?: boolean;
  isError?: boolean;
};


// Export Comment as CommentsData for backward compatibility
export type CommentsData = Comment;

// Data - Only export interface, not implementation
// Implementation should be accessed via DI container
// Use cases are implementations and should not be exported - access via DI container

// UI
export { default as commentReducer } from "./ui/comment.slice";
