/**
 * Profile Module Exports
 * Central export point for the profile module
 */

// Domain
export * from "./domain/profile.entity";
export * from "./domain/profile.repository";

// Data - Only export interface, not implementation
// Implementation should be accessed via DI container
// Use cases are implementations and should not be exported - access via DI container

// UI
export { default as profileReducer } from "./ui/profile.slice";

// Hooks
export * from "./hooks";

