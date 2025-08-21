import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BACKEND_URL } from "@/config/env";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BACKEND_URL}`,
  }),
  tagTypes: ["Vehicle", "Booking", "User", "Payment", "Review", "Notification",],
  endpoints: () => ({}),
});