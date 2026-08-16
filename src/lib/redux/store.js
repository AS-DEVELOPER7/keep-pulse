import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { projectsApi } from '@/store/services/projectsApi';
import { pingLogsApi } from '@/store/services/pingLogsApi';
import { dashboardApi } from '@/store/services/dashboardApi';
import { setupApi } from '@/store/services/setupApi';
import projectReducer from '@/store/slices/projectSlice';
import pingLogReducer from '@/store/slices/pingLogSlice';
import toastReducer from '@/store/slices/toastSlice';

export const makeStore = () => {
  const store = configureStore({
    reducer: {
      projects: projectReducer,
      pingLogs: pingLogReducer,
      toast: toastReducer,
      [projectsApi.reducerPath]: projectsApi.reducer,
      [pingLogsApi.reducerPath]: pingLogsApi.reducer,
      [dashboardApi.reducerPath]: dashboardApi.reducer,
      [setupApi.reducerPath]: setupApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        projectsApi.middleware,
        pingLogsApi.middleware,
        dashboardApi.middleware,
        setupApi.middleware
      ),
  });

  setupListeners(store.dispatch);
  return store;
};
