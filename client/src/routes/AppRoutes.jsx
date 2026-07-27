import {BrowserRouter, Routes, Route} from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

import {inventoryHolderMenu, adminMenu, userMenu} from "../data/navigation";

//Login
import Login from "../pages/Auth/Login";

//Admin
import AdminDashboard from "../pages/Admin/Dashboard";
import Users from "../pages/Admin/Users";
import Groups from "../pages/Admin/Groups";

//Inventory Holder
import InventoryDashboard from "../pages/InventoryHolder/Dashboard";
import Inventory from "../pages/InventoryHolder/Inventory";
import ReceiveStock from "../pages/InventoryHolder/ReceiveStock";
import AssignAssets from "../pages/InventoryHolder/AssignAssets";
import Transfers from "../pages/InventoryHolder/Transfers";
import Disposal from "../pages/InventoryHolder/Disposal";
import GroupDisposals from "../pages/InventoryHolder/GroupDisposals";

//Users
import UserDashboard from "../pages/User/Dashboard";
import MyAssets from "../pages/User/MyAssets";
import TransferRequests from "../pages/User/TransferRequest";
import DisposalRequest from "../pages/User/DisposalRequest";
import Profile from "../pages/User/Profile";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                {/*...Login...*/}
                <Route path="/" element={<Login />} />

                {/*...Admin...*/}
                <Route
                    element={
                        <DashboardLayout
                            menu={adminMenu}
                            role="Admin"
                        />
                    }
                >

                    <Route
                        path="/admin/dashboard"
                        element={<AdminDashboard />}
                    />

                    <Route
                        path="/admin/users"
                        element={<Users />}
                    />

                    <Route
                        path="/admin/groups"
                        element={<Groups />}
                    />

                </Route>

                {/*...Inventory Holder...*/}
                <Route
                    element={
                        <DashboardLayout
                            menu={inventoryHolderMenu}
                            role="Inventory Holder"
                        />
                    }
                >

                    <Route
                        path="/inventory/dashboard"
                        element={<InventoryDashboard />}
                    />

                    <Route
                        path="/inventory/assets"
                        element={<Inventory />}
                    />

                    <Route
                        path="/inventory/receive-stock"
                        element={<ReceiveStock />}
                    />

                    <Route
                        path="/inventory/assignments"
                        element={<AssignAssets />}
                    />

                    <Route
                        path="/inventory/transfers"
                        element={<Transfers />}
                    />

                    <Route
                        path="/inventory/disposals"
                        element={<Disposal />}
                    />

                    <Route
                        path="/inventory/group-disposals"
                        element={<GroupDisposals />}
                    />

                </Route>

                {/*...User...*/}
                <Route
                    element={
                        <DashboardLayout
                            menu={userMenu}
                            role="User"
                        />
                    }
                >

                    <Route
                        path="/user/dashboard"
                        element={<UserDashboard />}
                    />

                    <Route
                        path="/user/assets"
                        element={<MyAssets />}
                    />

                    <Route
                        path="/user/transfer"
                        element={<TransferRequests />}
                    />

                    <Route
                        path="/user/disposals"
                        element={<DisposalRequest />}
                    />

                    <Route
                        path="/user/profile"
                        element={<Profile />}
                    />

                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;