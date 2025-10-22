import { apiSlice } from "../api/apiSlice";

// Define the response type from your endpoint
export interface ListingCount {
  date: string;
  listingCount: number;
}

export const auditApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getListingCountByDate: builder.query<ListingCount[], void>({
      query: () => "/audit/listing-count",
      providesTags: ["Audit"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetListingCountByDateQuery } = auditApi;
