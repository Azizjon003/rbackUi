import { baseApi } from "./baseApi";

export interface Payment {
  id: number;
  order_id: string;
  amount: number;
  currency: string;
  status: string;
  method: string;
  customer_name: string;
  created_at: string;
  updated_at: string;
}

export const paymentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPayments: builder.query<Payment[], void>({
      query: () => "/payments/all",
      transformResponse: (response: { payments: Payment[] }) => response.payments,
    }),
  }),
});

export const { useGetPaymentsQuery } = paymentsApi;
