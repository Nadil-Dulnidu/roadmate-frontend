import { useAppSelector } from "@/app/hook"
import { AppSidebar } from "@/pages/host-dashboard/components/app-sidebar"
import { DataTableFull } from "@/pages/host-dashboard/components/data-table-full"
import { SiteHeader } from "@/pages/host-dashboard/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { useGetAllBookingByOwnerIdQuery, selectBookingsByOwner } from "@/features/booking/bookingSlice"
import { useAuth, useUser } from "@clerk/clerk-react"
import { useEffect, useState } from "react"


const BookingPage = () => {
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

  const {isSuccess} = useGetAllBookingByOwnerIdQuery({token: authToken, ownerId: userId, status: []}, { skip: !userId || !authToken });
  const bookings = useAppSelector(selectBookingsByOwner(authToken, userId, []));

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
             {isSuccess ? (<DataTableFull data={bookings} />) : "" }
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default BookingPage
