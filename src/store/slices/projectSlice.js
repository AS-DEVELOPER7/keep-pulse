import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  searchQuery: '',
  selectedStatus: 'ALL',
  isCreateModalOpen: false,
  editingProject: null,
};

export const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSelectedStatus: (state, action) => {
      state.selectedStatus = action.payload;
    },
    openCreateModal: (state) => {
      state.editingProject = null;
      state.isCreateModalOpen = true;
    },
    openEditModal: (state, action) => {
      state.editingProject = action.payload;
      state.isCreateModalOpen = true;
    },
    closeModal: (state) => {
      state.isCreateModalOpen = false;
      state.editingProject = null;
    },
  },
});

export const {
  setSearchQuery,
  setSelectedStatus,
  openCreateModal,
  openEditModal,
  closeModal,
} = projectSlice.actions;

export default projectSlice.reducer;
