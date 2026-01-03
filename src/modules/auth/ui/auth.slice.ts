/**
 * Auth UI Slice
 * Redux Toolkit slice for authentication UI state
 * Migrated from redux/reducers/AuthReducer.tsx
 */

import { createSlice, PayloadAction, Action } from "@reduxjs/toolkit";
import { AuthState, UserInfo } from "../domain/auth.entity";
import { USERINFO, ISDARKMODE, LOGOUT } from "../../../redux/actions/ActionType";

const initialState: AuthState = {
  userInfo: null,
  isDarkMode: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload;
    },
    setIsDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
    },
    logout: (state) => {
      state.userInfo = null;
      // Keep isDarkMode preference on logout
    },
  },
  extraReducers: (builder) => {
    // Handle legacy string-based actions for backward compatibility
    builder
      .addMatcher(
        (action: Action) => action.type === USERINFO,
        (state, action: PayloadAction<UserInfo>) => {
          state.userInfo = action.payload;
        }
      )
      .addMatcher(
        (action: Action) => action.type === ISDARKMODE,
        (state, action: PayloadAction<boolean>) => {
          state.isDarkMode = action.payload;
        }
      )
      .addMatcher(
        (action: Action) => action.type === LOGOUT,
        (state) => {
          state.userInfo = null;
        }
      );
  },
});

export const { setUserInfo, setIsDarkMode, logout } = authSlice.actions;

export default authSlice.reducer;

