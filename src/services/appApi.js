import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// define a service user a base URL

const appApi = createApi({
  reducerPath: "appApi",
  baseQuery: fetchBaseQuery({
    // baseUrl: "https://chat-toy.herokuapp.com",
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
      query: (chatId) => ({
        url: `/api/chat/${chatId || ""}`,
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

    createGroupChat: builder.mutation({
      query: (payload) => ({
        url: "/api/chat/group",
        method: "POST",
        body: payload,
      }),
    }),

    removeFromGroup: builder.mutation({
      query: (payload) => ({
        url: "/api/chat/groupremove",
        method: "PUT",
        body: payload,
      }),
    }),

    addToGroup: builder.mutation({
      query: (payload) => ({
        url: "/api/chat/groupadd",
        method: "PUT",
        body: payload,
      }),
    }),

    renameGroup: builder.mutation({
      query: (payload) => ({
        url: "/api/chat/rename",
        method: "PUT",
        body: payload,
      }),
    }),

    fetchMessages: builder.query({
      query: (chatId) => ({
        url: `/api/message/${chatId}`,
        method: "GET",
      }),
    }),

    sendMessage: builder.mutation({
      query: (payload) => ({
        url: "/api/message",
        method: "POST",
        body: payload,
      }),
    }),

    updateNotifications: builder.mutation({
      query: (payload) => ({
        url: "/api/user/notif",
        method: "POST",
        body: payload,
      }),
    }),

    fetchNotifications: builder.query({
      query: () => ({
        url: "/api/user/notif",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useSignupUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useLazyFetchChatsQuery,
  useLazySearchUsersQuery,
  useAccessChatMutation,
  useCreateGroupChatMutation,
  useRemoveFromGroupMutation,
  useRenameGroupMutation,
  useAddToGroupMutation,
  useLazyFetchMessagesQuery,
  useSendMessageMutation,
  useUpdateNotificationsMutation,
  useLazyFetchNotificationsQuery,
} = appApi;

export default appApi;
