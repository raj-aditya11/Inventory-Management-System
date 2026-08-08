import { useState, useEffect } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import PageHeader from "../../components/common/PageHeader";
import Input from "../../components/common/Input";
import Table from "../../components/common/Table";

const GroupDisposals = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const [disposals, setDisposals] = useState([]);

    useEffect(() => {

        const loadDisposals = async () => {

            try {

                const response = await api.get("/disposals/group");

                setDisposals(
                    response.data.disposals.map((item, index) => ({
                        srNo: index + 1,

                        ledger: item.ledger_number,

                        user: item.disposed_by_name,

                        asset: item.asset_name,

                        quantity: item.quantity,

                        reason: item.reason,

                        disposedDate: new Date(
                            item.disposed_at
                        ).toLocaleDateString(),

                        remarks: item.remarks || "-",
                    }))
                );

            } catch (error) {

                console.error(error);

                toast.error("Failed to load group disposals.");

            }

        };

        loadDisposals();

    }, []);

    const filteredData = disposals.filter((item) =>
        Object.values(item)
            .join(" ")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    const columns = [
        {
            header: "Sr. No.",
            accessor: "srNo",
        },
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
                subtitle="View all asset disposals made by members of your group."
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