import { useState, useEffect } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";

import { FaSearch } from "react-icons/fa";

import Button from "../../components/common/Button"
import PageHeader from "../../components/common/PageHeader";
import Input from "../../components/common/Input";
import Table from "../../components/common/Table";
import FormCard from "../../components/common/FormCard";
import Select from "../../components/common/Select";


function Transfers() {
    const location = useLocation();

    const selectedAssets = location.state?.selectedAssets || [];
    const [transferQuantities, setTransferQuantities] = useState({});
    const [transferTo, setTransferTo] = useState("");
    const [remarks, setRemarks] = useState("");
    const [users, setUsers] = useState([]);
    const [transfers, setTransfers] = useState([]);
    const [loading, setLoading] = useState(false);

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

    const userOptions = users.map(user => ({
        value: user.id,
        label: `${user.first_name} ${user.last_name}`,
    }));

    useEffect(() => {

        const loadData = async () => {

            try {

                const [usersResponse, transfersResponse] = await Promise.all([
                    api.get("/users"),
                    api.get("/transfers/pending"),
                ]);

                setUsers(
                    usersResponse.data.data.filter(
                        user => user.role === "USER"
                    )
                );

                setTransfers(
                    transfersResponse.data.data.map((transfer, index) => ({
                        id: transfer.transfer_request_id,
                        srNo: index + 1,
                        ledger: transfer.ledger_number,
                        asset: transfer.asset_name,
                        from: transfer.requested_by,
                        to: transfer.to_user,

                        sameGroup: transfer.same_group_transfer,
                        sourceStatus: transfer.source_holder_status,
                        destinationStatus: transfer.destination_holder_status,

                        status:
                            transfer.status === 1
                                ? "Pending"
                                : transfer.status === 2
                                ? "Approved"
                                : "Rejected",

                        requestedDate: new Date(
                            transfer.requested_at
                        ).toLocaleDateString(),
                    }))
                );

            } catch (error) {

                console.error(error);

                toast.error("Failed to load transfer data.");

            }

        };

        loadData();

    }, []);

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
            header: "Actions",

            render: (_, row) => {

                if (row.status !== "Pending") {
                    return "-";
                }

                return (
                    <div className="flex gap-2">

                        <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleApprove(row)}
                        >
                            Approve
                        </Button>

                        <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleReject(row.id)}
                        >
                            Reject
                        </Button>

                    </div>
                );
            },
        },
        {
            header: "Requested Date",
            accessor: "requestedDate",
        },
    ];

    const handleApprove = async (row) => {

        try {

            setLoading(true);

            if (
                row.sameGroup === "yes" ||
                row.sourceStatus === 0
            ) {

                await api.put(`/transfers/source/${row.id}`);

            } else {

                await api.put(`/transfers/complete/${row.id}`);

            }

            toast.success("Transfer approved.");
            window.location.reload();

        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Approval failed."
            );

        } finally {

            setLoading(false);

        }

    };

    const handleReject = async (id) => {

        try {

            setLoading(true);

            await api.put(`/transfers/reject/${id}`);

            toast.success("Transfer rejected.");

            window.location.reload();

        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Rejection failed."
            );

        } finally {

            setLoading(false);

        }

    };

    const handleTransferSubmit = async () => {

        if (!transferTo) {

            toast.error("Please select a user.");

            return;

        }

        try {

            setLoading(true);

            for (const asset of selectedAssets) {

                const quantity = transferQuantities[asset.id];

                if (!quantity || quantity < 1) {

                    toast.error(`Enter valid quantity for ${asset.name}.`);

                    return;

                }

                await api.post("/transfers", {

                    assignment_id: asset.assignment_id,

                    to_user: Number(transferTo),

                    quantity,

                    reason: remarks,

                });

            }

            toast.success("Transfer request submitted.");

            window.location.reload();

        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Transfer request failed."
            );

        } finally {

            setLoading(false);

        }

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
                            disabled={loading}
                        >
                            {loading ? "Submitting..." : "Submit Transfer"}
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
                    data={transfers}
                />

            </div>


        </div>
    );
}

export default Transfers;