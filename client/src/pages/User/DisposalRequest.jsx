import { useState } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";

import PageHeader from "../../components/common/PageHeader";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Button from "../../components/common/Button";
import FormCard from "../../components/common/FormCard";
import Table from "../../components/common/Table";
import Textarea from "../../components/common/Textarea";

import { disposalRequestsData } from "../../data/mockData";

function DisposalRequest() {
    const [showForm, setShowForm] = useState(false);

    const assetOptions = [
        { value: "", label: "Select Asset" },
        { value: "laptop", label: "Dell Latitude 5420" },
        { value: "printer", label: "HP LaserJet Pro" },
        { value: "monitor", label: "Dell Monitor" },
    ];

    const reasonOptions = [
        { value: "", label: "Select Reason" },
        { value: "damaged", label: "Damaged" },
        { value: "obsolete", label: "Obsolete" },
        { value: "hardware_failure", label: "Hardware Failure" },
        { value: "other", label: "Other" },
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
                title="Disposal Request"
                subtitle="Manage your asset disposal requests."
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
                <FormCard title="New Disposal Request">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 space-y-4">

                        <Select
                            label="Asset"
                            options={assetOptions}
                        />

                        <Select
                            label="Reason"
                            options={reasonOptions}
                        />

                    </div>

                    <Textarea
                        label="Additional Remarks"
                        placeholder="Enter any additional information..."
                        className="mt-4"
                    />

                    <div className="flex justify-end gap-3 mt-6">

                        <Button
                            variant="secondary"
                            onClick={() => setShowForm(false)}
                        >
                            Cancel
                        </Button>

                        <Button>
                            Request Disposal
                        </Button>

                    </div>

                </FormCard>
            )}
            <div className="overflow-x-auto">

                <Table
                    columns={columns}
                    data={disposalRequestsData}
                />

            </div>
        </div>
    );
}

export default DisposalRequest;