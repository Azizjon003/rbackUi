import { baseApi } from "./baseApi";

export interface Payment {
  id: number;
  orderId: string;
  amount: number;
  currency: string;
  status: string;
  method: string;
  customerName: string;
  createdAt: string;
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
