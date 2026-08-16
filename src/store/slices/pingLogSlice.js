import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedProjectFilter: 'ALL',
  selectedStatusFilter: 'ALL',
  activeLogModal: null,
};

export const pingLogSlice = createSlice({
  name: 'pingLogs',
  initialState,
  reducers: {
    setProjectFilter: (state, action) => {
      state.selectedProjectFilter = action.payload;
    },
    setStatusFilter: (state, action) => {
      state.selectedStatusFilter = action.payload;
    },
    setActiveLogModal: (state, action) => {
      state.activeLogModal = action.payload;
    },
    closeLogModal: (state) => {
      state.activeLogModal = null;
    },
  },
});

export const {
  setProjectFilter,
  setStatusFilter,
  setActiveLogModal,
  closeLogModal,
} = pingLogSlice.actions;

export default pingLogSlice.reducer;
