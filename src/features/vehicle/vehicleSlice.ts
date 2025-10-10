import { apiSlice } from "../api/apiSlice";
import {
  createEntityAdapter,
  createSelector,
  type EntityState
} from "@reduxjs/toolkit";
import type { FullVehicle, VehicleResponse } from "./vehicleTypes";
import type { RootState } from "@/app/store";

const vehicleAdapter = createEntityAdapter<FullVehicle, number>({
  selectId: (vehicle) => vehicle.vehicle_id,
});

const initialState = vehicleAdapter.getInitialState();

export const vehicleApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVehicles: builder.query<{ data: EntityState<FullVehicle, number>; meta: Omit<VehicleResponse, "content"> }, { page: number; size: number; vehicleName?: string | undefined }>({
      query: ({ page, size, vehicleName }) => {
        let url = `/listing/vehicle?page=${page}&size=${size}`;
        if (vehicleName) url += `&vehicleName=${vehicleName}`;
        return { url };
      },
      transformResponse: (response: VehicleResponse) => {
        return {
          data: vehicleAdapter.setAll(initialState, response.content),
          meta: {
            totalPages: response.totalPages,
            totalElements: response.totalElements,
            number: response.number,
            size: response.size,
            first: response.first,
            last: response.last,
          },
        };
      },
      providesTags: (result) => [
        { type: "Vehicle", id: "LIST" },
        ...(result?.data?.ids?.map((vehicle_id) => ({ type: "Vehicle" as const, id: vehicle_id })) || [])
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

type VehicleQueryArgs = { page: number; size: number; vehicleName?: string };

const selectVehiclesResult = (queryArgs: VehicleQueryArgs) =>
  vehicleApiSlice.endpoints.getVehicles.select(queryArgs);

export const selectVehiclesData = createSelector(
  (state: RootState, queryArgs: VehicleQueryArgs) => selectVehiclesResult(queryArgs)(state),
  (vehiclesResult) => vehiclesResult?.data?.data ?? initialState
);

export const selectVehiclesMeta = createSelector(

  (state: RootState, queryArgs: VehicleQueryArgs) => selectVehiclesResult(queryArgs)(state),
  (vehiclesResult) => vehiclesResult?.data?.meta
);

const { selectAll, selectById, selectIds } = vehicleAdapter.getSelectors();

export const selectAllVehicles = createSelector(
  [selectVehiclesData],
  (vehiclesData) => selectAll(vehiclesData)
);

export const selectVehicleIds = createSelector(
  [selectVehiclesData],
  (vehiclesData) => selectIds(vehiclesData)
);

export const selectVehicleById = createSelector(
  [selectVehiclesData, (_state, _queryArgs, vehicleId) => vehicleId],
  (vehiclesData, vehicleId) => selectById(vehiclesData, vehicleId)
);


const selectVehicleByOwnerResult = vehicleApiSlice.endpoints.getVehicleByOwner.select;
const vehicleByOwnerSelectors = vehicleAdapter.getSelectors();

export const selectNotificationsData = (ownerId: string | undefined) =>
  (state: RootState) =>
    selectVehicleByOwnerResult(ownerId)(state)?.data ?? initialState;

export const selectAllVehiclesByOwner = (ownerId: string | undefined) =>
  (state: RootState) =>
    vehicleByOwnerSelectors.selectAll(selectNotificationsData(ownerId)(state));



