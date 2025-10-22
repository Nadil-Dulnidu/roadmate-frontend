import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AlertCircle, Bell, Car, Check, Clock, CreditCard, Trash2 } from "lucide-react";
import { useGetAllNotificationsQuery, selectAllNotifications, useMarkNotificationAsReadMutation, useDeleteNotificationMutation } from "../notificationSlice";
import { useAppSelector } from "@/app/hook";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useEffect, useState, type JSX } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { toast } from "sonner";
import TimeAgo from "@/components/TimeAgo";
import { Button } from "@/components/ui/button";

export function NotificationPopover() {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const { getToken } = useAuth();
  const { user } = useUser();
  const userId = user?.id;

  useEffect(() => {
    const fetchToken = async () => {
      if (userId) {
        const token = await getToken({ template: "RoadMate" });
        setAuthToken(token);
      }
    };
    fetchToken();
  }, [getToken, userId]);

  const { error, isLoading, isSuccess, isError } = useGetAllNotificationsQuery({ userId: userId, token: authToken }, { skip: !authToken || !userId });
  const notifications = useAppSelector(selectAllNotifications(authToken, userId));
  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const [markNotificationAsRead] = useMarkNotificationAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "BOOKING":
        return <Car className="w-4 h-4 text-slate-600" />;
      case "PAYMENT":
        return <CreditCard className="w-4 h-4 text-slate-600" />;
      case "REMINDER":
        return <Clock className="w-4 h-4 text-slate-600" />;
      case "ALERT":
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await markNotificationAsRead({ notificationId: id, token: authToken }).unwrap();
    } catch (error) {
      toast.error("Failed to mark notification as read.");
      console.error(`Failed to mark notification ${id} as read:`, error);
    }
  };
  const markAllAsRead = () => {
    console.log("Mark all as read");
  };

  const handleDelete = async (id: number) => {
      try{
        await deleteNotification({ notificationId: id, token: authToken }).unwrap();
      } catch (error) {
        toast.error("Failed to delete notification.");
        console.error(`Failed to delete notification ${id}:`, error);
      }
  }

  const renderNotifications = () => {
    let content: JSX.Element | null = null;
    if (isLoading) {
      content = <LoadingSpinner size={35} stroke={3.5} speed={1} color="black" />;
    } else if (isSuccess) {
      content = (
        <>
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-500 text-sm">No notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {notifications.map((notification) => (
                <div key={notification.notification_id} className={`p-4 hover:bg-slate-50 transition-colors ${!notification.is_read ? "bg-blue-50/30" : ""}`}>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">{getNotificationIcon(notification.notification_type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className={`text-sm font-medium ${!notification.is_read ? "text-slate-900" : "text-slate-700"}`}>{notification.title}</h4>
                          <p className="text-sm text-slate-600 mt-1 leading-relaxed">{notification.message}</p>
                          <div className="flex align-middle items-center justify-between">
                            <p className="text-xs text-slate-500 mt-2">{<TimeAgo timestamp={notification.created_at} />}</p>
                            <Button className="flex justify-center items-center " variant="ghost" size="icon" onClick={() => handleDelete(notification.notification_id)} title="Delete notification">
                              <Trash2 className="w-3 h-3 text-red-400" />
                            </Button>
                          </div>
                        </div>
                        {!notification.is_read && (
                          <button
                            onClick={() => markAsRead(notification.notification_id)}
                            className="flex-shrink-0 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
                            title="Mark as read"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      );
    } else if (isError) {
      toast.error("Something went wrong. Error fetching Notifications.");
      let errorMessage = "An error occurred";
      if (error && typeof error === "object") {
        if ("status" in error) {
          errorMessage = `Error: ${JSON.stringify(error.data) || error.status}`;
        } else if ("message" in error) {
          errorMessage = (error as { message?: string }).message || errorMessage;
          console.error(errorMessage);
        }
      }
      content = (
        <div className="p-8 text-center">
          <Bell className="w-8 h-8 text-slate-300  mx-auto mb-2" />
          <p className="text-slate-500 text-sm">No notifications</p>
        </div>
      );
    }
    return content;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">{unreadCount > 9 ? "9+" : unreadCount}</span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 file:rounded-lg shadow-lg border border-slate-200 p-0 z-50 max-h-96 overflow-hidden" sideOffset={8} align="end">
        <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold ">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button onClick={markAllAsRead} className="text-xs text-slate-600 hover:text-slate-800 font-medium">
                  Mark all read
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="max-h-80 overflow-y-auto">{renderNotifications()}</div>
      </PopoverContent>
    </Popover>
  );
}
