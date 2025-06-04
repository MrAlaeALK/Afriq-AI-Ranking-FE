import { Outlet } from "react-router-dom";
import { AppSidebar } from "../components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar"

const AdminLayout = () => (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
)

export default AdminLayout;

