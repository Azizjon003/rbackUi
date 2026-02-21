import { baseApi } from "./baseApi";

export interface Report {
  id: number;
  title: string;
  type: string;
  period: string;
  totalAmount?: number;
  totalOrders?: number;
  totalUsers?: number;
  activeUsers?: number;
  successRate?: number;
  status: string;
  createdAt: string;
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
