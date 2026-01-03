/**
 * Profile UI Slice
 * Redux Toolkit slice for profile-related UI state
 */

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserProfile } from "../domain/profile.entity";

interface ProfileState {
  // Add any profile-related UI state here if needed
  // For now, profile data is managed through RTK Query cache
}

const initialState: ProfileState = {};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    // Add reducers for profile UI state if needed
  },
});

export const {} = profileSlice.actions;

export default profileSlice.reducer;

