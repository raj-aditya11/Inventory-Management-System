import { useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

import {
    FaBell,
    FaUserCircle,
    FaSignOutAlt,
    FaUser,
} from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

function Navbar({ role }) {

    const navigate = useNavigate();

    const { logout, user } = useAuth();

    const location = useLocation();

    // Profile menu
    const [showMenu, setShowMenu] = useState(false);

    // Notification menu
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const menuRef = useRef(null);
    const notificationRef = useRef(null);

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


    // -----------------------------------------
    // Logout
    // -----------------------------------------

    const handleLogout = () => {

        logout();

        navigate("/");

    };


    // -----------------------------------------
    // Get unread notification count
    // -----------------------------------------

    const loadUnreadCount = async () => {

        try {

            const response = await api.get(
                "/notifications/unread"
            );

            setUnreadCount(
                response.data.unreadCount
            );

        } catch (error) {

            console.error(
                "Failed to load notification count:",
                error
            );

        }

    };


    // -----------------------------------------
    // Get notifications
    // -----------------------------------------

    const loadNotifications = async () => {

        try {

            const response = await api.get(
                "/notifications"
            );

            setNotifications(
                response.data.notifications
            );

        } catch (error) {

            console.error(
                "Failed to load notifications:",
                error
            );

        }

    };


    // -----------------------------------------
    // Bell click
    // -----------------------------------------

    const handleNotificationClick = async () => {

        const nextState = !showNotifications;

        setShowNotifications(nextState);

        // Close profile menu
        setShowMenu(false);

        if (nextState) {

            await loadNotifications();

        }

    };


    // -----------------------------------------
    // Mark one notification as read
    // -----------------------------------------

    const handleMarkAsRead = async (notification) => {

        if (notification.is_read === 1) {
            return;
        }

        try {

            await api.put(
                `/notifications/${notification.notification_id}/read`
            );

            setNotifications((prev) =>
                prev.map((item) =>
                    item.notification_id ===
                    notification.notification_id
                        ? {
                            ...item,
                            is_read: 1,
                        }
                        : item
                )
            );

            setUnreadCount((prev) =>
                Math.max(prev - 1, 0)
            );

        } catch (error) {

            console.error(
                "Failed to mark notification as read:",
                error
            );

        }

    };


    // -----------------------------------------
    // Mark all as read
    // -----------------------------------------

    const handleMarkAllAsRead = async () => {

        if (unreadCount === 0) {
            return;
        }

        try {

            await api.put(
                "/notifications/read"
            );

            setNotifications((prev) =>
                prev.map((notification) => ({
                    ...notification,
                    is_read: 1,
                }))
            );

            setUnreadCount(0);

        } catch (error) {

            console.error(
                "Failed to mark all notifications as read:",
                error
            );

        }

    };


    // -----------------------------------------
    // Load unread count when Navbar mounts
    // -----------------------------------------

    useEffect(() => {

        loadUnreadCount();

    }, []);


    // -----------------------------------------
    // Close menus when clicking outside
    // -----------------------------------------

    useEffect(() => {

        const handleClickOutside = (event) => {

            if (
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {

                setShowMenu(false);

            }

            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target)
            ) {

                setShowNotifications(false);

            }

        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {

            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

        };

    }, []);


    // -----------------------------------------
    // Format notification date
    // -----------------------------------------

    const formatDate = (date) => {

        return new Date(date).toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }
        );

    };


    return (

        <header className="h-14 bg-white border-b flex items-center justify-between px-6">

            {/* Left */}

            <div>

                <h2 className="text-xl font-semibold text-slate-800">

                    {currentPage}

                </h2>

            </div>


            {/* Right */}

            <div className="flex items-center gap-6">


                {/* Notification Bell */}

                <div
                    ref={notificationRef}
                    className="relative"
                >

                    <button
                        onClick={handleNotificationClick}
                        className="relative text-slate-600 hover:text-blue-600 transition"
                    >

                        <FaBell size={20} />

                        {unreadCount > 0 && (

                            <span className="absolute -top-2 -right-2 min-w-4 h-4 px-1 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">

                                {unreadCount > 99
                                    ? "99+"
                                    : unreadCount
                                }

                            </span>

                        )}

                    </button>


                    {/* Notification Dropdown */}

                    {showNotifications && (

                        <div className="absolute right-0 mt-3 w-96 bg-white border rounded-lg shadow-xl z-50 overflow-hidden">


                            {/* Header */}

                            <div className="flex items-center justify-between px-4 py-3 border-b">

                                <div>

                                    <h3 className="font-semibold text-slate-800">

                                        Notifications

                                    </h3>

                                    <p className="text-xs text-slate-500">

                                        {unreadCount} unread

                                    </p>

                                </div>


                                {unreadCount > 0 && (

                                    <button
                                        onClick={handleMarkAllAsRead}
                                        className="text-xs text-blue-600 hover:text-blue-800"
                                    >

                                        Mark all as read

                                    </button>

                                )}

                            </div>


                            {/* Notifications */}

                            <div className="max-h-96 overflow-y-auto">

                                {notifications.length === 0 ? (

                                    <div className="px-4 py-10 text-center text-sm text-slate-500">

                                        No notifications.

                                    </div>

                                ) : (

                                    notifications.map(
                                        (notification) => (

                                            <button
                                                key={
                                                    notification.notification_id
                                                }
                                                onClick={() =>
                                                    handleMarkAsRead(
                                                        notification
                                                    )
                                                }
                                                className={`w-full text-left px-4 py-3 border-b hover:bg-slate-50 transition ${
                                                    notification.is_read === 0
                                                        ? "bg-blue-50"
                                                        : "bg-white"
                                                }`}
                                            >

                                                <div className="flex items-start gap-3">

                                                    {/* Unread indicator */}

                                                    <div
                                                        className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${
                                                            notification.is_read === 0
                                                                ? "bg-blue-600"
                                                                : "bg-transparent"
                                                        }`}
                                                    />

                                                    <div className="flex-1 min-w-0">

                                                        <p className="text-sm font-semibold text-slate-800">

                                                            {
                                                                notification.title
                                                            }

                                                        </p>

                                                        <p className="text-sm text-slate-600 mt-1">

                                                            {
                                                                notification.message
                                                            }

                                                        </p>

                                                        <p className="text-xs text-slate-400 mt-2">

                                                            {
                                                                formatDate(
                                                                    notification.created_at
                                                                )
                                                            }

                                                        </p>

                                                    </div>

                                                </div>

                                            </button>

                                        )
                                    )

                                )}

                            </div>

                        </div>

                    )}

                </div>


                {/* Profile Menu */}

                <div
                    ref={menuRef}
                    className="relative"
                >

                    <div
                        onClick={() => {

                            setShowMenu(!showMenu);

                            setShowNotifications(false);

                        }}
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


                    {/* Profile Dropdown */}

                    {showMenu && (

                        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">

                            <button
                                onClick={() => {

                                    navigate(
                                        profileRoutes[user.role]
                                    );

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