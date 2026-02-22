import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { message } from "antd";
import type { RootState } from "../../app/store";
import { logout } from "../authSlice";

export function getErrorMessage(data: unknown, fallback: string): string {
  const err = data as { message?: { uz?: string } | string };
  if (typeof err?.message === "object" && err.message?.uz) return err.message.uz;
  if (typeof err?.message === "string") return err.message;
  return fallback;
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
  responseHandler: async (response) => {
    const data = await response.json();
    if (!response.ok) return data;
    return data.data;
  },
});

const baseQueryWithHandlers: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error) {
    const status = result.error.status;
    if (status === 401) {
      api.dispatch(logout());
    }
    if (status === 403) {
      const errorData = result.error.data;
      message.error(getErrorMessage(errorData, "Sizda bu amalni bajarish huquqi yo'q!"));
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithHandlers,
  tagTypes: ["Users", "Profile"],
  endpoints: () => ({}),
});
