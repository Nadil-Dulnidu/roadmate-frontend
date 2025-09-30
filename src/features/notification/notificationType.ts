export interface NotificationType {
  notification_id: number;
  notification_type: NotificationTypes[keyof NotificationTypes];
  title: string;
  user_id: string;
  message: string;
  is_read: boolean;
  created_at: Date;
}

export type NotificationTypes = {
  BOOKING: "BOOKING",
  PAYMENT: "PAYMENT",
  REMINDER: "REMINDER",
  ALERT: "ALERT",
  REVIEW: "REVIEW",
}

export interface NotificationPayload {
  user_id: string | undefined;
  title: string;
  notification_type: NotificationTypes[keyof NotificationTypes];
  message: string;
}