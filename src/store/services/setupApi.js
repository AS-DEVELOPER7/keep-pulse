import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const setupApi = createApi({
  reducerPath: 'setupApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getSetupStatus: builder.query({
      query: () => '/setup',
    }),
    completeSetup: builder.mutation({
      query: (data) => ({
        url: '/setup',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useGetSetupStatusQuery, useCompleteSetupMutation } = setupApi;
