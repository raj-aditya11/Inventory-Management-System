import { FaSearch } from "react-icons/fa";

import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Table from "../../components/common/Table";

import { myAssetsData } from "../../data/mockData";

function MyAssets() {

    const columns = [
        {
            header: "Asset ID",
            accessor: "assetId",
            },
            {
                header: "Asset",
                accessor: "asset",
            },
            {
                header: "Category",
                accessor: "category",
            },
            {
                header: "Assigned Date",
                accessor: "assignedDate",
            },
            {
                header: "Condition",
                accessor: "condition",
            },
            {
                header: "Status",
                accessor: "status",

                render: (value) => {

                const colors = {
                    Assigned: "bg-green-100 text-green-700",
                    Maintenance: "bg-yellow-100 text-yellow-700",
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
                accessor: "assetId",

                render: () => (
                <Button size="sm">
                    Details
                </Button>
                ),
            },
    ];
    return (
        <div className="space-y-6">

            <PageHeader
            title="My Assets"
            subtitle="View all assets assigned to you."
            />

            {/* Search + Button */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">

                <div className="w-full md:max-w-md">

                    <Input
                    placeholder="Search assets..."
                    icon={FaSearch}
                    />

                </div>


            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <Table
                    columns={columns}
                    data={myAssetsData}
                />
            </div>

        </div>
    );
}

export default MyAssets;