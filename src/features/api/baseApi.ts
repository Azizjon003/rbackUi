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

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3000/api",
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
      message.error("Sizda bu amalni bajarish huquqi yo'q!");
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
