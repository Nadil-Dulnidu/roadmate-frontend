import { useEffect, useState } from "react";
import { useGetAllBookingByRenterIdQuery, selectBookingsByRenter } from "@/features/booking/bookingSlice";
import { useAppSelector } from "@/app/hook";
import RenterActiveBooking from "@/features/booking/components/RenterActiveBookings";
import { Car, Calendar } from "lucide-react";
import RenterRecentBookings from "@/features/booking/components/RenterRecentBookings";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Link } from "react-router";
import RenterPendingBookings from "./RenterPendingBookings";

const RenterMyBookingSection = () => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const { getToken } = useAuth();
  const { user } = useUser();
  const userId = user?.id;

  useEffect(() => {
    const fetchToken = async () => {
      const token = await getToken();
      setAuthToken(token);
    };
    fetchToken();
  }, [getToken]);

  useGetAllBookingByRenterIdQuery({ token: authToken, renterId: userId, status: [] }, { skip: !userId || !authToken });
  const bookings = useAppSelector(selectBookingsByRenter(authToken, userId, []));

  const stats = [
    {
      label: "Active Rentals",
      value: bookings.filter((booking) => booking.status === "ACTIVE").length,
      icon: Car,
    },
    {
      label: "Total Bookings",
      value: bookings.length,
      icon: Calendar,
    },
  ];
  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-card p-4 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-xl font-bold mt-1">{stat.value}</p>
              </div>
              <stat.icon className="h-6 w-6 text-muted-foreground" />
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Rentals */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg border border-border p-6 min-h-72">
            <h3 className="text-lg font-semibold mb-4">Active & Upcoming Rentals</h3>
            <RenterActiveBooking />
          </div>
        </div>
        {/* Recent Bookings */}
        <div>
          <div className="bg-card rounded-lg border border-border p-6 min-h-72 relative">
            <h3 className="text-lg font-semibold mb-4">Recent Bookings</h3>
            <RenterRecentBookings />
            <div className="absolute bottom-4  left-1/2 transform -translate-x-1/2 w-full text-center">
              <Link to="/renter-dashboard/all-bookings">
                <button className="w-full mt-10 text-sm text-primary hover:underline">View All Bookings</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div>
        {/* Pending Bookings */}
        <div className="bg-card rounded-lg border border-border p-6 min-h-72 relative mt-6">
          <h3 className="text-lg font-semibold mb-4">Pending Bookings</h3>
          <RenterPendingBookings />
        </div>
      </div>
    </div>
  );
};

export default RenterMyBookingSection;
