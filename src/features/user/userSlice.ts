import type { RootState } from "@/app/store";
import { apiSlice } from "../api/apiSlice";
import {
  createSelector,
  createEntityAdapter,
  type EntityState
} from "@reduxjs/toolkit";
import type { User, UserRole } from "./userTypes";

const userAdapter = createEntityAdapter<User, number>({
  selectId: (user) => user.user_id,
});

const initialState = userAdapter.getInitialState();

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<EntityState<User, number>, string | null>({
      query: (token) => ({
        url: "/users",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }),
      transformResponse: (response: User[]) => {
        return userAdapter.setAll(initialState, response);
      },
      providesTags: (result) => [
        { type: "User", id: "LIST" },
        ...(result?.ids?.map((user_id: number) => ({ type: "User" as const, id: user_id })) || [])
      ],
    }),
    getUserById: builder.query<EntityState<User, number>, { id: number; token: string | null }>({
      query: ({ id, token }) => ({
        url: `/users/${id}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }),
      transformResponse: (response: User) => {
        return userAdapter.setOne(initialState, response);
      },
      providesTags: (_result, _error, { id }) => [
        { type: "User", id: "LIST" },
        { type: "User", id },
      ],
    }),
    getUserByClerkId: builder.query<EntityState<User, number>, { clerkId: string; token: string | null }>({
      query: ({ clerkId, token }) => ({
        url: `/users/clerk/${clerkId}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }),
      transformResponse: (response: User) => {
        return userAdapter.setOne(initialState, response);
      },
      providesTags: (_result, _error, { clerkId }) => [
        { type: "User", id: "LIST" },
        { type: "User", id: clerkId },
      ],
    }),
    updateUserRole: builder.mutation<User, { userId: number; role: UserRole; token: string | null }>({
      query: ({ userId, role, token }) => ({
        url: `/users/role/${userId}?role=${role}`,
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: (_result, _error, { userId }) => [
        { type: "User", id: "LIST" },
        { type: "User", id: userId },
      ],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserRoleMutation,
  useGetUserByClerkIdQuery
} = userApiSlice;

export const selectUsersResult = userApiSlice.endpoints.getUsers.select;

const userSelectors = userAdapter.getSelectors();

const selectUsersData = (token: string | null) =>
  createSelector(
    (state: RootState) => selectUsersResult(token)(state),
    (usersResult) => usersResult?.data ?? initialState
  );

export const selectAllUsers = (token: string | null) =>
  (state: RootState) => userSelectors.selectAll(selectUsersData(token)(state));

export const selectUserById = (token: string | null, id: number) =>
  (state: RootState) => userSelectors.selectById(selectUsersData(token)(state), id);

export const selectUserIds = (token: string | null) =>
  (state: RootState) => userSelectors.selectIds(selectUsersData(token)(state));
