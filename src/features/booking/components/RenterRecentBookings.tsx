import { useGetAllBookingByRenterIdQuery, selectBookingsByRenter } from "@/features/booking/bookingSlice";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useEffect, useState, type JSX } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAppSelector } from "@/app/hook";
import { toast } from "sonner";

const RenterRecentBookings = () => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [authToken, setAuthToken] = useState<string | null>(null);
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

  const { isLoading, isSuccess, isError, error } = useGetAllBookingByRenterIdQuery({ token: authToken, renterId: userId, status: [] }, { skip: !userId || !authToken });

  const allBookings = useAppSelector(selectBookingsByRenter(authToken, userId, []));

  const renderRecentBookings = () => {
    let content: JSX.Element | null = null;
    if (isLoading) {
      content = <LoadingSpinner size={35} stroke={3.5} speed={1} color="black" />;
    } else if (isSuccess) {
      content = (
        <>
          {allBookings.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">No Recent Bookings</p>
            </div>
          ) : (
            <div className="space-y-4">
              {allBookings.slice(0, 3).map((booking) => (
                <div key={booking.booking_id} className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">
                      {booking.vehicle.brand} {booking.vehicle.model} {booking.vehicle.year}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {booking.start_date} - {booking.end_date}
                    </p>
                    <p className="text-xs text-primary font-medium">Rate</p>
                  </div>
                  <p className="font-medium text-sm">{booking.total_price.toLocaleString("en-US", { style: "currency", currency: "LKR" })}</p>
                </div>
              ))}
            </div>
          )}
        </>
      );
    } else if (isError) {
      toast.error("Something went wrong. Error fetching Bookings");
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
        <div className="p-12 text-center">
          <p className="text-muted-foreground">No Recent Bookings</p>
        </div>
      );
    }
    return content;
  };

  return <>{renderRecentBookings()}</>;
};

export default RenterRecentBookings;
