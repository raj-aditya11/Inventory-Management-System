import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import {
    FaLaptop,
    FaExchangeAlt,
    FaTrash,
    FaCheckCircle,
} from "react-icons/fa";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

import Table from "../../components/common/Table";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";

function Dashboard() {

    const { user } = useAuth();

    const [stats, setStats] = useState(null);
    const [activityData, setActivityData] = useState([]);

    useEffect(() => {

        const loadDashboard = async () => {

            try {

                const response = await api.get(
                    "/dashboard/user"
                );

                setStats(response.data.stats);

                setActivityData(

                    response.data.recentActivity.map(item => ({

                        asset:
                            item.asset_name || "-",

                        activity:
                            item.action === "TRANSFERRED"
                                ? "Asset Transferred"
                                : item.action === "DISPOSED"
                                ? "Asset Disposed"
                                : item.action === "REJECTED"
                                ? "Transfer Rejected"
                                : item.action === "ASSIGNED"
                                ? "Asset Assigned"
                                : item.action === "RECEIVED"
                                ? "Asset Received"
                                : item.action,

                        date:
                            new Date(
                                item.created_at
                            ).toLocaleDateString(
                                "en-GB",
                                {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                }
                            ),

                    }))

                );

            } catch (error) {

                console.error(error);

                toast.error(
                    "Failed to load dashboard."
                );

            }

        };

        loadDashboard();

    }, []);

    const statCards = stats
        ? [

            {
                title: "Assigned Assets",
                value: stats.assignedAssets,
                icon: FaLaptop,
                color: "bg-blue-600",
            },

            {
                title: "Pending Transfers",
                value: stats.pendingTransfers,
                icon: FaExchangeAlt,
                color: "bg-yellow-500",
            },

            {
                title: "Assets Disposed",
                value: stats.disposals,
                icon: FaTrash,
                color: "bg-red-500",
            },

            {
                title: "Approved Transfers",
                value: stats.approvedTransfers,
                icon: FaCheckCircle,
                color: "bg-green-600",
            },

        ]
        : [];

    const columns = [

        {
            header: "Asset",
            accessor: "asset",
        },

        {
            header: "Activity",
            accessor: "activity",
        },

        {
            header: "Date",
            accessor: "date",
        },

    ];

    const userName =
        `${user?.first_name || ""} ${user?.last_name || ""}`.trim();

    return (

        <div>

            <PageHeader
                title="User Dashboard"
                subtitle={`Welcome back, ${
                    userName || "User"
                }`}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

                {statCards.map((stat) => (

                    <StatCard
                        key={stat.title}
                        title={stat.title}
                        value={stat.value}
                        icon={stat.icon}
                        color={stat.color}
                    />

                ))}

            </div>

            <div className="mt-10">

                <h2 className="text-2xl font-semibold text-slate-800 mb-5">
                    Recent Activity
                </h2>

                <Table
                    columns={columns}
                    data={activityData}
                />

            </div>

        </div>

    );

}

export default Dashboard;