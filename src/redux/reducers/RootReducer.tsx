import { combineReducers, Reducer } from "redux";
import { Action } from "@reduxjs/toolkit";
import { AuthState, authReducer } from "./AuthReducer";
import { CommunityReducer, CommunityState } from "./CommunityReducer";

interface RootState {
  authReducer: AuthState;
  CommunityReducer: CommunityState;
}

const appReducer = combineReducers({
  authReducer,
  CommunityReducer,
});

const rootReducer: Reducer<RootState | undefined, Action> = (state, action) => {
  // if (action.type === HASTOKEN && action.payload === false) {
  //   return appReducer(undefined, action);
  // }

  return appReducer(state, action);
};

export type { RootState };
export default rootReducer;
