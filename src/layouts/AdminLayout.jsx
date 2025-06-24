import { Outlet } from "react-router-dom";
import { AppSidebar } from "../components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar"
import authService from "../services/authService";
import { useAuth } from "../context/AuthContext";

const AdminLayout = () => {
  const { logout } = useAuth();
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center gap-4 border-b px-6 py-3 bg-background">
            <SidebarTrigger />
            <div className="flex justify-between items-center w-full">
              <h1 className="text-xl font-semibold">Panneau d'administration - Classement des pays africains</h1>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium text-lg">{authService.getUsername()}</span>
                <button onClick={logout} className="px-4 py-2 bg-violet-600 text-white font-semibold rounded-md hover:bg-violet-700 transition">
                  Logout
                </button>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-6 bg-background">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

export default AdminLayout;

