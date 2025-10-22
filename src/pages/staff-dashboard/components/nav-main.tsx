import { PlusCircleIcon, type LucideIcon } from "lucide-react";
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { NavLink } from "react-router";
import { NotificationPopover } from "@/features/notification/components/NotificationPopover";
import { useState } from "react";
import CreateAnnounsementModel from "@/features/notification/components/CreateAnnounsementModel";
export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
  }[];
}) {

  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);

  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent className="flex flex-col gap-2">
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center gap-2">
              <SidebarMenuButton
                tooltip="Announcement"
                className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
                onClick={() => setIsAnnouncementModalOpen(true)}
              >
                <PlusCircleIcon />
                <span>Announcement</span>
              </SidebarMenuButton>
              <NotificationPopover />
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarMenu>
            {items.map((item) => (
              <NavLink to={item.url} key={item.title} className={({ isActive }) => (isActive ? "bg-accent text-black rounded-md" : "text-muted-foreground hover:bg-accent hover:text-black hover:rounded-md")}>
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </NavLink>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <CreateAnnounsementModel isOpen={isAnnouncementModalOpen} onClose={() => setIsAnnouncementModalOpen(false)} />
    </>
  );
}
