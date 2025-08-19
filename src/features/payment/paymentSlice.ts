import { apiSlice } from "../api/apiSlice";
import type { PaymentInput } from "./paymentTypes";

export const paymentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createPaymentIntent: builder.mutation<{ clientSecret: string }, { token: string | null; payment: PaymentInput }>({
      query: ({ token, payment }) => ({
        url: "/payment/create-payment-intent",
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payment,
      }),
    }),
  }),
});

export const { useCreatePaymentIntentMutation } = paymentApiSlice;

