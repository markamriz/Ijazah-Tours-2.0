import { combineReducers } from '@reduxjs/toolkit';

// eslint-disable-next-line import/no-cycle
import containerSizeReducer from './containerSizeSlice';
import userReducer from './userSlice';
// eslint-disable-next-line import/no-cycle

const rootReducer = combineReducers({
  user: userReducer,
  containerSize: containerSizeReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
