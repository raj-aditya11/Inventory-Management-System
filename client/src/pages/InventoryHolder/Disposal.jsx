import { useState } from "react";
import { useLocation } from "react-router-dom";

import { FaSearch } from "react-icons/fa";

import Button from "../../components/common/Button"
import PageHeader from "../../components/common/PageHeader";
import Input from "../../components/common/Input";
import Table from "../../components/common/Table";
import FormCard from "../../components/common/FormCard";
import Select from "../../components/common/Select";

import { disposalData } from "../../data/mockData";

function Disposal() {
    const location = useLocation();

    const selectedAssets = location.state?.selectedAssets || [];

    const [disposalQuantities, setDisposalQuantities] = useState({});
    const [disposalReason, setDisposalReason] = useState("");
    const [remarks, setRemarks] = useState("");

    const reasonOptions = [
        {
            value: "Damaged",
            label: "Damaged",
        },
        {
            value: "Obsolete",
            label: "Obsolete",
        },
        {
            value: "Beyond Repair",
            label: "Beyond Repair",
        },
        {
            value: "Lost",
            label: "Lost",
        },
    ];

    const disposalFormColumns = [
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
            header: "Disposal Qty",
            accessor: "quantity",

            render: (value, row) => (
                <Input
                    type="number"
                    min="1"
                    max={value}
                    placeholder="Enter Qty"
                    value={disposalQuantities[row.id] || ""}
                    onChange={(e) =>
                        setDisposalQuantities({
                            ...disposalQuantities,
                            [row.id]: Number(e.target.value),
                        })
                    }
                />
            ),
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
            header: "Requested By",
            accessor: "requestedBy",
        },
        {
            header: "Reason",
            accessor: "reason",
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

    const handleDisposalSubmit = () => {

        // Disposal reason must be selected
        if (!disposalReason) {
            alert("Please select a disposal reason.");
            return;
        }

        // Validate quantities
        for (const asset of selectedAssets) {

            const quantity = disposalQuantities[asset.id];

            if (!quantity) {
                alert(`Please enter disposal quantity for ${asset.asset}.`);
                return;
            }

            if (quantity < 1) {
                alert(`Disposal quantity for ${asset.asset} must be at least 1.`);
                return;
            }

            if (quantity > asset.quantity) {
                alert(
                    `Disposal quantity for ${asset.asset} cannot exceed available quantity.`
                );
                return;
            }
        }

        if (
            !window.confirm(
                "Are you sure you want to submit this disposal request?"
            )
        ) {
            return;
        }

        console.log({
            selectedAssets,
            disposalQuantities,
            disposalReason,
            remarks,
        });

        alert("Disposal request submitted successfully.");
    };
    return (
        <div className="space-y-6">
            <PageHeader
                title="Disposals"
                subtitle="Review and manage disposal requests."
            />

            {selectedAssets.length > 0 && (

                <FormCard title="Dispose Selected Assets">

                    <Table
                        columns={disposalFormColumns}
                        data={selectedAssets}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

                        <Select
                            label="Disposal Reason *"
                            placeholder="Select Reason"
                            options={reasonOptions}
                            value={disposalReason}
                            onChange={(e) => setDisposalReason(e.target.value)}
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
                            variant="danger"
                            onClick={handleDisposalSubmit}
                        >
                            Submit Disposal Request
                        </Button>

                    </div>

                </FormCard>

            )}

            <div className="w-full md:max-w-md">

                <Input
                    placeholder="Search disposal requests..."
                    icon={FaSearch}
                />

            </div>

            <div className="overflow-x-auto">

                <Table
                    columns={columns}
                    data={disposalData}
                />

            </div>

        </div>
    );
}

export default Disposal;