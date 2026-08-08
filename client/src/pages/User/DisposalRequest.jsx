import { useState, useEffect } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";

import { FaSearch } from "react-icons/fa";

import PageHeader from "../../components/common/PageHeader";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Button from "../../components/common/Button";
import FormCard from "../../components/common/FormCard";
import Table from "../../components/common/Table";

import { useNavigate } from "react-router-dom";

function DisposalRequest() {
    const location = useLocation();

    const navigate = useNavigate();

    const selectedAssets = location.state?.selectedAssets || [];

    const [disposalQuantities, setDisposalQuantities] = useState({});
    const [disposalReason, setDisposalReason] = useState("");
    const [remarks, setRemarks] = useState("");

    const [loading, setLoading] = useState(false);

    const [history, setHistory] = useState([]);

    

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
            header: "Quantity",
            accessor: "quantity",
        },
        {
            header: "Reason",
            accessor: "reason",
        },
        {
            header: "Disposed On",
            accessor: "disposedOn",
        },
    ];

    const handleDisposalSubmit = async () => {

        if (!disposalReason) {

            toast.error("Please select a disposal reason.");

            return;

        }

        try {

            setLoading(true);

            for (const asset of selectedAssets) {

                const quantity = disposalQuantities[asset.id];

                if (!quantity) {

                    toast.error(`Enter quantity for ${asset.name}`);

                    return;

                }

                await api.post("/disposals", {

                    assignment_id: asset.id,

                    quantity,

                    reason: disposalReason,

                    remarks,

                });

            }

            toast.success("Assets disposed successfully.");

            navigate("/user/assets");

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

    useEffect(() => {

        const loadHistory = async () => {

            try {

                const response = await api.get("/disposals");

                setHistory(response.data.disposals.map((item, index) => ({
                    srNo: index + 1,

                    ledger: item.ledger_number,

                    asset: item.asset_name,

                    quantity: item.quantity,

                    reason: item.reason,

                    disposedOn: new Date(item.disposed_at).toLocaleDateString(),
                }))
            );

            } catch (error) {

                console.error(error);

            }

        };

        loadHistory();

    }, []);

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
                            disabled={loading}
                            onClick={handleDisposalSubmit}
                        >
                            {loading ? "Submitting..." : "Submit Disposal"}
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
                    data={history}
                />

            </div>
        </div>
    );
}

export default DisposalRequest;