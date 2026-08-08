import {
  FaHome,
  FaBoxes,
  FaDownload,
  FaUserCheck,
  FaExchangeAlt,
  FaTrash,
  FaUser,
  FaSignOutAlt,
  FaUsers,
  FaLayerGroup,
  FaBoxOpen,
} from "react-icons/fa";

export const inventoryHolderMenu = [
  {
    title: "Dashboard",
    path: "/inventory/dashboard",
    icon: FaHome,
  },
  {
    title: "Inventory",
    path: "/inventory/assets",
    icon: FaBoxes,
  },
  {
    title: "Receive Stock",
    path: "/inventory/receive-stock",
    icon: FaDownload,
  },
  {
    title: "Assign Assets",
    path: "/inventory/assignments",
    icon: FaUserCheck,
  },
  {
    title: "My Assets",
    path: "/inventory/my-assets",
    icon: FaBoxOpen,
  },
  {
    title: "Transfers",
    path: "/inventory/transfers",
    icon: FaExchangeAlt,
  },
  {
    title: "Disposals",
    path: "/inventory/disposals",
    icon: FaTrash,
  },
  {
    title: "Group Disposals",
    path: "/inventory/group-disposals",
    icon: FaTrash,
  },
  {
    title: "Profile",
    path: "/inventory/profile",
    icon: FaUser,
  }
];

export const userMenu = [
  {
    title: "Dashboard",
    path: "/user/dashboard",
    icon: FaHome,
  },
  {
    title: "My Assets",
    path: "/user/assets",
    icon: FaBoxes,
  },
  {
    title: "Transfer Request",
    path: "/user/transfer",
    icon: FaExchangeAlt,
  },
  {
    title: "Asset Disposal",
    path: "/user/disposals",
    icon: FaTrash,
  },
  {
    title: "Profile",
    path: "/user/profile",
    icon: FaUser,
  },
];

export const adminMenu = [
  {
    title: "Dashboard",
    path: "/admin/dashboard",
    icon: FaHome,
  },
  {
    title: "Users",
    path: "/admin/users",
    icon: FaUsers,
  },
  {
    title: "Groups",
    path: "/admin/groups",
    icon: FaLayerGroup,
  },
  {
    title: "Profile",
    path: "/admin/profile",
    icon: FaUser,
  }
];

export const accountMenu = [
  {
    title: "Profile",
    path: "/profile",
    icon: FaUser,
  },
  {
    title: "Logout",
    path: "/logout",
    icon: FaSignOutAlt,
  },
];