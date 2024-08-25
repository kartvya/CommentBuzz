// store.ts
import {thunk, ThunkDispatch} from 'redux-thunk';
import {AnyAction, combineReducers} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit';
import {setupListeners} from '@reduxjs/toolkit/query/react';

import RootReducer from './reducers/RootReducer';
import backendBaseApi from '../services/BackendBaseApi';

const rootReducer = combineReducers({
  [backendBaseApi.reducerPath]: backendBaseApi.reducer,
  root: RootReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({serializableCheck: false}).concat(
      backendBaseApi.middleware,
      thunk,
    ),
});

const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunkDispatch = ThunkDispatch<RootState, never, AnyAction>;

type DispatchFunc = () => AppDispatch;

setupListeners(store.dispatch);

export const useAppDispatch: DispatchFunc = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export {store, persistor};
