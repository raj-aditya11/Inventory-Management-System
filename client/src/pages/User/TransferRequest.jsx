import { useState } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";

import PageHeader from "../../components/common/PageHeader";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Button from "../../components/common/Button";
import FormCard from "../../components/common/FormCard";
import Table from "../../components/common/Table";

import { transferRequestsData } from "../../data/mockData";

function TransferRequest() {
    const [showForm, setShowForm] = useState(false);

    const assetOptions = [
        { value: "", label: "Select Asset" },
        { value: "laptop", label: "Dell Latitude 5420" },
        { value: "printer", label: "HP LaserJet Pro" },
        { value: "monitor", label: "Dell Monitor" },
        ];

    const userOptions = [
        { value: "", label: "Select User" },
        { value: "rahul", label: "Rahul Sharma" },
        { value: "priya", label: "Priya Singh" },
        { value: "aman", label: "Aman Verma" },
    ];

   const columns = [
        {
            header: "Request ID",
            accessor: "requestId",
        },
        {
            header: "Asset",
            accessor: "asset",
        },
        {
            header: "Transfer To",
            accessor: "transferTo",
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
        {
            header: "Actions",
            accessor: "requestId",
            render: () => (
            <Button size="sm">
                Details
            </Button>
            ),
        },
    ];
    return(
        <div className="space-y-6">
            <PageHeader
                title="Transfer Request"
                subtitle="Manage your asset transfer requests."
            />

            <div className="flex flex-col md:flex-row justify-between items-center gap-4">

                <div className="w-full md:max-w-md">
                    <Input
                        placeholder="Search requests..."
                        icon={FaSearch}
                    />
                </div>

                <Button
                    icon={!showForm ? FaPlus : null}
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? "Close Form" : "New Request"}
                </Button>
            </div>

            {showForm && (
                <FormCard title="New Transfer Request">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 space-y-4">

                        <Select
                            label="Asset"
                            options={assetOptions}
                        />

                        <Select
                            label="Transfer To"
                            options={userOptions}
                        />

                    </div>

                    <Input
                        label="Reason"
                        placeholder="Reason for transfer"
                    />

                    <div className="flex justify-end gap-3 mt-6">

                        <Button
                            variant="secondary"
                            onClick={() => setShowForm(false)}
                        >
                            Cancel
                        </Button>

                        <Button>
                            Request Transfer
                        </Button>

                    </div>

                </FormCard>
            )}
            <div className="overflow-x-auto">

                <Table
                    columns={columns}
                    data={transferRequestsData}
                />

            </div>
        </div>
    );
}

export default TransferRequest;