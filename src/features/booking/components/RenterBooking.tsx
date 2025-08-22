import { useGetAllBookingByRenterIdQuery, selectAllBookingsByRenter } from "@/features/booking/bookingSlice";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useEffect, useState, type JSX } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAppSelector } from "@/app/hook";
import { toast } from "sonner";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

type RenterBookingProp = {
  active?: ["CONFIRMED", "ACTIVE"];
  completed?: ["COMPLETED", "CANCELLED"];
};

const RenterBooking = ({ active, completed }: RenterBookingProp) => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [authToken, setAuthToken] = useState<string | null>(null);
  const userId = user?.id;
  const [activePage, setActivePage] = useState(0);

  useEffect(() => {
    const fetchToken = async () => {
      if (userId) {
        const token = await getToken({ template: "RoadMate" });
        setAuthToken(token);
      }
    };
    fetchToken();
  }, [getToken, userId]);

  const { data, isLoading, isSuccess, isError, error } = useGetAllBookingByRenterIdQuery(
    { token: authToken, renterId: userId, page: activePage, size: 3, status: active ? ["CONFIRMED", "ACTIVE"] : completed ? ["COMPLETED", "CANCELLED"] : [] },
    { skip: !userId || !authToken }
  );
  const allBookings = useAppSelector(selectAllBookingsByRenter(authToken, userId, activePage, 3, active ? ["CONFIRMED", "ACTIVE"] : completed ? ["COMPLETED", "CANCELLED"] : []));

  const renderActiveBookings = () => {
    let content: JSX.Element | null = null;
    if (isLoading) {
      content = <LoadingSpinner size={35} stroke={3.5} speed={1} color="black" />;
    } else if (isSuccess) {
      const totalActivePages = data?.meta.totalPages;
      content = (
        <>
          <div className="space-y-4">
            {allBookings.map((booking) => (
              <div key={booking.booking_id} className="flex items-center space-x-4 p-4 border border-border rounded-lg">
                <img src={booking.vehicle.images[0].image_url} alt={booking.vehicle.brand} className="w-16 h-16 rounded-lg object-cover" />
                <div className="flex-1">
                  <h4 className="font-medium">
                    {booking.vehicle.brand} {booking.vehicle.model} {booking.vehicle.year}
                  </h4>
                  <p className="text-sm text-muted-foreground">{booking.vehicle.location}</p>
                  <p className="text-sm text-muted-foreground">
                    {booking.start_date} - {booking.end_date}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      booking.status === "CONFIRMED" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    }`}
                  >
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1).toLowerCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="m-0 mt-4 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem className="cursor-pointer">
                  <PaginationPrevious onClick={() => setActivePage((prev) => Math.max(prev - 1, 0))} />
                </PaginationItem>
                {Array.from({ length: totalActivePages }, (_, i) => (
                  <PaginationItem key={i} className="cursor-pointer">
                    <PaginationLink isActive={i === activePage} onClick={() => setActivePage(i)}>
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem className="cursor-pointer">
                  <PaginationNext onClick={() => setActivePage((prev) => Math.min(prev + 1, totalActivePages - 1))} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
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
      content = <p className="text-center text-gray-500 text-sm">Empty Activ bookings</p>;
    }
    return content;
  };

  const renderRecentBookings = () => {
    let content: JSX.Element | null = null;
    if (isLoading) {
      content = <LoadingSpinner size={35} stroke={3.5} speed={1} color="black" />;
    } else if (isSuccess) {
      content = (
        <div className="space-y-4">
          {allBookings.map((booking) => (
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
              <p className="font-medium text-sm">Rs.{booking.total_price.toLocaleString("en-IN")}</p>
            </div>
          ))}
        </div>
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
      content = <p className="text-center text-gray-500 text-sm">Empty Activ bookings</p>;
    }
    return content;
  };

  return (
    <>
      {active && renderActiveBookings()}
      {completed && renderRecentBookings()}
    </>
  );
};

export default RenterBooking;
