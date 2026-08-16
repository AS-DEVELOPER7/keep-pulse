import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  toasts: [],
};

export const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    addToast: (state, action) => {
      const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
      const toast = {
        id,
        type: action.payload.type || 'info', // 'success' | 'error' | 'warning' | 'info'
        title: action.payload.title || '',
        message: action.payload.message || '',
        duration: action.payload.duration || 4000,
      };
      state.toasts.push(toast);
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    clearToasts: (state) => {
      state.toasts = [];
    },
  },
});

export const { addToast, removeToast, clearToasts } = toastSlice.actions;
export default toastSlice.reducer;
