import { useState } from "react";
import { useLocation } from "react-router-dom";

import { FaSearch } from "react-icons/fa";

import PageHeader from "../../components/common/PageHeader";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Button from "../../components/common/Button";
import FormCard from "../../components/common/FormCard";
import Table from "../../components/common/Table";

import { disposalRequestsData } from "../../data/mockData";

function DisposalRequest() {
    const location = useLocation();

    const selectedAssets = location.state?.selectedAssets || [];

    const [disposalQuantities, setDisposalQuantities] = useState({});
    const [disposalReason, setDisposalReason] = useState("");
    const [remarks, setRemarks] = useState("");

    

    const reasonOptions = [
        { value: "", label: "Select Reason" },
        { value: "Damaged", label: "Damaged" },
        { value: "Obsolete", label: "Obsolete" },
        { value: "Beyond Repair", label: "Beyond Repair" },
        { value: "Lost", label: "Lost" },
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
            header: "Asset Name/Nomenclature",
            accessor: "name",
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
                    value={disposalQuantities[row.id] || ""}
                    placeholder="Qty"
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

   const historyColumns = [
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
            header: "Reason",
            accessor: "reason"
        },
        {
            header: "Requested Date",
            accessor: "requestedDate",
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
    ];

    const handleDisposalSubmit = () => {

        if (!disposalReason) {
            alert("Please select a disposal reason.");
            return;
        }

        for (const asset of selectedAssets) {

            const quantity = disposalQuantities[asset.id];

            if (!quantity) {
                alert(`Please enter disposal quantity for ${asset.name}.`);
                return;
            }

            if (quantity < 1) {
                alert(`Disposal quantity for ${asset.name} must be at least 1.`);
                return;
            }

            if (quantity > asset.quantity) {
                alert(
                    `Disposal quantity for ${asset.name} cannot exceed available quantity.`
                );
                return;
            }
        }

        console.log({
            selectedAssets,
            disposalQuantities,
            disposalReason,
            remarks,
        });

        alert("Disposal submitted successfully.");
    };

    return(
        <div className="space-y-6">
            <PageHeader
                title="Disposals"
                subtitle="Dispose your assigned assets."
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
                            options={reasonOptions}
                            value={disposalReason}
                            onChange={(e) => setDisposalReason(e.target.value)}
                        />

                        <Input
                            label="Remarks"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                        />

                    </div>

                    <div className="flex justify-end mt-6">

                        <Button 
                            variant="danger"
                            onClick={handleDisposalSubmit}
                        >
                            Submit Disposal
                        </Button>

                    </div>

                </FormCard>
            )}

            <div className="flex flex-col md:flex-row justify-between items-center gap-4">

                <div className="w-full md:max-w-md">
                    <Input
                        placeholder="Search disposal history..."
                        icon={FaSearch}
                    />
                </div>

                
            </div>

            
            <div className="overflow-x-auto">

                <Table
                    columns={historyColumns}
                    data={disposalRequestsData}
                />

            </div>
        </div>
    );
}

export default DisposalRequest;