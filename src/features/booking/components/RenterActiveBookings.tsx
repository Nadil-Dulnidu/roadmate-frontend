import { useGetAllBookingByRenterIdQuery, selectBookingsByRenter } from "@/features/booking/bookingSlice";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useEffect, useState, type JSX } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAppSelector } from "@/app/hook";
import { toast } from "sonner";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Car } from "lucide-react";

const RenterBooking = () => {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [authToken, setAuthToken] = useState<string | null>(null);
  const userId = user?.id;
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 2;

  useEffect(() => {
    const fetchToken = async () => {
      if (userId) {
        const token = await getToken({ template: "RoadMate" });
        setAuthToken(token);
      }
    };
    fetchToken();
  }, [getToken, userId]);

  const { isLoading, isSuccess, isError, error } = useGetAllBookingByRenterIdQuery({ token: authToken, renterId: userId, status: ["ACTIVE", "CONFIRMED"] }, { skip: !userId || !authToken });

  const allBookings = useAppSelector(selectBookingsByRenter(authToken, userId, ["ACTIVE", "CONFIRMED"]));
  const totalBookings = allBookings?.length || 0;
  const totalPages = Math.ceil(totalBookings / pageSize);
  const paginatedBookings = allBookings?.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderActiveBookings = () => {
    let content: JSX.Element | null = null;
    if (isLoading) {
      content = <LoadingSpinner size={35} stroke={3.5} speed={1} color="black" />;
    } else if (isSuccess) {
      content = (
        <>
          {paginatedBookings.length === 0 ? (
            <div className="p-12 text-center">
              <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No Active Bookings</p>
            </div>
          ) : (
            <div className="space-y-4">
              {paginatedBookings.map((booking) => (
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
          )}
          {totalPages > 1 && (
            <div className="m-0 mt-4 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem className="cursor-pointer">
                    <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => (
                    <PaginationItem key={i + 1} className="cursor-pointer">
                      <PaginationLink isActive={currentPage === i + 1} onClick={() => handlePageChange(i + 1)}>
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem className="cursor-pointer">
                    <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
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
          <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No Active Bookings</p>
        </div>
      );
    }
    return content;
  };

  return <>{renderActiveBookings()}</>;
};

export default RenterBooking;
