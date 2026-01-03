/**
 * Comment UI Slice
 * Redux Toolkit slice for comment-related UI state
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CommentState {
  // Add any comment-related UI state here if needed
  // For now, comments are managed through RTK Query cache
}

const initialState: CommentState = {};

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    // Add reducers for comment UI state if needed
  },
});

export const {} = commentSlice.actions;

export default commentSlice.reducer;

