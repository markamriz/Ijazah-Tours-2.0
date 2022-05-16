import {
  ThunkAction,
  Action,
  createStore,
} from '@reduxjs/toolkit';

import rootReducer, { RootState } from './root';

export const store = createStore(rootReducer);
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
