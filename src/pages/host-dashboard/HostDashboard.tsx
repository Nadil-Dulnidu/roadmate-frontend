import { AppSidebar } from "@/pages/host-dashboard/components/app-sidebar";
import { ChartAreaInteractive } from "@/pages/host-dashboard/components/chart-area-interactive";
import { DataTable } from "@/pages/host-dashboard/components/data-table";
import { SectionCards } from "@/pages/host-dashboard/components/section-cards";
import { SiteHeader } from "@/pages/host-dashboard/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useGetAllBookingByRenterIdQuery, selectBookingsByRenter } from "@/features/booking/bookingSlice";
import { useAppSelector } from "@/app/hook";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";

const HostDashboard = () => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const { getToken } = useAuth();
  const { user } = useUser();
  const userId = user?.id;
  
  useEffect(() => {
    const fetchToken = async () => {
      const token = await getToken({template : "RoadMate"});
      setAuthToken(token);
    };
    fetchToken();
  }, [getToken]);

  const {isSuccess} = useGetAllBookingByRenterIdQuery({token: authToken, renterId: userId, status: []}, { skip: !userId || !authToken });
  const bookings = useAppSelector(selectBookingsByRenter(authToken, userId, []));
  console.log(bookings)

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              {isSuccess ? (<DataTable data={bookings} />) : "" }
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default HostDashboard;
