import { Outlet } from "react-router-dom";
import { AppSidebar } from "../components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "../components/admin/sidebar"

const AdminLayout = () => (
    // <div className="flex min-h-screen">
    //     <AppSidebar />
    //     <main className="flex-1 p-6">
    //         <Outlet />
    //     </main>
    // </div>
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
)

export default AdminLayout;


// import React from "react";
// import { Outlet } from "react-router-dom";
// import Sidebar from "./Sidebar";

// const AdminLayout = () => (
//   <div className="flex min-h-screen bg-gray-50">
//     <Sidebar />
//     <main className="flex-1 p-6">
//       <Outlet />
//     </main>
//   </div>
// );

// export default AdminLayout;


// import React from "react";
// import { Outlet } from "react-router-dom";
// import Sidebar from "../components/AppSideBar";;

// const AdminLayout = () => (
//   <div className="flex min-h-screen bg-gray-50">
//     <Sidebar />
//     <main className="flex-1 p-6">
//       <Outlet />
//     </main>
//   </div>
// );

// export default AdminLayout;

