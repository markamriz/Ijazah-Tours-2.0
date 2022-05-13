import { createSlice } from '@reduxjs/toolkit';

// eslint-disable-next-line import/no-cycle
import { RootState } from './root';

interface ContainerSizeState {
  withNavbarWidth: 0,
  withNavbarHeight: 0,
  with2NavbarWidth: 0,
  with2NavbarHeight: 0,
  withoutNavbarWidth: 0,
  withoutNavbarHeight: 0,
}

const initialState: ContainerSizeState = {
  withNavbarWidth: 0,
  withNavbarHeight: 0,
  with2NavbarWidth: 0,
  with2NavbarHeight: 0,
  withoutNavbarWidth: 0,
  withoutNavbarHeight: 0,
};

export const containerSizeSlice = createSlice({
  name: 'containerSize',
  initialState,
  reducers: {
    onSizeChange: (state, action) => {
      state.withNavbarWidth = action.payload.withNavbarWidth;
      state.withNavbarHeight = action.payload.withNavbarHeight;
      state.with2NavbarWidth = action.payload.with2NavbarWidth;
      state.with2NavbarHeight = action.payload.with2NavbarHeight;
      state.withoutNavbarWidth = action.payload.withoutNavbarWidth;
      state.withoutNavbarHeight = action.payload.withoutNavbarHeight;
    },
  },
});

export const { onSizeChange } = containerSizeSlice.actions;
export const selectWithNavbarWidth = (state: RootState) => (
  state.containerSize.withNavbarWidth
);

export const selectWithNavbarHeight = (state: RootState) => (
  state.containerSize.withNavbarHeight
);

export const selectWith2NavbarWidth = (state: RootState) => (
  state.containerSize.with2NavbarWidth
);

export const selectWith2NavbarHeight = (state: RootState) => (
  state.containerSize.with2NavbarHeight
);

export const selectWithoutNavbarWidth = (state: RootState) => (
  state.containerSize.withoutNavbarWidth
);

export const selectWithoutNavbarHeight = (state: RootState) => (
  state.containerSize.withoutNavbarHeight
);

export default containerSizeSlice.reducer;
