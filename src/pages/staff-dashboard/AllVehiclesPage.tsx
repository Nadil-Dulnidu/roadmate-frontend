import { selectAllVehicles, useGetAllVehiclesQuery } from "@/features/vehicle/vehicleSlice"
import { useAppSelector } from "@/app/hook"
import { AllVehiclesTable } from "./components/AllVehiclesTable"
import { Helmet } from "react-helmet"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "../staff-dashboard/components/app-sidebar"
import { SiteHeader } from "../staff-dashboard/components/site-header"
import { Loader } from "lucide-react"
import { useEffect } from "react"
import { useUser, useAuth } from "@clerk/clerk-react"
import { useNavigate } from "react-router"

const AllVehiclesPage = () => {
  const {isLoading} = useGetAllVehiclesQuery({ listingStatus: [], vehicleStatus: [] })
  const vehicles = useAppSelector(selectAllVehicles([], []))
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
        <title>Staff Dashboard - Vehicles | RoadMate</title>
        <meta name="description" content="Staff Dashboard - vehicles" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      <SidebarProvider>
        <AppSidebar variant="inset" collapsible="icon" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <div className="flex-col gap-6 xl:flex-row flex xl:gap-0">
                  {isLoading ? <Loader /> : <AllVehiclesTable data={vehicles} />}
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
     </>
  )
}

export default AllVehiclesPage
