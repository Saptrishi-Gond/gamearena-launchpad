import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Trophy, Ticket, Coins, Bell, MessageSquare, Settings } from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";
import { Flame } from "lucide-react";

const items = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard, end: true },
  { title: "Tournaments", url: "/admin/tournaments", icon: Trophy },
  { title: "Bookings", url: "/admin/bookings", icon: Ticket },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Wallet Logs", url: "/admin/wallet", icon: Coins },
  { title: "Support", url: "/admin/support", icon: MessageSquare },
  { title: "Notifications", url: "/admin/notify", icon: Bell },
];

export const AdminSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent>
        <div className="flex items-center gap-2 px-3 py-4 border-b border-border">
          <Flame className="h-6 w-6 text-primary animate-flicker" />
          {!collapsed && <span className="font-display font-black tracking-wider text-sm">ADMIN</span>}
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Manage</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.end}
                      className={({ isActive }) =>
                        `flex items-center gap-2 ${isActive ? "bg-primary/15 text-primary font-semibold" : "hover:bg-muted/50"}`
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
