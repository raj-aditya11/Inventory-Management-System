import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

import { Outlet } from "react-router-dom";

function DashboardLayout({ menu, role}) {
  return (
    <div className="flex h-screen">

      {/* Sidebar */}
      <Sidebar menu = {menu}/>

      {/* Main Content */}
      <div className="flex flex-col flex-1">

        {/* Navbar */}
        <Navbar role = {role}/>

        {/* Page Content */}
        <main className="flex-1 p-6 bg-gray-100 overflow-auto">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default DashboardLayout;