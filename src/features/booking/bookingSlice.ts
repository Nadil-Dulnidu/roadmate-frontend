import { apiSlice } from "../api/apiSlice";
import type { Booking, Status } from "./bookingTypes";

export const bookingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllBooking: builder.query<Booking[], { token: string | null }>({
      query: ({ token }) => ({
        url: "/booking",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: (result) => [
        { type: "Booking", id: "LIST" },
        ...(result?.map((booking: Booking) => 
          ({ type: "Booking" as const, id: booking.booking_id })) || [])
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
    getBookingById: builder.query<Booking, { token: string | null; id: number }>({
      query: ({ token, id }) => ({
        url: `/booking/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: (result) => [
        { type: "Booking", id: "LIST" },
        { type: "Booking", id: result?.booking_id },
      ],
    }),
    deleteBooking: builder.mutation<void, { token: string | null; id: number }>({
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
} = bookingApiSlice;