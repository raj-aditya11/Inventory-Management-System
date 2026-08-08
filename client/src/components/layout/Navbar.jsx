import { useLocation } from "react-router-dom";
import { FaBell, FaUserCircle } from "react-icons/fa";

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaSignOutAlt, FaUser } from "react-icons/fa";

function Navbar({ role }) {

  const navigate = useNavigate();

  const { logout, user } = useAuth();

  const [showMenu, setShowMenu] = useState(false);

  const menuRef = useRef(null);

  const location = useLocation();
  const pageTitles = {
    "/inventory/dashboard": "Dashboard",
    "/inventory/assets": "Inventory",
    "/inventory/receive-stock": "Receive Stock",
    "/inventory/assignments": "Assign Assets",
    "/inventory/my-assets": "My Assets",
    "/inventory/transfers": "Transfers",
    "/inventory/disposals": "Disposals",
    "/inventory/group-disposals": "Group Disposals",
    "/inventory/profile": "Profile",

    "/admin/dashboard": "Dashboard",
    "/admin/users": "Users",
    "/admin/groups": "Groups",
    "/admin/profile": "Profile",

    "/user/dashboard": "Dashboard",
    "/user/assets": "My Assets",
    "/user/transfer": "Transfer Request",
    "/user/disposals": "Disposals",
    "/user/profile": "Profile",
  };
  const currentPage = pageTitles[location.pathname];

  const handleLogout = () => {

    logout();

    navigate("/");

  };

  const profileRoutes = {
    ADMIN: "/admin/profile",
    INVENTORY_HOLDER: "/inventory/profile",
    USER: "/user/profile",
  };

  const roleLabel = {
    ADMIN: "Admin",
    INVENTORY_HOLDER: "Inventory Holder",
    USER: "User",
  };

  useEffect(() => {

    const handleClickOutside = (event) => {

      if (
          menuRef.current &&
          !menuRef.current.contains(event.target)
      ) {

          setShowMenu(false);

      }

    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
          "mousedown",
          handleClickOutside
      );

  }, []);

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

          <div
              ref={menuRef}
              className="relative"
          >

              <div
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center gap-2 cursor-pointer"
              >

                  <FaUserCircle
                      size={30}
                      className="text-slate-700"
                  />

                  <div>
                      <p className="text-sm font-semibold">
                          {[
                              user?.first_name,
                              user?.middle_name,
                              user?.last_name,
                          ]
                              .filter(Boolean)
                              .join(" ")}
                      </p>

                      <p className="text-xs text-slate-500">
                          {roleLabel[user?.role]}
                      </p>
                  </div>

              </div>

              {showMenu && (

                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">

                      <button
                          onClick={() => {
                              navigate(profileRoutes[user.role]);
                              setShowMenu(false);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-100"
                      >
                          <FaUser />
                          Profile
                      </button>

                      <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-3 hover:bg-red-50 text-red-600"
                      >
                          <FaSignOutAlt />
                          Logout
                      </button>

                  </div>

              )}

          </div>

      </div>

    </header>
  );
}

export default Navbar;