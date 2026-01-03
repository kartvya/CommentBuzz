/**
 * Post UI Slice
 * Redux Toolkit slice for post-related UI state
 * Migrated from redux/reducers/CommunityReducer.tsx
 */

import { createSlice, PayloadAction, Action } from "@reduxjs/toolkit";
import { PostData } from "../domain/post.entity";
import { ALLPOST, DISLIKEPOST, LIKEPOST, LOGOUT } from "../../../redux/actions/ActionType";

export interface PostState {
  posts: PostData[];
}

const initialState: PostState = {
  posts: [],
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<PostData[]>) => {
      state.posts = action.payload;
    },
    addPost: (state, action: PayloadAction<PostData>) => {
      state.posts.unshift(action.payload);
    },
    removePost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter((post) => post._id !== action.payload);
    },
    updatePost: (state, action: PayloadAction<PostData>) => {
      const index = state.posts.findIndex(
        (post) => post._id === action.payload._id
      );
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
    },
    likePost: (state, action: PayloadAction<string>) => {
      const post = state.posts.find((p) => p._id === action.payload);
      if (post) {
        // This is a simplified version - actual implementation should handle
        // upvote/downvote logic based on current state
        post.upvotes = post.upvotes || [];
        if (!post.upvotes.includes(action.payload)) {
          post.upvotes.push(action.payload);
        }
      }
    },
    dislikePost: (state, action: PayloadAction<string>) => {
      const post = state.posts.find((p) => p._id === action.payload);
      if (post) {
        // This is a simplified version - actual implementation should handle
        // upvote/downvote logic based on current state
        post.downvotes = post.downvotes || [];
        if (!post.downvotes.includes(action.payload)) {
          post.downvotes.push(action.payload);
        }
      }
    },
    clearPosts: (state) => {
      state.posts = [];
    },
  },
  extraReducers: (builder) => {
    // Handle legacy string-based actions for backward compatibility
    builder
      .addMatcher(
        (action: Action) => action.type === ALLPOST,
        (state, action: PayloadAction<PostData[]>) => {
          state.posts = action.payload;
        }
      )
      .addMatcher(
        (action: Action) => action.type === LIKEPOST,
        (state, action: PayloadAction<string>) => {
          const post = state.posts.find((p) => p._id === action.payload);
          if (post) {
            post.upvotes = post.upvotes || [];
            if (!post.upvotes.includes(action.payload)) {
              post.upvotes.push(action.payload);
            }
          }
        }
      )
      .addMatcher(
        (action: Action) => action.type === DISLIKEPOST,
        (state, action: PayloadAction<string>) => {
          const post = state.posts.find((p) => p._id === action.payload);
          if (post) {
            post.downvotes = post.downvotes || [];
            if (!post.downvotes.includes(action.payload)) {
              post.downvotes.push(action.payload);
            }
          }
        }
      )
      .addMatcher(
        (action: Action) => action.type === LOGOUT,
        (state) => {
          state.posts = [];
        }
      );
  },
});

export const {
  setPosts,
  addPost,
  removePost,
  updatePost,
  likePost,
  dislikePost,
  clearPosts,
} = postSlice.actions;

export default postSlice.reducer;

