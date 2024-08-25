import { combineReducers, Reducer } from "redux";
import { Action } from "@reduxjs/toolkit";
import { AuthState, authReducer } from "./AuthReducer";
import backendBaseApi from "../../services/BackendBaseApi";
import { CommunityReducer, CommunityState } from "./CommunityReducer";

interface RootState {
  authReducer: AuthState;
  CommunityReducer: CommunityState;
}

const appReducer = combineReducers({
  [backendBaseApi.reducerPath]: backendBaseApi.reducer,
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
