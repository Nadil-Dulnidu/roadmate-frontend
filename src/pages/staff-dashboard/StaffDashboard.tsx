import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/pages/staff-dashboard/components/app-sidebar";
import { SiteHeader } from "@/pages/staff-dashboard/components/site-header";
import { SectionCards } from "@/pages/staff-dashboard/components/section-cards";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Helmet } from "react-helmet";
import { AllActiveBookingDataTable } from "./components/AllActiveBookingTable";
import { PendingVehicleDataTable } from "./components/PendingVehicleDataTable";
import { ChartReviewOverview } from "./components/chart-area-interactive";

const StaffDashboard = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const router = useNavigate();

  useEffect(() => {
    if (isSignedIn && isLoaded && user?.publicMetadata.role === "STAFF") {
      return;
    } else {
      router("/auth/signup");
    }
  }, [isLoaded, router, user, isSignedIn]);

  return (
    <>
      <Helmet>
        <title>Staff Dashboard | RoadMate</title>
        <meta name="description" content="Staff Dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      <SidebarProvider>
        <AppSidebar variant="inset" collapsible="icon" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <SectionCards />
                <div className="px-4 lg:px-6">{<ChartReviewOverview />}</div>
                <div className="flex-col gap-6 xl:flex-row flex xl:gap-0">
                  <AllActiveBookingDataTable />
                  <PendingVehicleDataTable />
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
};

export default StaffDashboard;
