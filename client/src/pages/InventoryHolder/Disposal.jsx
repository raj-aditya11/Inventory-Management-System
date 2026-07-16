import { FaSearch } from "react-icons/fa";

import Button from "../../components/common/Button"
import PageHeader from "../../components/common/PageHeader";
import Input from "../../components/common/Input";
import Table from "../../components/common/Table";

import { disposalData } from "../../data/mockData";

function Disposal() {
    const columns = [
        {
            header: "Request ID",
            accessor: "id",
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
                title="Disposals"
                subtitle="Review and manage disposal requests."
            />

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