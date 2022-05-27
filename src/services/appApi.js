import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// define a service user a base URL

const appApi = createApi({
  reducerPath: "appApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4000",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().user?.token;

      // If we have a token set in state, let's assume that we should be passing it.
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    // create user
    signupUser: builder.mutation({
      query: (user) => ({
        url: "/api/user",
        method: "POST",
        body: user,
      }),
    }),

    // login
    loginUser: builder.mutation({
      query: (user) => ({
        url: "/api/user/login",
        method: "POST",
        body: user,
      }),
    }),

    //logout
    logoutUser: builder.mutation({
      query: () => ({
        url: "/api/user/logout",
        method: "DELETE",
      }),
    }),

    fetchChats: builder.query({
      query: () => ({
        url: "/api/chat/",
        method: "GET",
      }),
    }),

    searchUsers: builder.query({
      query: (keyword) => ({
        url: `/api/user?search=${keyword}`,
        method: "GET",
      }),
    }),

    accessChat: builder.mutation({
      query: (payload) => ({
        url: "/api/chat/",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const {
  useSignupUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  // useFetchChatsQuery,
  useLazyFetchChatsQuery,
  useLazySearchUsersQuery,
  useAccessChatMutation,
} = appApi;

export default appApi;
