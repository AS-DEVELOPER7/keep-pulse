import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const pingLogsApi = createApi({
  reducerPath: 'pingLogsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Log'],
  endpoints: (builder) => ({
    getPingLogs: builder.query({
      query: (params) => {
        const search = new URLSearchParams(params || {}).toString();
        return `/logs?${search}`;
      },
      providesTags: ['Log'],
    }),
  }),
});

export const { useGetPingLogsQuery } = pingLogsApi;
