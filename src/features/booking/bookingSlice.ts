import { apiSlice } from "../api/apiSlice";
import {
  createEntityAdapter,
  type EntityState
} from "@reduxjs/toolkit";
import type { Booking, Status } from "./bookingTypes";
import type { RootState } from "@/app/store";

const bookingAdapter = createEntityAdapter<Booking, number>({
  selectId: (booking) => {
    if (booking.booking_id === undefined || booking.booking_id === null) {
      throw new Error("booking_id is required and must be a number");
    }
    return booking.booking_id;
  },
  sortComparer: (a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime(),
});

const initialState = bookingAdapter.getInitialState();

export const bookingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllBooking: builder.query<EntityState<Booking, number>, {token:string | null, status: Status[] | undefined}>({
      query: ({ token, status }) => ({
        url: `/booking?status=${status?.join(",")}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      transformResponse: (response: Booking[]) => {
        return bookingAdapter.setAll(initialState, response);
      },
      providesTags: (result) => [
        { type: "Booking", id: "LIST" },
        ...(result?.ids?.map((booking_id: number) => ({ type: "Booking" as const, id: booking_id })) || [])
      ],
    }),
    createBooking: builder.mutation<Booking, { token: string | null; booking: Booking }>({
      query: ({ token, booking }) => ({
        url: "/booking",
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: booking,
      }),
      invalidatesTags: [{ type: "Booking", id: "LIST" }],
    }),
    updateBooking: builder.mutation<Booking, { token: string | null; id: number | undefined; status: Status }>({
      query: ({ token, id, status }) => ({
        url: `/booking/${id}?status=${status}`,
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Booking", id: arg.id },
        { type: "Booking", id: "LIST" }
      ]
    }),
    getBookingById: builder.query<EntityState<Booking, number>, { token: string | null; id: number }>({
      query: ({ token, id }) => ({
        url: `/booking/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      transformResponse: (response: Booking) => {
        return bookingAdapter.setOne(initialState, response);
      },
      providesTags: (_result, _error, { id }) => [
        { type: "Booking", id: "LIST" },
        { type: "Booking", id },
      ],
    }),
    getAllBookingByRenterId: builder.query<EntityState<Booking, number>, { token: string | null; renterId: string | undefined; status?: Status[] | undefined }>({
      query: ({ token, renterId, status = [] }) => ({
        url: `/booking/renter/${renterId}?status=${status.join(",")}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      transformResponse: (response: Booking[]) => {
        return bookingAdapter.setAll(initialState, response);
      },
      providesTags: (result) => [
        { type: "Booking", id: "LIST" },
        ...(result?.ids?.map((booking_id: number) => ({ type: "Booking" as const, id: booking_id })) || []),
      ],
    }),
    getAllBookingByOwnerId: builder.query<EntityState<Booking, number>, { token: string | null; ownerId: string | undefined; status?: Status[] | undefined }>({
      query: ({ token, ownerId, status = [] }) => ({
        url: `/booking/owner/${ownerId}?status=${status.join(",")}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      transformResponse: (response: Booking[]) => {
        return bookingAdapter.setAll(initialState, response);
      },
      providesTags: (result) => [
        { type: "Booking", id: "LIST" },
        ...(result?.ids?.map((booking_id: number) => ({ type: "Booking" as const, id: booking_id })) || []),
      ],
    }),
    deleteBooking: builder.mutation<void, { token: string | null; id: number | undefined }>({
      query: ({ token, id }) => ({
        url: `/booking/${id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: [{ type: "Booking", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllBookingQuery,
  useCreateBookingMutation,
  useUpdateBookingMutation,
  useGetBookingByIdQuery,
  useDeleteBookingMutation,
  useGetAllBookingByRenterIdQuery,
  useGetAllBookingByOwnerIdQuery,
} = bookingApiSlice;


// Selector to extract all bookings
const selectBookingsResult = bookingApiSlice.endpoints.getAllBooking.select;

const bookingSelectors = bookingAdapter.getSelectors();

const selectBookingsData = (token: string | null, status?: Status[] | undefined) =>
 (state: RootState) => selectBookingsResult({ token, status })(state)?.data ?? initialState;

export const selectAllBookings = (token: string | null, status?: Status[] | undefined) =>
  (state: RootState) => bookingSelectors.selectAll(selectBookingsData(token, status)(state));

// Selector to extract bookings for a specific renter
const selectBookingsByRenterResult = bookingApiSlice.endpoints.getAllBookingByRenterId.select;

const selectBookingsByRenterData = (token: string | null, renterId: string | undefined, status?: Status[] | undefined) =>
(state: RootState) => selectBookingsByRenterResult({ token, renterId, status })(state)?.data ?? initialState;

export const selectBookingsByRenter = (token: string | null, renterId: string | undefined, status?: Status[] | undefined) => {
  const selectBookings = selectBookingsByRenterData(token, renterId, status);
  return (state: RootState) => bookingSelectors.selectAll(selectBookings(state));
};

// Selector to extract bookings for a specific owner
const selectBookingsByOwnerResult = bookingApiSlice.endpoints.getAllBookingByOwnerId.select;

const selectBookingsByOwnerData = (token: string | null, ownerId: string | undefined, status?: Status[] | undefined) =>
(state: RootState) => selectBookingsByOwnerResult({ token, ownerId, status })(state)?.data ?? initialState;

export const selectBookingsByOwner = (token: string | null, ownerId: string | undefined, status?: Status[] | undefined) => {
  const selectBookings = selectBookingsByOwnerData(token, ownerId, status);
  return (state: RootState) => bookingSelectors.selectAll(selectBookings(state));
}
