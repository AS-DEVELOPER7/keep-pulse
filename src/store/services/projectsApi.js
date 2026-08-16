import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const projectsApi = createApi({
  reducerPath: 'projectsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Project', 'Log', 'Dashboard'],
  endpoints: (builder) => ({
    getProjects: builder.query({
      query: () => '/projects',
      providesTags: ['Project'],
    }),
    getProjectById: builder.query({
      query: (id) => `/projects?id=${id}`,
      providesTags: (result, error, id) => [{ type: 'Project', id }],
    }),
    createProject: builder.mutation({
      query: (newProject) => ({
        url: '/projects',
        method: 'POST',
        body: newProject,
      }),
      invalidatesTags: ['Project', 'Dashboard'],
    }),
    updateProject: builder.mutation({
      query: (updatedProject) => ({
        url: '/projects',
        method: 'PUT',
        body: updatedProject,
      }),
      invalidatesTags: (result, error, { id }) => ['Project', { type: 'Project', id }, 'Dashboard'],
    }),
    deleteProject: builder.mutation({
      query: (id) => ({
        url: `/projects?id=${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Project', 'Dashboard'],
    }),
    pingProjectNow: builder.mutation({
      query: (id) => ({
        url: `/projects/${id}/ping`,
        method: 'POST',
      }),
      invalidatesTags: ['Project', 'Log', 'Dashboard'],
    }),
    pingAllProjectsNow: builder.mutation({
      query: () => ({
        url: '/projects/ping-all',
        method: 'POST',
      }),
      invalidatesTags: ['Project', 'Log', 'Dashboard'],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  usePingProjectNowMutation,
  usePingAllProjectsNowMutation,
} = projectsApi;
