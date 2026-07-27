import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { FaSearch } from "react-icons/fa";

import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Table from "../../components/common/Table";

import { myAssetsData } from "../../data/mockData";

function MyAssets() {

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
            accessor: "name",
        },
        {
            header: "Quantity/Unit",
            accessor: "quantity",
        },
        {
            header: "Condition",
            accessor: "condition",
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

                    <Button
                        variant="danger"
                        onClick={() =>
                            navigate("/user/disposals", {
                                state: {
                                    selectedAssets: myAssetsData.filter(asset =>
                                        selectedRows.includes(asset.id)
                                    ),
                                },
                            })
                        }
                    >
                        Dispose Selected
                    </Button>

                </div>
            )}

            {/* Search + Button */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">

                <div className="w-full md:max-w-md">

                    <Input
                    placeholder="Search assets..."
                    icon={FaSearch}
                    />

                </div>


            </div>

            {/* Table */}
            <Table
                columns={columns}
                data={myAssetsData}
                selectable
                selectedRows={selectedRows}
                onSelectionChange={setSelectedRows}
            />

        </div>
    );
}

export default MyAssets;