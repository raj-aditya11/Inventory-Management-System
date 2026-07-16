import { FaUsers, FaUserCheck, FaLayerGroup, FaBoxes } from "react-icons/fa";

import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import Table from "../../components/common/Table";

function Dashboard() {
    const stats = [
        {
            title: "Total Users",
            value: 125,
            icon: FaUsers,
            color: "bg-blue-600",
        },
        {
            title: "Total Groups",
            value: 8,
            icon: FaLayerGroup,
            color: "bg-green-600",
        },
        {
            title: "Inventory Holders",
            value: 6,
            icon: FaBoxes,
            color: "bg-yellow-500",
        },
        {
            title: "Active Users",
            value: 118,
            icon: FaUserCheck,
            color: "bg-purple-600",
        },
    ];

    const activity = [
        {
            admin: "Admin",
            action: "Created User",
            target: "Rahul Sharma",
            date: "23 Jul 2026",
        },
        {
            admin: "Admin",
            action: "Updated Group",
            target: "IT Department",
            date: "22 Jul 2026",
        },
        {
            admin: "Admin",
            action: "Disabled User",
            target: "Amit Kumar",
            date: "21 Jul 2026",
        },
        {
            admin: "Admin",
            action: "Reset Password",
            target: "Priya Singh",
            date: "20 Jul 2026",
        },
    ];

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

                {stats.map((stat) => (

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
                <h2 className="text-3xl font-bold mb-4">
                    Recent Activity
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