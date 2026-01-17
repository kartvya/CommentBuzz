/**
 * Auth UI Slice
 * Redux Toolkit slice for authentication UI state
 * Migrated from redux/reducers/AuthReducer.tsx
 */

import { createSlice, PayloadAction, isAnyOf } from "@reduxjs/toolkit";
import { AuthState, UserInfo } from "../domain/auth.entity";
import { USERINFO, ISDARKMODE } from "../../../redux/actions/ActionType";

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
    // Backward compatibility: handle old USERINFO action type
    builder.addMatcher(
      (action) => action.type === USERINFO,
      (state, action: PayloadAction<UserInfo>) => {
        state.userInfo = action.payload;
      }
    );
    // Backward compatibility: handle old LOGOUT action type
    builder.addMatcher(
      (action) => action.type === "LOGOUT",
      (state) => {
        state.userInfo = null;
      }
    );
    // Backward compatibility: handle old ISDARKMODE action type
    builder.addMatcher(
      (action) => action.type === ISDARKMODE,
      (state, action: PayloadAction<boolean>) => {
        state.isDarkMode = action.payload;
      }
    );
  },
});

export const { setUserInfo, setIsDarkMode, logout } = authSlice.actions;

export default authSlice.reducer;
