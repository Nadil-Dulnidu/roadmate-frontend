import { apiSlice } from "../api/apiSlice";
import {
  createSelector,
  createEntityAdapter,
  type EntityState
} from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import type { Payment, PaymentInput } from "./paymentTypes";

const paymentAdapter = createEntityAdapter<Payment, number>({
  selectId: (payment) => {
    if (payment.payment_id === undefined || payment.payment_id === null) {
      throw new Error("payment.payment_id is required and must be a number");
    }
    return payment.payment_id;
  },
});

const initialState = paymentAdapter.getInitialState();

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
    getAllPayments: builder.query<EntityState<Payment, number>, string | null>({
      query: (token) => ({
        url: "/payment",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      transformResponse: (response: Payment[]) => {
        return paymentAdapter.setAll(initialState, response);
      },
      providesTags: (result) => [
        { type: "Payment", id: "LIST" },
        ...(result?.ids?.map((payment_id: number) => ({ type: "Payment" as const, id: payment_id })) || [])
      ],
    }),
    getPaymentById: builder.query<EntityState<Payment, number>, { token: string | null; id: number }>({
      query: ({ token, id }) => ({
        url: `/payment/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      transformResponse: (response: Payment) => {
        return paymentAdapter.setOne(initialState, response);
      },
      providesTags: (_result, _error, { id }) => [
        { type: "Payment", id: "LIST" },
        { type: "Payment", id },
      ],
    }),
    createPayment: builder.mutation<Payment, { token: string | null; payment: Payment }>({
      query: ({ token, payment }) => ({
        url: "/payment",
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payment,
      }),
      invalidatesTags: [{ type: "Payment", id: "LIST" }],
    }),
  }),
});

export const { 
  useCreatePaymentIntentMutation, 
  useGetAllPaymentsQuery, 
  useGetPaymentByIdQuery, 
  useCreatePaymentMutation 
} = paymentApiSlice;

export const selectPaymentsResult = paymentApiSlice.endpoints.getAllPayments.select;

const paymentSelectors = paymentAdapter.getSelectors();

const selectPaymentsData = (token: string | null) =>
  createSelector(
    (state: RootState) => selectPaymentsResult(token)(state),
    (paymentsResult) => paymentsResult?.data ?? initialState
  );

export const selectAllPayments = (token: string | null) =>
  (state: RootState) => paymentSelectors.selectAll(selectPaymentsData(token)(state));

export const selectPaymentById = (token: string | null, id: number) =>
  (state: RootState) => paymentSelectors.selectById(selectPaymentsData(token)(state), id);

export const selectPaymentIds = (token: string | null) =>
  (state: RootState) => paymentSelectors.selectIds(selectPaymentsData(token)(state));

