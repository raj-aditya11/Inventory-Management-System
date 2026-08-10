import { useState, useEffect } from "react";

import { FaSearch, FaFileExcel } from "react-icons/fa";

import api from "../../services/api";
import toast from "react-hot-toast";
import PageHeader from "../../components/common/PageHeader";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Table from "../../components/common/Table";

const GroupDisposals = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const [disposals, setDisposals] = useState([]);

    useEffect(() => {

        const loadDisposals = async () => {

            try {

                const response = await api.get("/disposals/group");

                setDisposals(
                    response.data.disposals.map((item) => ({
                        srNo: item.sr_no,

                        ledger: item.ledger_number,

                        user: item.disposed_by_name,

                        asset: item.asset_name,

                        quantity: `${item.quantity} ${item.unit || ""}`.trim(),

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
            header: "Asset Name/ Nomenclature",
            accessor: "asset",
        },
        {
            header: "Quantity/Unit",
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

    const handleExportExcel = async () => {

        try {

            const response = await api.get(
                "/disposals/export",
                {
                    responseType: "blob",
                }
            );

            const url = window.URL.createObjectURL(
                new Blob([response.data])
            );

            const link = document.createElement("a");

            link.href = url;

            link.setAttribute(
                "download",
                "List_of_Items_for_Disposal.xlsx"
            );

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

        } catch (error) {

            console.error(error);

            toast.error(
                "Failed to generate disposal list."
            );

        }

    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Group Disposals"
                subtitle="View all asset disposals made by members of your group."
            />

            <div className="flex flex-col md:flex-row justify-between items-center gap-4">

                <div className="w-full md:max-w-md">

                    <Input
                        placeholder="Search by User, Asset or Ledger Number..."
                        icon={FaSearch}
                        value={searchTerm}
                        onChange={(e) =>
                            setSearchTerm(e.target.value)
                        }
                    />

                </div>

                <Button
                    icon={FaFileExcel}
                    variant="success"
                    onClick={handleExportExcel}
                >
                    Export Excel
                </Button>

            </div>

            <Table
                columns={columns}
                data={filteredData}
            />
        </div>
    );
};

export default GroupDisposals;