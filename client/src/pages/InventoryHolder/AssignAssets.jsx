import { useNavigate } from "react-router-dom";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import toast from "react-hot-toast";

import PageHeader from "../../components/common/PageHeader";
import FormCard from "../../components/common/FormCard";
import Input from "../../components/common/Input";
import Textarea from "../../components/common/Textarea";
import Select from "../../components/common/Select";
import Button from "../../components/common/Button";

function AssignAssets(){
    const navigate = useNavigate();

    const { user } = useAuth();

    const [inventory, setInventory] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        inventory_id: "",
        user_id: "",
        quantity: "",
        assigned_date: "",
        remarks: "",
        status: 1,
    });

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    };

    useEffect(() => {

        const loadData = async () => {

            try {

                const [inventoryResponse, usersResponse] = await Promise.all([
                    api.get("/inventory"),
                    api.get("/users"),
                ]);

                setInventory(
                    inventoryResponse.data.data.filter(
                        (item) => item.quantity_available > 0
                    )
                );

                setUsers(
                    usersResponse.data.data.filter(
                        (user) =>
                            (user.role === "USER" ||
                            user.role === "INVENTORY_HOLDER") &&
                            user.status === 1
                    )
                );

            } catch (error) {

                console.error(error);

                toast.error("Failed to load data.");

            }

        };

        loadData();

    }, []);

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);

        try {

            await api.post("/assignments", {
                inventory_id: Number(formData.inventory_id),
                user_id: Number(formData.user_id),
                quantity: Number(formData.quantity),
                assigned_by: user.id,
                assigned_date: formData.assigned_date,
                remarks: formData.remarks,
                status: 1,
            });

            toast.success("Asset assigned successfully.");
            
            setFormData({
                inventory_id: "",
                user_id: "",
                quantity: "",
                assigned_date: "",
                remarks: "",
                status: 1,
            });

            navigate("/inventory/assets");

        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Assignment failed."
            );

        } finally {

            setLoading(false);

        }

    };

    return(
        <div>
            <PageHeader
                title="Assign Assets"
                subtitle="Assign inventory items to users."
            />
            
            <FormCard title= "Assignment Details">
                <form className="space-y-6" onSubmit={handleSubmit}>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <Select
                            name="inventory_id"
                            label="Asset"
                            value={formData.inventory_id}
                            onChange={handleChange}
                            options={inventory.map(item => ({
                                value: item.inventory_id,
                                label: `${item.asset_name} (${item.ledger_number})`,
                            }))}
                        />

                        <Select
                            name="user_id"
                            label="Assigned To"
                            value={formData.user_id}
                            onChange={handleChange}
                            options={users.map(user => ({
                                value: user.id,
                                label: [
                                    user.first_name,
                                    user.middle_name,
                                    user.last_name,
                                ]
                                .filter(Boolean)
                                .join(" "),
                            }))}
                        />

                        <Input
                            name="quantity"
                            label="Quantity"
                            type="number"
                            value={formData.quantity}
                            onChange={handleChange}
                        />

                        <Input
                            name="assigned_date"
                            label="Assigned Date"
                            type="date"
                            value={formData.assigned_date}
                            onChange={handleChange}
                        />

                        <Input
                            label="Assigned By"
                            value={`${user?.firstName || ""} ${user?.lastName || ""}`}
                            disabled
                        />

                    </div>

                    <Textarea
                        name="remarks"
                        label="Remarks"
                        placeholder="Enter remarks (optional)"
                        value={formData.remarks}
                        onChange={handleChange}
                    />

                    <div className="flex justify-end gap-4">

                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => navigate("/inventory/assets")}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            variant="primary"
                            disabled={loading}
                        >
                            {loading ? "Assigning..." : "Assign Asset"}
                        </Button>

                    </div>

                </form>
            </FormCard>
        </div>
    )
}

export default AssignAssets;