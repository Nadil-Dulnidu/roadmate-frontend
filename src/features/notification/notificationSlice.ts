import { apiSlice } from "../api/apiSlice";
import {
  createEntityAdapter,
  type EntityState
} from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import type { NotificationPayload, NotificationType } from "./notificationType";

const notificationAdapter = createEntityAdapter<NotificationType, number>({
  selectId: (notification) => {
    if (notification.notification_id === undefined || notification.notification_id === null) {
      throw new Error("notificationId is required and must be a number");
    }
    return notification.notification_id;
  },
  sortComparer: (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
})

const initialState = notificationAdapter.getInitialState();

export const notificationSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllNotifications: builder.query<EntityState<NotificationType, number>, { token: string | null, userId: string | undefined }>({
      query: ({ token, userId }) => ({
        url: `/notification/user/${userId}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      transformResponse: (response: NotificationType[]) => {
        return notificationAdapter.setAll(initialState, response);
      },
      providesTags: (result) => [
        { type: "Notification", id: "LIST" },
        ...(result?.ids?.map((notificationId: number) => ({ type: "Notification" as const, id: notificationId })) || [])
      ],
    }),
    markNotificationAsRead: builder.mutation<void, { token: string | null; notificationId: number | undefined }>({
      query: ({ token, notificationId }) => ({
        url: `/notification/${notificationId}/read`,
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: (_result, _error, { notificationId }) => [
        { type: "Notification", id: "LIST" },
        { type: "Notification", id: notificationId },
      ],
    }),
    sendNotification: builder.mutation<void, { token: string | null; notification: NotificationPayload}>({
      query: ({ token, notification }) => ({
        url: `/notification`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: notification,
      }),
      invalidatesTags: (_result, _error, { notification }) => [
        { type: "Notification", id: "LIST" },
        { type: "Notification", id: notification.user_id },
      ],
    }),
    deleteNotification: builder.mutation<void, { token: string | null; notificationId: number | undefined }>({
      query: ({ token, notificationId }) => ({
        url: `/notification/${notificationId}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      invalidatesTags: (_result, _error, { notificationId }) => [
        { type: "Notification", id: "LIST" },
        { type: "Notification", id: notificationId },
      ],
    }),
  }),
});

export const {
  useGetAllNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useSendNotificationMutation,
  useDeleteNotificationMutation,
} = notificationSlice;

const selectNotificationResult = notificationSlice.endpoints.getAllNotifications.select;

const notificationSelectors = notificationAdapter.getSelectors();

export const selectNotificationsData = (token: string | null, userId: string | undefined) =>
  (state: RootState) =>
    selectNotificationResult({ token, userId })(state)?.data ?? initialState;

export const selectAllNotifications = (token: string | null, userId: string | undefined) =>
  (state: RootState) =>
    notificationSelectors.selectAll(selectNotificationsData(token, userId)(state));

export const selectNotificationById = (token: string | null, userId: string | undefined, notificationId: number
) =>
  (state: RootState) =>
    notificationSelectors.selectById(selectNotificationsData(token, userId)(state), notificationId);

export const selectNotificationIds = (token: string | null, userId: string | undefined) =>
  (state: RootState) =>
    notificationSelectors.selectIds(selectNotificationsData(token, userId)(state));
