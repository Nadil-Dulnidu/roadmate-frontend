import { Helmet } from "react-helmet";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../staff-dashboard/components/app-sidebar";
import { SiteHeader } from "../staff-dashboard/components/site-header";
import { CustomerTable } from "../staff-dashboard/components/CustomerTable";
import { useGetUsersQuery, selectAllUsers } from "@/features/user/userSlice";
import { useAppSelector } from "@/app/hook";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const CustomerPage = () => {
  const [authToken, setAuthToken] = useState<string | null>(null);
    const { getToken, isSignedIn, isLoaded } = useAuth();
    const { user } = useUser();
    const router = useNavigate();
  
    useEffect(() => {
      if (isSignedIn && isLoaded && user?.publicMetadata.role === "STAFF") {
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
    
    const { isSuccess } = useGetUsersQuery({ roles: ["RENTER", "OWNER"], token: authToken }, { skip: !authToken });
    const data = useAppSelector(selectAllUsers(authToken, ["RENTER", "OWNER"]));
    
  
    return (
      <>
        <Helmet>
          <title>Staff Dashboard - Customers | RoadMate</title>
          <meta name="description" content="Staff Dashboard - bookings" />
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
                    {isSuccess &&  <CustomerTable data={data} />}
                  </div>
                </div>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </>
    );
}

export default CustomerPage
