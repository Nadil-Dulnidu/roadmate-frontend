import { apiSlice } from "../api/apiSlice";
import {
  createSelector,
  createEntityAdapter,
  type EntityState
} from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import type { Review } from "./reviewTypes";

const reviewAdapter = createEntityAdapter<Review, number>({
  selectId: (review) => {
    if (review.review_id === undefined || review.review_id === null) {
      throw new Error("review_id is required and must be a number");
    }
    return review.review_id;
  }
})

const initialState = reviewAdapter.getInitialState();

export const reviewSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllReviews: builder.query<EntityState<Review, number>, string | null>({
      query: (token) => ({
        url: "/review",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      transformResponse: (response: Review[]) => {
        return reviewAdapter.setAll(initialState, response);
      },
      providesTags: (result) => [
        { type: "Review", id: "LIST" },
        ...(result?.ids?.map((review_id: number) => ({ type: "Review" as const, id: review_id })) || [])
      ],
    }),
    getReviewById: builder.query<EntityState<Review, number>, { token: string | null; id: number | undefined }>({
      query: ({ token, id }) => ({
        url: `/review/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      transformResponse: (response: Review) => {
        return reviewAdapter.setOne(initialState, response);
      },
      providesTags: (_result, _error, { id }) => [
        { type: "Review", id: "LIST" },
        { type: "Review", id },
      ],
    }),
    getReviewsByVehicleId: builder.query<EntityState<Review, number>, { vehicleId: number | undefined }>({
      query: ({ vehicleId }) => ({
        url: `/review/vehicle/${vehicleId}`,
      }),
      transformResponse: (response: Review[]) => {
        return reviewAdapter.setAll(initialState, response);
      },
      providesTags: (result) => [
        { type: "Review", id: "LIST" },
        ...(result?.ids?.map((review_id: number) => ({ type: "Review" as const, id: review_id })) || [])
      ],
    }),
    getReviewsByUserId: builder.query<EntityState<Review, number>, { token: string | null; userId: string | undefined }>({
      query: ({ token, userId }) => ({
        url: `/review/user/${userId}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      transformResponse: (response: Review[]) => {
        return reviewAdapter.setAll(initialState, response);
      },
      providesTags: (result) => [
        { type: "Review", id: "LIST" },
        ...(result?.ids?.map((review_id: number) => ({ type: "Review" as const, id: review_id })) || [])
      ],
    }),
    createReview: builder.mutation<Review, { token: string | null; review: Review }>({
      query: ({ token, review }) => ({
        url: "/review",
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: review,
      }),
      invalidatesTags: [{ type: "Review", id: "LIST" }],
    }),
    updateReview: builder.mutation<Review, { token: string | null; id: number | undefined; review: Review }>({
      query: ({ token, id, review }) => ({
        url: `/review/${id}`,
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: review,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Review", id },
        { type: "Review", id: "LIST" },
      ],
    }),
    deleteReview: builder.mutation<void, { token: string | null; id: number | undefined }>({
      query: ({ token, id }) => ({
        url: `/review/${id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: [{ type: "Review", id: "LIST" }],
    }),
  })
});

export const {
  useGetAllReviewsQuery,
  useGetReviewByIdQuery,
  useGetReviewsByVehicleIdQuery,
  useGetReviewsByUserIdQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation
} = reviewSlice;

const selectReviewsResult = reviewSlice.endpoints.getAllReviews.select;

const reviewSelectors = reviewAdapter.getSelectors();

const selectReviewsData = (token: string | null) =>
  createSelector(
    (state: RootState) => selectReviewsResult(token)(state),
    (reviewsResult) => reviewsResult?.data ?? initialState
  );

export const selectAllReviews = (token: string | null) =>
  (state: RootState) => reviewSelectors.selectAll(selectReviewsData(token)(state));

export const selectReviewById = (token: string | null, id: number) =>
  (state: RootState) => reviewSelectors.selectById(selectReviewsData(token)(state), id);

export const selectReviewsIds = (token: string | null) =>
  (state: RootState) => reviewSelectors.selectIds(selectReviewsData(token)(state));

// Selector to extract reviews for a specific vehicle
const selectReviewsByVehicleId = reviewSlice.endpoints.getReviewsByVehicleId.select;

const selectReviewsByVehicleData = (vehicleId: number | undefined) =>
  createSelector(
    (state: RootState) => selectReviewsByVehicleId({ vehicleId })(state),
    (reviewsResult) => reviewsResult?.data ?? initialState
  );

export const selectReviewsByVehicle = (vehicleId: number | undefined) => {
  const selectReviews = selectReviewsByVehicleData(vehicleId);
  return (state: RootState) => reviewSelectors.selectAll(selectReviews(state));
};

//selector to extract reviews for a specific user
const selectReviewsByUserId = reviewSlice.endpoints.getReviewsByUserId.select;

const selectReviewsByUserData = (token: string | null, userId: string | undefined) =>
  createSelector(
    (state: RootState) => selectReviewsByUserId({ token, userId })(state),
    (reviewsResult) => reviewsResult?.data ?? initialState
  );

export const selectReviewsByUser = (token: string | null, userId: string | undefined) => {
  const selectReviews = selectReviewsByUserData(token, userId);
  return (state: RootState) => reviewSelectors.selectAll(selectReviews(state));
};





