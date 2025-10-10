import * as React from "react"
import {
  ArrowUpCircleIcon,
  Calendar,
  Car,
  DollarSign,
  LayoutDashboardIcon,
} from "lucide-react"

import { NavMain } from "@/pages/host-dashboard/components/nav-main"
import { NavUser } from "@/pages/host-dashboard/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link } from "react-router"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/host-dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Vehicles",
      url: "/host-dashboard/my-vehicles",
      icon: Car,
    },
    {
      title: "Bookings",
      url: "/host-dashboard/all-bookings",
      icon: Calendar,
    },
    {
      title: "Earnings",
      url: "#",
      icon: DollarSign,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to="/">
                <ArrowUpCircleIcon className="h-5 w-5" />
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
        <NavUser/>
      </SidebarFooter>
    </Sidebar>
  )
}
