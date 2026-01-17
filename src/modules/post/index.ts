/**
 * Post Module Public API
 * Exports all public types and interfaces for use in other modules
 */

export * from "./domain/post.entity";
export { default as postReducer } from "./ui/post.slice";
export * from "./ui/post.slice";
export type { PostState } from "./ui/post.slice";

