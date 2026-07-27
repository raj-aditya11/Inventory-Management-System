import { useLocation } from "react-router-dom";
import { FaBell, FaUserCircle } from "react-icons/fa";

function Navbar({ role }) {
  const location = useLocation();
  const pageTitles = {
    "/inventory/dashboard": "Dashboard",
    "/inventory/assets": "Inventory",
    "/inventory/receive-stock": "Receive Stock",
    "/inventory/assignments": "Assign Assets",
    "/inventory/transfers": "Transfers",
    "/inventory/disposals": "Disposals",
    "/inventory/group-disposals": "Group Disposals",

    "/admin/dashboard": "Dashboard",
    "/admin/users": "Users",
    "/admin/groups": "Groups",

    "/user/dashboard": "Dashboard",
    "/user/assets": "My Assets",
    "/user/transfer": "Transfer Request",
    "/user/disposals": "Disposals",
    "/user/profile": "Profile",
  };
  const currentPage = pageTitles[location.pathname];
  return (
    <header className="h-16 bg-white shadow-sm border-b flex items-center justify-between px-8">

      {/* Left */}
      <div>
        <h2 className="text-xl font-semibold text-slate-800">
          {currentPage}
        </h2>
      </div>

      {/* Right */}
      <div className="flex items-center gap-6">

        <button className="relative text-slate-600 hover:text-blue-600 transition">
          <FaBell size={20} />

          <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
            3
          </span>

        </button>

        <div className="flex items-center gap-2">

          <FaUserCircle
            size={30}
            className="text-slate-700"
          />

          <div>
            <p className="text-sm font-semibold">
              Aditya Raj
            </p>

            <p className="text-xs text-slate-500">
              {role}
            </p>
          </div>

        </div>

      </div>

    </header>
  );
}

export default Navbar;