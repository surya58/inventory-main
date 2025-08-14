import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const emptySplitApi = createApi({
  reducerPath: 'api',
  //baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_PYTHON_API_URL }),
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.NEXT_PUBLIC_PYTHON_API_URL || 'http://127.0.0.1:8001'
  }),
  endpoints: () => ({}),
})

export const { reducer, reducerPath } = emptySplitApi;
