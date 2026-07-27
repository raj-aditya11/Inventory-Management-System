import { useState } from "react";
import { useLocation } from "react-router-dom";

import { FaSearch } from "react-icons/fa";

import Button from "../../components/common/Button"
import PageHeader from "../../components/common/PageHeader";
import Input from "../../components/common/Input";
import Table from "../../components/common/Table";
import FormCard from "../../components/common/FormCard";
import Select from "../../components/common/Select";

import { transferData } from "../../data/mockData";

function Transfers() {
    const location = useLocation();

    const selectedAssets = location.state?.selectedAssets || [];
    const [transferQuantities, setTransferQuantities] = useState({});
    const [transferTo, setTransferTo] = useState("");
    const [remarks, setRemarks] = useState("");

    const transferFormColumns = [
        {
            header: "Sr. No.",
            accessor: "srNo",
        },
        {
            header: "Ledger No.",
            accessor: "ledger",
        },
        {
            header: "Asset Name / Nomenclature",
            accessor: "asset",
        },
        {
            header: "Available Qty",
            accessor: "quantity",
        },
        {
            header: "Transfer Qty",
            accessor: "quantity",

            render: (value, row) => (
                <Input
                    type="number"
                    min="1"
                    max={value}
                    placeholder="Enter Qty"
                    value={transferQuantities[row.id] || ""}
                    onChange={(e) =>
                        setTransferQuantities({
                            ...transferQuantities,
                            [row.id]: Number(e.target.value),
                        })
                    }
                />
            ),
        },
    ];

    const userOptions = [
        {
            value: "Rahul Sharma",
            label: "Rahul Sharma",
        },
        {
            value: "Priya Singh",
            label: "Priya Singh",
        },
        {
            value: "Amit Kumar",
            label: "Amit Kumar",
        },
    ];

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
            header: "Asset",
            accessor: "asset",
        },
        {
            header: "From User",
            accessor: "from",
        },
        {
            header: "To User",
            accessor: "to",
        },
        {
            header: "Status",
            accessor: "status",

            render: (value) => {

                const colors = {
                    Pending: "bg-yellow-100 text-yellow-700",
                    Approved: "bg-green-100 text-green-700",
                    Rejected: "bg-red-100 text-red-700",
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
            header: "Requested Date",
            accessor: "requestedDate",
        },
    ];

    const handleTransferSubmit = () => {

        // User must be selected
        if (!transferTo) {
            alert("Please select a user.");
            return;
        }

        // Every asset should have a quantity
        for (const asset of selectedAssets) {

            const quantity = transferQuantities[asset.id];

            if (!quantity) {
                alert(`Please enter quantity for ${asset.asset}.`);
                return;
            }

            if (quantity < 1) {
                alert(`Quantity for ${asset.asset} must be at least 1.`);
                return;
            }

            if (quantity > asset.quantity) {
                alert(
                    `Transfer quantity for ${asset.asset} cannot exceed available quantity.`
                );
                return;
            }
        }

        console.log({
            selectedAssets,
            transferQuantities,
            transferTo,
            remarks,
        });

        alert("Transfer request submitted successfully.");
    };
    return (
        <div className="space-y-6">
            <PageHeader
                title="Transfers"
                subtitle="Review and manage asset transfer requests."
            />

            {selectedAssets.length > 0 && (

                <FormCard title="Transfer Selected Assets">

                    <Table
                        columns={transferFormColumns}
                        data={selectedAssets}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

                        <Select
                            label="Transfer To *"
                            placeholder="Select User"
                            options={userOptions}
                            value={transferTo}
                            onChange={(e) => setTransferTo(e.target.value)}
                        />

                        <Input
                            label="Remarks"
                            placeholder="Enter remarks"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                        />

                    </div>

                    <div className="flex justify-end mt-6">

                        <Button
                            variant="success"
                            onClick={handleTransferSubmit}
                        >
                            Submit Transfer
                        </Button>

                    </div>

                </FormCard>

            )}

            <div className="w-full md:max-w-md">

                <Input
                    placeholder="Search transfer requests..."
                    icon={FaSearch}
                />

            </div>

            <div className="overflow-x-auto">

                <Table
                    columns={columns}
                    data={transferData}
                />

            </div>


        </div>
    );
}

export default Transfers;