import { combineReducers, Reducer } from "redux";
import { Action } from "@reduxjs/toolkit";
import { AuthState, authReducer } from "./AuthReducer";
import { FeedReducer, FeedState } from "./CommunityReducer";

interface RootState {
  authReducer: AuthState;
  FeedReducer: FeedState;
}

const appReducer = combineReducers({
  authReducer,
  FeedReducer,
});

const rootReducer: Reducer<RootState | undefined, Action> = (state, action) => {
  // if (action.type === HASTOKEN && action.payload === false) {
  //   return appReducer(undefined, action);
  // }

  return appReducer(state, action);
};

export type { RootState };
export default rootReducer;
