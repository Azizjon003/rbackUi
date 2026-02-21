import { baseApi } from "./baseApi";
import type { User, CreateUserRequest, UpdateUserRequest } from "../../types";

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => "/users/all",
      transformResponse: (response: { users: User[] }) => response.users,
      providesTags: ["Users"],
    }),

    getUserById: builder.query<User, number>({
      query: (id) => `/users/${id}`,
      providesTags: ["Users"],
    }),

    createUser: builder.mutation<User, CreateUserRequest>({
      query: (body) => ({
        url: "/users",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Users"],
    }),

    updateUser: builder.mutation<User, { id: number; data: UpdateUserRequest }>(
      {
        query: ({ id, data }) => ({
          url: `/users/${id}`,
          method: "PUT",
          body: data,
        }),
        invalidatesTags: ["Users"],
      },
    ),

    deleteUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;
