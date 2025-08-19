import type { RootState } from "@/app/store";
import { apiSlice } from "../api/apiSlice";
import {
  createSelector,
  createEntityAdapter,
  type EntityState
} from "@reduxjs/toolkit";
import type { FullVehicle } from "./vehicleTypes";

const vehicleAdapter = createEntityAdapter<FullVehicle, number>({
  selectId: (vehicle) => vehicle.vehicle_id,
});

const initialState = vehicleAdapter.getInitialState();

export const vehicleApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVehicles: builder.query<EntityState<FullVehicle, number>, void>({
      query: () => "/listing/vehicle",
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
    getVehicleByOwner: builder.query<EntityState<FullVehicle, number>, number>({
      query: (ownerId) => `/listing/vehicle/owner/${ownerId}`,
      transformResponse: (response: FullVehicle[]) => {
        return vehicleAdapter.setAll(initialState, response);
      },
      providesTags: (result) => [
        { type: "Vehicle", id: "LIST" },
        ...(result?.ids?.map((vehicle_id: number) => ({ type: "Vehicle" as const, id: vehicle_id })) || [])
      ],
    }),
    addVehicle: builder.mutation<FullVehicle, { newVehicle: FullVehicle; token: string | null }>({
      query: ({ newVehicle, token }) => ({
        url: `/listing/vehicle`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
        url: `/listing/vehicle/${vehicle_id}/?status=${status}`,
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: { status }
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
    })
  })
});

export const { 
  useGetVehiclesQuery, 
  useGetVehicleByIdQuery, 
  useGetVehicleByOwnerQuery, 
  useAddVehicleMutation, 
  useUpdateVehicleMutation, 
  useUpdateVehicleStatusMutation, 
  useDeleteVehicleMutation 
} = vehicleApiSlice;

const selectVehicleResult = vehicleApiSlice.endpoints.getVehicles.select();
const selectVehiclesData = createSelector(
  selectVehicleResult,
  (vehicleResult) => vehicleResult.data
);

export const {
  selectAll: selectAllVehicles,
  selectById: selectVehicleById,
  selectIds: selectVehicleIds,
} = vehicleAdapter.getSelectors<RootState>((state) => selectVehiclesData(state) ?? initialState);
