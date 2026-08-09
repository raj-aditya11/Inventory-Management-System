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

import { useNavigate } from "react-router-dom";


function Disposal() {
    const location = useLocation();
    const navigate = useNavigate(); 

    const selectedAssets = location.state?.selectedAssets || [];
    console.log("Received selectedAssets:", selectedAssets);

    const [disposalQuantities, setDisposalQuantities] = useState({});
    const [disposalReason, setDisposalReason] = useState("");
    const [remarks, setRemarks] = useState("");
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);
    const [search, setSearch] = useState("");

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
            header: "Asset Name/ Nomenclature",
            accessor: "asset",
        },
        {
            header: "Quantity",
            accessor: "quantity",
        },
        {
            header: "Reason",
            accessor: "reason",
        },
        {
            header: "Disposed On",
            accessor: "disposedDate",
        },
        {
            header: "Remarks",
            accessor: "remarks",
        },
    ];

    useEffect(() => {

        const loadHistory = async () => {

            try {

                const response = await api.get("/disposals");

                setHistory(

                    response.data.disposals.map((item) => ({

                        srNo: item.sr_no,

                        ledger: item.ledger_number,

                        asset: item.asset_name,

                        quantity: item.quantity,

                        reason: item.reason,

                        disposedDate:
                            new Date(item.disposed_at)
                                .toLocaleDateString(),

                        remarks: item.remarks || "-",

                    }))

                );

            } catch (error) {

                console.error(error);

                toast.error("Failed to load disposal history.");

            }

        };

        loadHistory();

    }, []);

    const filteredHistory = history.filter((item) => {

        const searchTerm = search.toLowerCase().trim();

        if (!searchTerm) {
            return true;
        }

        return (
            String(item.srNo)
                .toLowerCase()
                .includes(searchTerm) ||

            String(item.ledger)
                .toLowerCase()
                .includes(searchTerm) ||

            item.asset
                ?.toLowerCase()
                .includes(searchTerm) ||

            String(item.quantity)
                .toLowerCase()
                .includes(searchTerm) ||

            item.reason
                ?.toLowerCase()
                .includes(searchTerm) ||

            item.disposedDate
                ?.toLowerCase()
                .includes(searchTerm) ||

            item.remarks
                ?.toLowerCase()
                .includes(searchTerm)
        );

    });

    const handleDisposalSubmit = async () => {

        if (!disposalReason) {
            toast.error("Please select a disposal reason.");
            return;
        }

        for (const asset of selectedAssets) {

            const quantity = disposalQuantities[asset.id];

            if (!quantity) {
                toast.error(`Please enter disposal quantity for ${asset.asset}.`);
                return;
            }

            if (quantity < 1) {
                toast.error(
                    `Disposal quantity for ${asset.asset} must be at least 1.`
                );
                return;
            }

            if (quantity > asset.quantity) {
                toast.error(
                    `Disposal quantity for ${asset.asset} cannot exceed available quantity.`
                );
                return;
            }
        }

        if (
            !window.confirm(
                "Are you sure you want to dispose the selected asset(s)?"
            )
        ) {
            return;
        }

        try {

            setLoading(true);
            

            for (const asset of selectedAssets) {
                
                await api.post("/disposals", {
                    assignment_id: asset.id,
                    quantity: disposalQuantities[asset.id],
                    reason: disposalReason,
                    remarks,
                });

            }

            toast.success("Asset(s) disposed successfully.");

            setDisposalQuantities({});
            setDisposalReason("");
            setRemarks("");

            navigate("/inventory/my-assets");

        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Failed to dispose asset."
            );

        } finally {

            setLoading(false);

        }

    };

    return (
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
                            disabled={loading}
                        >
                            {loading ? "Submitting..." : "Submit Disposal"}
                        </Button>

                    </div>

                </FormCard>

            )}

            <div className="w-full md:max-w-md">

                <Input
                    placeholder="Search disposal requests..."
                    icon={FaSearch}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

            </div>

            <div className="overflow-x-auto">

                <Table
                    columns={columns}
                    data={filteredHistory}
                />

            </div>

        </div>
    );
}

export default Disposal;