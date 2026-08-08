import { useState, useEffect } from "react";

import { useAuth } from "../../context/AuthContext";

import {
    FaBoxes,
    FaClipboardList,
    FaExchangeAlt,
    FaTrash,
} from "react-icons/fa";

import api from "../../services/api";
import toast from "react-hot-toast";

import Table from "../../components/common/Table";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [activityData, setActivityData] = useState([]);

  const activityColumns = [
    { header: "Ledger No.", accessor: "ledger" },
    { header: "Asset", accessor: "asset" },
    { header: "Action", accessor: "action" },
    { header: "Quantity", accessor: "quantity" },
    { header: "Date", accessor: "date" },
  ];

  useEffect(() => {

      const loadDashboard = async () => {

          try {

              const response = await api.get(
                  "/dashboard/inventory-holder"
              );

              setStats(response.data.stats);

              setActivityData(
                  response.data.recentActivity.map(item => ({

                      ledger: item.ledger_number || "-",

                      asset: item.asset_name || "-",

                      action:
                        item.action === "TRANSFERRED"
                            ? "Asset Transferred"
                            : item.action === "RECEIVED"
                            ? "Asset Received"
                            : item.action === "DISPOSED"
                            ? "Asset Disposed"
                            : item.action === "REJECTED"
                            ? "Transfer Rejected"
                            : item.action === "ASSIGNED"
                            ? "Asset Assigned"
                            : item.action,

                      quantity: item.quantity,

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
            title: "Total Assets",
            value: stats.totalAssets,
            icon: FaBoxes,
            color: "bg-blue-600",
        },
        {
            title: "Available Stock",
            value: stats.availableStock,
            icon: FaClipboardList,
            color: "bg-green-600",
        },
        {
            title: "Pending Transfers",
            value: stats.pendingTransfers,
            icon: FaExchangeAlt,
            color: "bg-yellow-500",
        },
        {
            title: "Disposals",
            value: stats.disposals,
            icon: FaTrash,
            color: "bg-red-500",
        },
    ]
    : [];

  return (
    <div>

      <PageHeader
        title="Inventory Holder Dashboard"
        subtitle={`Welcome back, ${
            `${user?.first_name || ""} ${user?.last_name || ""}`.trim()
            || "Inventory Holder"
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
              columns={activityColumns}
              data={activityData}
          />

      </div>

    </div>
  );
}

export default Dashboard;