import { FaLaptop, FaExchangeAlt, FaTrash, FaUndo, } from "react-icons/fa";

import { userActivity} from "../../data/mockData";

import Table from "../../components/common/Table";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";

function Dashboard() {
  const stats = [
        {
            title: "Assigned Assets",
            value: 4,
            icon: FaLaptop,
            color: "bg-blue-600",
        },
        {
            title: "Transfer Requests",
            value: 2,
            icon: FaExchangeAlt,
            color: "bg-yellow-500",
        },
        {
            title: "Disposal Requests",
            value: 1,
            icon: FaTrash,
            color: "bg-red-500",
        },
        {
            title: "Returned Assets",
            value: 7,
            icon: FaUndo,
            color: "bg-green-600",
        },
    ];

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
  return (
    <div>

      <PageHeader
        title="User Dashboard"
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
              columns={columns}
              data={userActivity}
          />

      </div>

    </div>
  );
}

export default Dashboard;