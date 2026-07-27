import { useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import Input from "../../components/common/Input";
import Table from "../../components/common/Table";
import { groupDisposalsData } from "../../data/mockData";

const GroupDisposals = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredData = groupDisposalsData.filter((item) =>
        Object.values(item)
            .join(" ")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    const columns = [
        {
            header: "Ledger No",
            accessor: "ledger",
        },
        {
            header: "User",
            accessor: "user",
        },
        {
            header: "Asset",
            accessor: "asset",
        },
        {
            header: "Qty",
            accessor: "quantity",
        },
        {
            header: "Reason",
            accessor: "reason",
        },
        {
            header: "Disposed Date",
            accessor: "disposedDate",
        },
        {
            header: "Remarks",
            accessor: "remarks",
        },
    ];

    return (
        <div className="space-y-6">
            <PageHeader
                title="Group Disposals"
                subtitle="Review disposals submitted by users in your group."
            />

            <Input
                placeholder="Search by User, Asset or Ledger Number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <Table
                columns={columns}
                data={filteredData}
            />
        </div>
    );
};

export default GroupDisposals;