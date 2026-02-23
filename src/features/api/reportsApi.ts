import { baseApi } from "./baseApi";

export interface Report {
  id: number;
  title: string;
  type: string;
  period: string;
  total_amount: number | null;
  total_orders: number | null;
  total_users: number | null;
  active_users: number | null;
  success_rate: number | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export const reportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReports: builder.query<Report[], void>({
      query: () => "/reports/all",
      transformResponse: (response: { reports: Report[] }) => response.reports,
    }),
  }),
});

export const { useGetReportsQuery } = reportsApi;
