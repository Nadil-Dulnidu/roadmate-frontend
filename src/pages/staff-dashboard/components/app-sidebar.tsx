import * as React from "react";
import { Calendar, Car, Home, LayoutDashboardIcon, User } from "lucide-react";

import { NavMain } from "@/pages/staff-dashboard/components/nav-main";
import { NavUser } from "@/pages/staff-dashboard/components/nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Link } from "react-router";
import Logo from "@/assets/logo.png";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/staff-dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Vehicles",
      url: "/staff-dashboard/vehicles",
      icon: Car,
    },
    {
      title: "Bookings",
      url: "/staff-dashboard/bookings",
      icon: Calendar,
    },
    {
      title: "Customers",
      url: "/staff-dashboard/customers",
      icon: User,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5" tooltip={"Home"}>
              <Link to="/">
                <Home>
                  {" "}
                  <img src={Logo} alt="RoadMate Logo" className="size-8 rounded-full" />
                </Home>
                <span className="text-base font-semibold">RoadMate</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
