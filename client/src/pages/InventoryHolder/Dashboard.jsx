import { FaBoxes, FaClipboardList, FaExchangeAlt, FaTrash } from "react-icons/fa";

import Table from "../../components/common/Table";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";

function Dashboard() {
  const stats = [
    {
      title: "Total Assets",
      value: 154,
      icon: FaBoxes,
      color: "bg-blue-600",
    },
    {
      title: "Available Stock",
      value: 72,
      icon: FaClipboardList,
      color: "bg-green-600",
    },
    {
      title: "Pending Transfers",
      value: 5,
      icon: FaExchangeAlt,
      color: "bg-yellow-500",
    },
    {
      title: "Disposal Requests",
      value: 2,
      icon: FaTrash,
      color: "bg-red-500",
    },
  ];

  const activityColumns = [
    { header: "Ledger No.", accessor: "ledger" },
    { header: "Asset", accessor: "asset" },
    { header: "Action", accessor: "action" },
    { header: "Quantity", accessor: "quantity" },
    { header: "Date", accessor: "date" },
  ];

  const activityData = [
    {
      ledger: "L001",
      asset: "Dell Laptop",
      action: "Assigned",
      quantity: 1,
      date: "23 Jul 2026",
    },
    {
      ledger: "L002",
      asset: "HP Printer",
      action: "Received",
      quantity: 2,
      date: "22 Jul 2026",
    },
    {
      ledger: "L003",
      asset: "Monitor",
      action: "Transferred",
      quantity: 1,
      date: "21 Jul 2026",
    },
    {
      ledger: "L004",
      asset: "Scanner",
      action: "Disposed",
      quantity: 1,
      date: "20 Jul 2026",
    },
  ];
  return (
    <div>

      <PageHeader
        title="Inventory Holder Dashboard"
        subtitle="Welcome back, Aditya Raj"
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