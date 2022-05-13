import { createSlice } from '@reduxjs/toolkit';

// eslint-disable-next-line import/no-cycle
import { User } from '../utils/types';
import { RootState } from './root';

interface UserState {
  user: User;
}

const initialState: UserState = {
  user: {
    id: '',
    firstName: '',
    lastName: '',
    profileImg: '',
    contactNumber: '',
    whatsApp: '',
    title: '',
    role: '',
    email: '',
    status: '',
  },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = {
        id: '',
        firstName: '',
        lastName: '',
        profileImg: '',
        contactNumber: '',
        whatsApp: '',
        title: '',
        role: '',
        email: '',
        status: '',
      };
    },
  },
});

export const { login, logout } = userSlice.actions;
export const selectUser = (state: RootState) => state.user.user;
export default userSlice.reducer;
