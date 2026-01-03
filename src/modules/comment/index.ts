/**
 * Comment Module Exports
 * Central export point for the comment module
 */

// Domain
export * from "./domain/comment.entity";
export * from "./domain/comment.repository";
export * from "./domain/usecases/createComment.usecase";
export * from "./domain/usecases/getComments.usecase";
export * from "./domain/usecases/deleteComment.usecase";
export * from "./domain/usecases/toggleVote.usecase";
export * from "./domain/usecases/getOnlyUserComments.usecase";

// Data
export * from "./data/comment.repository.impl";

// UI
export { default as commentReducer } from "./ui/comment.slice";

