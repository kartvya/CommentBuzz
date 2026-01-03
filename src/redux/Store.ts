/**
 * Root Store Configuration
 * Consolidates all modules and maintains backward compatibility.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AnyAction, combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import { ThunkDispatch } from "redux-thunk";

import backendBaseApi from "../infrastructure/api/baseApi";
import AuthApi from "../infrastructure/api/authApi";
import "../infrastructure/api/postApi";
import "../infrastructure/api/userApi";

import authReducer from "../modules/auth/ui/auth.slice";
import postReducer from "../modules/post/ui/post.slice";
import commentReducer from "../modules/comment/ui/comment.slice";
import profileReducer from "../modules/profile/ui/profile.slice";

const rootReducer = combineReducers({
  [backendBaseApi.reducerPath]: backendBaseApi.reducer,
  [AuthApi.reducerPath]: AuthApi.reducer,
  auth: authReducer,
  post: postReducer,
  comment: commentReducer,
  profile: profileReducer,
});

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  blacklist: [backendBaseApi.reducerPath, AuthApi.reducerPath],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(backendBaseApi.middleware, AuthApi.middleware),
});

const persistor = persistStore(store as any);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunkDispatch = ThunkDispatch<RootState, never, AnyAction>;

type DispatchFunc = () => AppDispatch;

setupListeners(store.dispatch);

export const useAppDispatch: DispatchFunc = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export { persistor, store };
