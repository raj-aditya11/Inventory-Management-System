import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";

import { FaSearch } from "react-icons/fa";

import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Table from "../../components/common/Table";


function MyAssetsInv() {

    const [selectedRows, setSelectedRows] = useState([]);
    const navigate = useNavigate();

    const [assets, setAssets] = useState([]);

    const [search, setSearch] = useState("");
    
    useEffect(() => {

        const loadAssets = async () => {

            try {

                const response = await api.get("/assignments/my-assets");

                setAssets(
                    response.data.data.map(item => ({
                        id: item.assignment_id,
                        srNo: item.sr_no,
                        ledger: item.ledger_number,
                        name: item.asset_name,
                        quantity: item.quantity,
                        assignment_id: item.assignment_id,
                        inventory_id: item.inventory_id,
                        status:
                            item.status === 1
                                ? "Assigned"
                                : "Inactive",
                    }))
                );

            } catch (error) {

                console.error(error);

                toast.error("Failed to load assets.");

            }

        };

        loadAssets();

    }, []);

    const filteredAssets = assets.filter((asset) => {

        const searchTerm = search.toLowerCase().trim();

        if (!searchTerm) {
            return true;
        }

        return (
            String(asset.srNo)
                .toLowerCase()
                .includes(searchTerm) ||

            String(asset.ledger)
                .toLowerCase()
                .includes(searchTerm) ||

            asset.name
                ?.toLowerCase()
                .includes(searchTerm) ||

            String(asset.quantity)
                .toLowerCase()
                .includes(searchTerm) ||

            asset.status
                ?.toLowerCase()
                .includes(searchTerm)
        );

    });

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
            accessor: "name",
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
                Assigned: "bg-green-100 text-green-700",
                Maintenance: "bg-yellow-100 text-yellow-700",
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
            title="My Assets"
            subtitle="View all assets assigned to you."
            />

            {selectedRows.length > 0 && (
                <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">

                    <p className="font-medium text-blue-700">
                        ✓ {selectedRows.length} Asset{selectedRows.length > 1 ? "s" : ""} Selected
                    </p>

                    <div className="flex gap-3">
                        <Button
                            onClick={() => {
                                console.log("selectedRows:", selectedRows);

                                const selectedAssets = assets.filter(asset =>
                                    selectedRows.includes(asset.id)
                                );

                                navigate("/inventory/transfers", {
                                    state: {
                                        selectedAssets,
                                    },
                                });
                            }}
                        >
                            Transfer Selected
                        </Button>

                        <Button
                            variant="danger"
                            onClick={() =>{
                                const selectedAssets = assets.filter(asset =>
                                    selectedRows.includes(asset.id)
                                );

                                console.log("Selected Assets:", selectedAssets);

                                navigate("/inventory/disposals", {
                                    state: {
                                        selectedAssets: assets.filter(asset =>
                                            selectedRows.includes(asset.id)
                                        ),
                                    },
                                });
                            }}
                        >
                            Dispose Selected
                        </Button>
                    </div>

                </div>
            )}

            {/* Search + Button */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">

                <div className="w-full md:max-w-md">

                    <Input
                        placeholder="Search assets..."
                        icon={FaSearch}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                </div>


            </div>

            {/* Table */}
            <Table
                columns={columns}
                data={filteredAssets}
                selectable
                selectedRows={selectedRows}
                onSelectionChange={setSelectedRows}
            />

        </div>
    );
}

export default MyAssetsInv;