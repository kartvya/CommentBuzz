// store.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AnyAction, combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import { ThunkDispatch } from "redux-thunk";

import RootReducer from "./reducers/RootReducer";
import backendBaseApi from "../services/BackendBaseApi";
import AuthApi from "../services/AuthRequest/authApi";

const rootReducer = combineReducers({
  [backendBaseApi.reducerPath]: backendBaseApi.reducer,
  [AuthApi.reducerPath]: AuthApi.reducer,
  root: RootReducer,
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

const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunkDispatch = ThunkDispatch<RootState, never, AnyAction>;

type DispatchFunc = () => AppDispatch;

setupListeners(store.dispatch);

export const useAppDispatch: DispatchFunc = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export { persistor, store };
