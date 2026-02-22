import { baseApi } from "./baseApi";
import type { User, Role, Permission, CreateUserRequest, UpdateUserRequest, AddUserRolesRequest, AddUserPermissionsRequest } from "../../types";

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
        url: "/users/add",
        method: "POST",
        body: { user: body },
      }),
      invalidatesTags: ["Users"],
    }),

    updateUser: builder.mutation<User, UpdateUserRequest>({
      query: (data) => ({
        url: "/users/update",
        method: "PUT",
        body: { user: data },
      }),
      invalidatesTags: ["Users"],
    }),

    deleteUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `/users/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),

    getRoles: builder.query<Role[], void>({
      query: () => "/users/roles",
      transformResponse: (response: { roles: Role[] }) => response.roles,
    }),

    addUserRoles: builder.mutation<void, AddUserRolesRequest>({
      query: (body) => ({
        url: "/users/role/add",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Users"],
    }),

    deleteUserRoles: builder.mutation<void, AddUserRolesRequest>({
      query: (body) => ({
        url: "/users/role/delete",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Users"],
    }),

    getPermissions: builder.query<Permission[], void>({
      query: () => "/users/permissions",
      transformResponse: (response: { permissions: Permission[] }) => response.permissions,
    }),

    addUserPermissions: builder.mutation<void, AddUserPermissionsRequest>({
      query: (body) => ({
        url: "/users/permission/add",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Users"],
    }),

    deleteUserPermissions: builder.mutation<void, AddUserPermissionsRequest>({
      query: (body) => ({
        url: "/users/permission/delete",
        method: "POST",
        body,
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
  useGetRolesQuery,
  useAddUserRolesMutation,
  useDeleteUserRolesMutation,
  useGetPermissionsQuery,
  useAddUserPermissionsMutation,
  useDeleteUserPermissionsMutation,
} = usersApi;
