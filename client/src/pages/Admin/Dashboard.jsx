import { useState, useEffect } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";

import { FaUsers, FaExchangeAlt , FaLayerGroup, FaBoxes } from "react-icons/fa";

import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import Table from "../../components/common/Table";

function Dashboard() {
    const [stats, setStats] = useState(null);

    const [activity, setActivity] = useState([]);

    useEffect(() => {

        const loadDashboard = async () => {

            try {

                const response = await api.get("/dashboard/admin");

                setStats(response.data.stats);

                setActivity(
                    response.data.recentActivity.map(item => {

                        const actionMap = {
                            ASSIGNED: "Asset Assigned",
                            TRANSFERRED: "Asset Transferred",
                            DISPOSED: "Asset Disposed",
                            REJECTED: "Transfer Rejected",
                        };

                        return {
                            admin: item.performed_by || "System",

                            action:
                                actionMap[item.action] || item.action,

                            target: item.remarks || "-",

                            date: new Date(
                                item.created_at
                            ).toLocaleDateString(
                                "en-GB",
                                {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                }
                            ),
                        };

                    })
                );

            } catch (error) {

                console.error(error);

                toast.error("Failed to load dashboard.");

            }

        };

        loadDashboard();

    }, []);

    const columns = [
        {
            header: "Admin",
            accessor: "admin",
        },
        {
            header: "Action",
            accessor: "action",
        },
        {
            header: "Target",
            accessor: "target",
        },
        {
            header: "Date",
            accessor: "date",
        },
    ];
    return (
        <div>
            <PageHeader
                title="Admin Dashboard"
                subtitle="Manage users, groups and system settings."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

                {stats && [

                    {
                        title: "Total Users",
                        value: stats.totalUsers,
                        icon: FaUsers,
                        color: "bg-blue-600",
                    },

                    {
                        title: "Total Groups",
                        value: stats.totalGroups,
                        icon: FaLayerGroup,
                        color: "bg-green-600",
                    },

                    {
                        title: "Inventory Assets",
                        value: stats.totalInventory,
                        icon: FaBoxes,
                        color: "bg-yellow-500",
                    },

                    {
                        title: "Pending Transfers",
                        value: stats.pendingTransfers,
                        icon: FaExchangeAlt,
                        color: "bg-purple-600",
                    },

                ].map(stat => (
                    <StatCard
                        key={stat.title}
                        {...stat}
                    />

                ))}

            </div>

            <div className="mt-10">
                <h2 className="text-3xl font-bold mb-4">
                    Latest System Activity
                </h2>

                <Table
                    columns={columns}
                    data={activity}
                />
            </div>
        </div>
    );
}

export default Dashboard;