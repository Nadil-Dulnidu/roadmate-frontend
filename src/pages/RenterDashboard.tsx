import RenterActiveBooking from "@/features/booking/components/RenterActiveBookings";
import { Car, Calendar } from "lucide-react";
import { Helmet } from "react-helmet";
import { useGetAllBookingByRenterIdQuery, selectBookingsByRenter } from "@/features/booking/bookingSlice";
import { useAppSelector } from "@/app/hook";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import RenterRecentBookings from "@/features/booking/components/RenterRecentBookings";

function RenterDashboard() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [authToken, setAuthToken] = useState<string | null>(null);
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
    <>
      <Helmet>
        <meta name="description" content="Manage your rentals and discover new vehicles" />
        <title>RoadMate | Renter Dashboard</title>
      </Helmet>
      <div className="w-full">
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.firstName}!</h2>
            <p className="text-muted-foreground">Manage your rentals and discover new vehicles</p>
          </div>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Active Rentals */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="text-lg font-semibold mb-4">Active & Upcoming Rentals</h3>
                <RenterActiveBooking />
              </div>
            </div>
            {/* Recent Bookings */}
            <div>
              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Bookings</h3>
                <RenterRecentBookings />
                <Link to="/dashboard/renter/allbookings">
                  <button className="w-full mt-4 text-sm text-primary hover:underline">View All Bookings</button>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default RenterDashboard;
