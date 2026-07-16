import { useNavigate } from "react-router-dom";

import { FaPlus } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";

import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Table from "../../components/common/Table";

import { inventoryData } from "../../data/mockData";

function Inventory() {
    const navigate = useNavigate();

    const columns = [
        {
            header: "Ledger No.",
            accessor: "ledger",
        },
        {
            header: "Asset",
            accessor: "asset",
        },
        {
            header: "Category",
            accessor: "category",
        },
        {
            header: "Quantity",
            accessor: "quantity",
        },
        {
            header: "Status",
            accessor: "status",

            render: (value) => {

                const colors = {
                Available: "bg-green-100 text-green-700",
                Assigned: "bg-yellow-100 text-yellow-700",
                "Under Maintenance": "bg-red-100 text-red-700",
                };

                return (
                <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[value]}`}
                >
                    {value}
                </span>
                );
            },
        },
        {
            header: "Actions",
            accessor: "id",

            render: () => (
                <Button
                size="sm"
                variant="primary"
                >
                View
                </Button>
            ),
        },
    ];
    return (
        <div className="space-y-6">

            <PageHeader
            title="Inventory"
            subtitle="Manage all inventory items."
            />

            {/* Search + Button */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">

                <div className="w-full md:max-w-md">

                    <Input
                    placeholder="Search inventory..."
                    icon={FaSearch}
                    />

                </div>

                <Button
                    icon={FaPlus}
                    onClick={() => navigate("/inventory/receive-stock")}
                >
                    Receive New Stock
                </Button>

            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <Table
                    columns={columns}
                    data={inventoryData}
                />
            </div>

        </div>
    );
}

export default Inventory;