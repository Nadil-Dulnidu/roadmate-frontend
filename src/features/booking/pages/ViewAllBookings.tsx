import { useEffect, useState } from "react";
import { Car, Calendar, Clock, MapPin, ArrowRight } from "lucide-react";
import { useGetAllBookingByRenterIdQuery, selectBookingsByRenter } from "../bookingSlice";
import { useAppSelector } from "@/app/hook";
import type { JSX } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { toast } from "sonner";
import { format } from "date-fns";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Link } from "react-router";

export function ViewAllBookings() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [authToken, setAuthToken] = useState<string | null>(null);
  const userId = user?.id;
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "COMPLETED":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const statusCounts = {
    All: allBookings.length,
    ACTIVE: allBookings.filter((b) => b.status === "ACTIVE").length,
    CONFIRMED: allBookings.filter((b) => b.status === "CONFIRMED").length,
    COMPLETED: allBookings.filter((b) => b.status === "COMPLETED").length,
    CANCELLED: allBookings.filter((b) => b.status === "CANCELLED").length,
  };

  const filteredBookings = allBookings.filter((booking) => {
    const matchesStatus = statusFilter === "All" || booking.status === statusFilter;
    return matchesStatus;
  });

  const totalBookings = filteredBookings.length || 0;
  const totalPages = Math.ceil(totalBookings / pageSize);

  const paginatedBookings = filteredBookings.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const RenderBookings = () => {
    let content: JSX.Element | null = null;
    if (isLoading) {
      content = <LoadingSpinner size={35} stroke={3.5} speed={1} color="black" />;
    } else if (isSuccess) {
      content = (
        <>
          {filteredBookings.length === 0 ? (
            <div className="p-12 text-center">
              <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No bookings found matching your criteria</p>
            </div>
          ) : (
            paginatedBookings.map((booking) => (
              <div key={booking.booking_id} className="p-6 hover:bg-accent/50 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Vehicle Image and Info */}
                  <div className="flex items-center space-x-4 flex-1">
                    <img src={booking.vehicle.images[0].image_url} alt={booking.vehicle.model} className="w-20 h-20 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-lg">
                        {booking.vehicle.brand} {booking.vehicle.model} {booking.vehicle.year}
                      </h4>
                      <p className="text-sm text-muted-foreground">{booking.vehicle.vehicle_type}</p>
                      <div className="gap-2 flex flex-col lg:flex-row lg:gap-5 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{booking.vehicle.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {format(booking.start_date, "MMM dd, yyyy")} - {format(booking.end_date, "MMM dd, yyyy")}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{(new Date(booking.end_date).getTime() - new Date(booking.start_date).getTime()) / (1000 * 60 * 60 * 24)} days</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Status and Amount */}
                  <div className="flex flex-col lg:flex-row items-end lg:items-center gap-4 lg:gap-6">
                    <div className="text-right lg:text-left">
                      <p className="text-lg font-semibold">{booking.total_price.toLocaleString("en-US", { style: "currency", currency: "LKR" })}</p>
                      <p className="text-sm text-muted-foreground">Booked: {format(new Date(booking.created_at), "MMM dd, yyyy")}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>{booking.status}</div>
                  </div>
                </div>
              </div>
            ))
          )}
          {totalPages > 1 && (
            <div className="py-4 flex justify-center">
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
      content = <p className="text-center text-gray-500 text-sm">Empty bookings</p>;
    }
    return content;
  };

  return (
    <div className="container mx-auto px-8 py-8">
      {/* Page Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-2">All Bookings</h2>
        <p className="text-muted-foreground">Manage and view your rental history</p>
        </div>
        <div>
          <Link to="/dashboard/renter"> <p className="text-primary text-sm font-medium">Dashboard <ArrowRight className="inline-block ml-1 size-5" /></p></Link>
        </div>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {Object.entries(statusCounts).map(([status, count]) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`p-4 rounded-lg border transition-colors ${statusFilter === status ? "border-primary bg-primary/5 text-primary" : "border-border bg-card hover:bg-accent"}`}
          >
            <div className="text-center">
              <p className="text-xl font-bold">{count}</p>
              <p className="text-sm text-muted-foreground">{status.charAt(0).toUpperCase() + status.slice(1).toLocaleLowerCase()}</p>
            </div>
          </button>
        ))}
      </div>
      {/* Bookings List */}
      <div className="bg-card rounded-lg border border-border">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold">
            {filteredBookings.length} Booking
            {filteredBookings.length !== 1 ? "s" : ""}
          </h3>
        </div>
        <div className="divide-y divide-border">{RenderBookings()}</div>
      </div>
    </div>
  );
}
