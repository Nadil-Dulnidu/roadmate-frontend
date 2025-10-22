import { apiSlice } from "../api/apiSlice";
import {
  createEntityAdapter,
  type EntityState
} from "@reduxjs/toolkit";
import type { FullVehicle} from "./vehicleTypes";
import type { RootState } from "@/app/store";

const vehicleAdapter = createEntityAdapter<FullVehicle, number>({
  selectId: (vehicle) => vehicle.vehicle_id,
});

const initialState = vehicleAdapter.getInitialState();

export const vehicleApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllVehicles: builder.query<EntityState<FullVehicle, number>, { vehicleStatus?: string[] | undefined, listingStatus?: string[] | undefined }>({
      query: ({ vehicleStatus, listingStatus }) => {
        const vehicleStatusQuery = vehicleStatus ? `vehicleStatus=${vehicleStatus.join(",")}` : "";
        const listingStatusQuery = listingStatus ? `listingStatus=${listingStatus.join(",")}` : "";
        return {
          url: `/listing/vehicle?${vehicleStatusQuery}&${listingStatusQuery}`,
        };
      },
      transformResponse: (response: FullVehicle[]) => {
        return vehicleAdapter.setAll(initialState, response);
      },
      providesTags: (result) => [
        { type: "Vehicle", id: "LIST" },
        ...(result?.ids?.map((vehicle_id: number) => ({ type: "Vehicle" as const, id: vehicle_id })) || [])
      ],
    }),
    getVehicleById: builder.query<FullVehicle, number>({
      query: (id) => `/listing/vehicle/${id}`,
      transformResponse: (response: FullVehicle): FullVehicle => {
        return response ?? initialState;
      },
      providesTags: (result) => [
        { type: "Vehicle", id: "LIST" },
        { type: "Vehicle", id: result?.vehicle_id },
      ],
    }),
    getVehicleByOwner: builder.query<EntityState<FullVehicle, number>, string | undefined>({
      query: (ownerId) => `/listing/vehicle/owner/${ownerId}`,
      transformResponse: (response: FullVehicle[]) => {
        return vehicleAdapter.setAll(initialState, response);
      },
      providesTags: (result) => [
        { type: "Vehicle", id: "LIST" },
        ...(result?.ids?.map((vehicle_id: number) => ({ type: "Vehicle" as const, id: vehicle_id })) || [])
      ],
    }),
    addVehicle: builder.mutation<FullVehicle, { newVehicle: FormData; token: string | null }>({
      query: ({ newVehicle, token }) => ({
        url: `/listing/vehicle`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: newVehicle,
      }),
      invalidatesTags: [{ type: "Vehicle", id: "LIST" }],
    }),
    updateVehicle: builder.mutation<FullVehicle, { updatedVehicle: Partial<FullVehicle>; token: string | null }>({
      query: ({ updatedVehicle, token }) => ({
        url: `/listing/vehicle`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: updatedVehicle
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Vehicle", id: arg.updatedVehicle.vehicle_id },
        { type: "Vehicle", id: "LIST" }
      ]
    }),
    updateVehicleStatus: builder.mutation<FullVehicle, { vehicle_id: number; status: string; token: string | null }>({
      query: ({ vehicle_id, status, token }) => ({
        url: `/listing/vehicle/${vehicle_id}?status=${status}`,
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Vehicle", id: arg.vehicle_id },
        { type: "Vehicle", id: "LIST" }
      ]
    }),
    deleteVehicle: builder.mutation<{ message: string }, { vehicle_id: number; token: string | null }>({
      query: ({ vehicle_id, token }) => ({
        url: `/listing/vehicle/${vehicle_id}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: [{ type: "Vehicle", id: "LIST" }]
    }),
    updateListingStatus: builder.mutation<FullVehicle, { vehicle_id: number; listing_status: string; token: string | null }>({
      query: ({ vehicle_id, listing_status, token }) => ({
        url: `/listing/vehicle/listing-status/${vehicle_id}?listingStatus=${listing_status}`,
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Vehicle", id: arg.vehicle_id },
        { type: "Vehicle", id: "LIST" }
      ]
    }),
  })
});

export const {
  useGetAllVehiclesQuery,
  useGetVehicleByIdQuery,
  useGetVehicleByOwnerQuery,
  useAddVehicleMutation,
  useUpdateVehicleMutation,
  useUpdateVehicleStatusMutation,
  useDeleteVehicleMutation,
  useUpdateListingStatusMutation
} = vehicleApiSlice;

const selectVehicleResult = vehicleApiSlice.endpoints.getAllVehicles.select;
const vehicleSelectors = vehicleAdapter.getSelectors();

export const selectVehiclesData = (listingStatus : string[] | undefined, vehicleStatus: string[] | undefined) =>
  (state: RootState) =>
    selectVehicleResult({ listingStatus, vehicleStatus })(state)?.data ?? initialState;

export const selectAllVehicles = (listingStatus : string[] | undefined, vehicleStatus: string[] | undefined) =>
  (state: RootState) =>
    vehicleSelectors.selectAll(selectVehiclesData(listingStatus, vehicleStatus)(state));


const selectVehicleByOwnerResult = vehicleApiSlice.endpoints.getVehicleByOwner.select;
const vehicleByOwnerSelectors = vehicleAdapter.getSelectors();

export const selectNotificationsData = (ownerId: string | undefined) =>
  (state: RootState) =>
    selectVehicleByOwnerResult(ownerId)(state)?.data ?? initialState;

export const selectAllVehiclesByOwner = (ownerId: string | undefined) =>
  (state: RootState) =>
    vehicleByOwnerSelectors.selectAll(selectNotificationsData(ownerId)(state));



