import { AppSidebar } from "@/pages/host-dashboard/components/app-sidebar";
import { ChartAreaInteractive } from "@/pages/host-dashboard/components/chart-area-interactive";
import { ActiveBookingDataTable } from "@/pages/host-dashboard/components/ActiveBookingTable";
import { SectionCards } from "@/pages/host-dashboard/components/section-cards";
import { SiteHeader } from "@/pages/host-dashboard/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useGetAllBookingByOwnerIdQuery, selectBookingsByOwner } from "@/features/booking/bookingSlice";
import { useAppSelector } from "@/app/hook";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { UpcommingBookingDataTable } from "@/pages/host-dashboard/components/UpcommingBookingTable";

const HostDashboard = () => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const { getToken, isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const router = useNavigate();
  const userId = user?.id;

  useEffect(() => {
    if (isSignedIn && isLoaded && user?.publicMetadata.role === "OWNER") {
      return;
    } else {
      router("/auth/signup");
    }
  }, [isLoaded, router, user, isSignedIn]);

  useEffect(() => {
    const fetchToken = async () => {
      const token = await getToken({ template: "RoadMate" });
      setAuthToken(token);
    };
    fetchToken();
  }, [getToken]);

  const { isSuccess } = useGetAllBookingByOwnerIdQuery({ token: authToken, ownerId: userId, status: ["CONFIRMED", "ACTIVE" , "COMPLETED"] }, { skip: !userId || !authToken });
  const bookings = useAppSelector(selectBookingsByOwner(authToken, userId, ["CONFIRMED", "ACTIVE" , "COMPLETED"]));

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">{isSuccess && <ChartAreaInteractive bookings={bookings} />}</div>
              <ActiveBookingDataTable />
              <UpcommingBookingDataTable />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default HostDashboard;
