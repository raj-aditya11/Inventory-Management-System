import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { FaPlus } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";

import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Table from "../../components/common/Table";

import api from "../../services/api";
import toast from "react-hot-toast";

function Inventory() {
    const [selectedRows, setSelectedRows] = useState([]);

    const [inventory, setInventory] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {

        const loadInventory = async () => {

            try {

                const response = await api.get("/inventory");

                setInventory(
                    response.data.data.map((item) => ({
                        ...item,

                        id: item.inventory_id,

                        srNo: item.sr_no,

                        ledger: item.ledger_number,

                        asset: item.asset_name,

                        quantity: item.quantity_available,

                        condition:
                            item.asset_condition === 1
                                ? "Serviceable"
                                : "Unserviceable",

                        status:
                            item.status === 1
                                ? "Available"
                                : item.status === 2
                                ? "Assigned"
                                : "Under Maintenance",

                        location: item.location || "-",
                    }))
                );

            } catch (error) {

                console.error(error);

                toast.error("Failed to load inventory.");

            }

        };

        loadInventory();

    }, []);

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

                                const assets = inventory.filter(asset =>
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
                                        selectedAssets: inventory.filter(asset =>
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
                    data={inventory}
                    selectable
                    selectedRows={selectedRows}
                    onSelectionChange={setSelectedRows}
                />
            </div>

        </div>
    );
}

export default Inventory;