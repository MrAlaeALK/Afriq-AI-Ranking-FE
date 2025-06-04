// src/components/app-sidebar.jsx
import {
  BarChart3,
  FileText,
  Gauge,
  Home,
  Layers,
  Trophy,
  Target,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "./ui/sidebar";

const navigationItems = [
  { title: "Tableau de Bord", url: "/admin", icon: Home },
  { title: "Documents", url: "/admin/documents", icon: FileText },
  { title: "Indicateurs", url: "/admin/indicators", icon: Target },
  { title: "Dimensions", url: "/admin/dimensions", icon: Layers },
  { title: "Scores", url: "/admin/scores", icon: Gauge },
  { title: "Classements", url: "/admin/rankings", icon: Trophy },
];

export function AppSidebar() {
  const { pathname } = useLocation();

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <BarChart3 className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">Classement IA</span>
                <span className="text-xs">Panneau Admin</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-2 ${isActive ? "text-primary font-semibold" : ""}`
                      }
                    >
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
