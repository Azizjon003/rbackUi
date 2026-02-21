import { baseApi } from "./baseApi";
import type { LoginData, LoginRequest, ProfileData } from "../../types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginData, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Profile"],
    }),
    getProfile: builder.query<ProfileData, void>({
      query: () => "/auth/me",
      providesTags: ["Profile"],
    }),
  }),
});

export const { useLoginMutation, useGetProfileQuery } = authApi;
