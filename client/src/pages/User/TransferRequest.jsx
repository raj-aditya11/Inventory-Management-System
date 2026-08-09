import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import api from "../../services/api";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

import { FaPlus, FaSearch } from "react-icons/fa";

import PageHeader from "../../components/common/PageHeader";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Button from "../../components/common/Button";
import FormCard from "../../components/common/FormCard";
import Table from "../../components/common/Table";
import Textarea from "../../components/common/Textarea";

function TransferRequest() {

    const location = useLocation();

    const [showForm, setShowForm] = useState(
        Boolean(
            location.state?.selectedAssets?.length
        )
    );

    const { user } = useAuth();

    const [loading, setLoading] = useState(false);

    const [myAssets, setMyAssets] = useState([]);
    const [users, setUsers] = useState([]);
    const [requests, setRequests] = useState([]);

    const [search, setSearch] = useState("")

    const [formData, setFormData] = useState({
        assignment_id: "",
        to_user: "",
        quantity: "",
        reason: "",
    });


    // -----------------------------------------
    // Load data
    // -----------------------------------------

    useEffect(() => {

        const loadData = async () => {

            try {

                const [
                    assetsResponse,
                    usersResponse,
                    transfersResponse,
                ] = await Promise.all([

                    api.get(
                        "/assignments/my-assets"
                    ),

                    api.get("/users"),

                    api.get("/transfers/my"),

                ]);

                setMyAssets(
                    assetsResponse.data.data
                );

                setUsers(
                    usersResponse.data.data.filter(
                        u =>
                            u.role === "USER" &&
                            u.id !== user.id
                    )
                );

                setRequests(
                    transfersResponse.data.data.map(
                        request => ({

                            srNo:
                                request.sr_no,

                            ledger:
                                request.ledger_number,

                            asset:
                                request.asset_name,

                            transferTo:
                                request.transfer_to_name,

                            requestedDate:
                                new Date(
                                    request.requested_at
                                ).toLocaleDateString(),

                            status:
                                request.status === 1
                                    ? "Pending"
                                    : request.status === 2
                                    ? "Approved"
                                    : "Rejected",

                        })
                    )
                );

            } catch (error) {

                console.error(error);

                toast.error(
                    "Failed to load transfer data."
                );

            }

        };

        loadData();

    }, [user.id]);


    // -----------------------------------------
    // Handle selected asset from My Assets
    // -----------------------------------------

    useEffect(() => {

        const selectedAssets =
            location.state?.selectedAssets;

        if (
            selectedAssets &&
            selectedAssets.length === 1
        ) {

            const asset = selectedAssets[0];

            setFormData(prev => ({
                ...prev,

                assignment_id: asset.id,

                quantity: asset.quantity,

            }));

            setShowForm(true);

        }

    }, [location.state]);

    const filteredRequests = requests.filter((request) => {

        const searchTerm = search.toLowerCase().trim();

        if (!searchTerm) {
            return true;
        }

        return (
            String(request.srNo)
                .toLowerCase()
                .includes(searchTerm) ||

            String(request.ledger)
                .toLowerCase()
                .includes(searchTerm) ||

            request.asset
                ?.toLowerCase()
                .includes(searchTerm) ||

            request.transferTo
                ?.toLowerCase()
                .includes(searchTerm) ||

            request.requestedDate
                ?.toLowerCase()
                .includes(searchTerm) ||

            request.status
                ?.toLowerCase()
                .includes(searchTerm)
        );

    });


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

                    Pending:
                        "bg-yellow-100 text-yellow-700",

                    Approved:
                        "bg-green-100 text-green-700",

                    Rejected:
                        "bg-red-100 text-red-700",

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

    ];


    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value,

        });

    };


    // -----------------------------------------
    // Submit transfer request
    // -----------------------------------------

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);

        try {

            await api.post(
                "/transfers",
                {
                    assignment_id:
                        Number(
                            formData.assignment_id
                        ),

                    to_user:
                        Number(
                            formData.to_user
                        ),

                    quantity:
                        Number(
                            formData.quantity
                        ),

                    reason:
                        formData.reason,
                }
            );

            toast.success(
                "Transfer request submitted."
            );

            setShowForm(false);

            setFormData({
                assignment_id: "",
                to_user: "",
                quantity: "",
                reason: "",
            });

            // Remove navigation state so
            // refreshing the page doesn't
            // reopen the selected asset.
            window.history.replaceState(
                {},
                document.title
            );

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


    const selectedAssetWasPassed =
        Boolean(
            location.state?.selectedAssets?.length
        );


    return (

        <div className="space-y-6">

            <PageHeader
                title="Transfer Request"
                subtitle="Manage your asset transfer requests."
            />


            {/* Search + New Request */}

            <div className="flex flex-col md:flex-row justify-between items-center gap-4">

                <div className="w-full md:max-w-md">

                    <Input
                        placeholder="Search requests..."
                        icon={FaSearch}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                </div>

                <Button
                    icon={
                        !showForm
                            ? FaPlus
                            : null
                    }
                    onClick={() =>
                        setShowForm(!showForm)
                    }
                >
                    {showForm
                        ? "Close Form"
                        : "New Request"}
                </Button>

            </div>


            {/* Form */}

            {showForm && (

                <FormCard title="New Transfer Request">

                    <form
                        className="space-y-6"
                        onSubmit={handleSubmit}
                    >

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 space-y-4">


                            {/* Asset */}

                            <Select
                                name="assignment_id"
                                label="Asset"
                                value={
                                    formData.assignment_id
                                }
                                onChange={
                                    handleChange
                                }
                                disabled={
                                    selectedAssetWasPassed
                                }
                                options={
                                    myAssets.map(
                                        asset => ({

                                            value:
                                                asset.assignment_id,

                                            label:
                                                `${asset.asset_name} (${asset.ledger_number})`,

                                        })
                                    )
                                }
                            />


                            {/* Destination */}

                            <Select
                                name="to_user"
                                label="Transfer To"
                                value={
                                    formData.to_user
                                }
                                onChange={
                                    handleChange
                                }
                                options={
                                    users.map(
                                        user => ({

                                            value:
                                                user.id,

                                            label: [
                                                user.first_name,
                                                user.middle_name,
                                                user.last_name,
                                            ]
                                                .filter(Boolean)
                                                .join(" "),

                                        })
                                    )
                                }
                            />


                            {/* Quantity */}

                            <Input
                                name="quantity"
                                label="Quantity"
                                type="number"
                                min="1"
                                value={
                                    formData.quantity
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </div>


                        {/* Reason */}

                        <Textarea
                            name="reason"
                            label="Reason"
                            value={
                                formData.reason
                            }
                            onChange={
                                handleChange
                            }
                        />


                        {/* Buttons */}

                        <div className="flex justify-end gap-3 mt-6">

                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => {

                                    setShowForm(false);

                                    setFormData({
                                        assignment_id: "",
                                        to_user: "",
                                        quantity: "",
                                        reason: "",
                                    });

                                }}
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                disabled={loading}
                            >
                                {loading
                                    ? "Submitting..."
                                    : "Request Transfer"}
                            </Button>

                        </div>

                    </form>

                </FormCard>

            )}


            {/* Requests Table */}

            <div className="overflow-x-auto">

                <Table
                    columns={columns}
                    data={filteredRequests}
                />

            </div>

        </div>

    );

}

export default TransferRequest;