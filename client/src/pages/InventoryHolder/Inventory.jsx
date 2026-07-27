import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { FaPlus } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";

import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Table from "../../components/common/Table";

import { inventoryData } from "../../data/mockData";

function Inventory() {
    const [selectedRows, setSelectedRows] = useState([]);

    const navigate = useNavigate();

    const columns = [
        {
            header: "Sr. No.",
            accessor: "srNo",
        },
        {
            header: "Ledger No.",
            accessor: "ledger",
        },
        {
            header: "Asset Name/Nomenclature",
            accessor: "asset",
        },
        {
            header: "Quantity/Unit",
            accessor: "quantity",
        },
        {
            header: "Condition",
            accessor: "condition",

            render: (value) => {

                const colors = {
                Serviceable: "bg-green-100 text-green-700",
                Unserviceable: "bg-red-100 text-red-700",
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
            header: "Location",
            accessor: "location",
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

            {selectedRows.length > 0 && (
                <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">

                    <p className="font-medium text-blue-700">
                        ✓ {selectedRows.length} Asset{selectedRows.length > 1 ? "s" : ""} Selected
                    </p>

                    <div className="flex gap-3">

                        <Button
                            onClick={() => {
                                console.log("selectedRows:", selectedRows);

                                const assets = inventoryData.filter(asset =>
                                    selectedRows.includes(asset.id)
                                );

                                navigate("/inventory/transfers", {
                                    state: {
                                        selectedAssets: assets,
                                    },
                                });
                            }}
                        >
                            Transfer Selected
                        </Button>

                        <Button
                            variant="danger"
                            onClick={() =>
                                navigate("/inventory/disposals", {
                                    state: {
                                        selectedAssets: inventoryData.filter(asset =>
                                            selectedRows.includes(asset.id)
                                        ),
                                    },
                                })
                            }
                        >
                            Dispose Selected
                        </Button>

                    </div>

                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
                <Table
                    columns={columns}
                    data={inventoryData}
                    selectable
                    selectedRows={selectedRows}
                    onSelectionChange={setSelectedRows}
                />
            </div>

        </div>
    );
}

export default Inventory;