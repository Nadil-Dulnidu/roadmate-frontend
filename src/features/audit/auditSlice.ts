import { apiSlice } from "../api/apiSlice";

// Define the response type from your endpoint
export interface ListingCount {
  date: string;
  listingCount: number;
}

export const auditApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getListingCountByDate: builder.query<ListingCount[], { token: string }>({
      query: (arg) => ({
        url: "/audit/listing-count",
        headers: {
          Authorization: `Bearer ${arg.token}`,
        },
      }),
      providesTags: ["Audit"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetListingCountByDateQuery } = auditApi;
