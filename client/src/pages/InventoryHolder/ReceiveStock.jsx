import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import toast from "react-hot-toast";

import PageHeader from "../../components/common/PageHeader";
import FormCard from "../../components/common/FormCard";
import Input from "../../components/common/Input";
import Textarea from "../../components/common/Textarea";
import Button from "../../components/common/Button";
import Select from "../../components/common/Select";

function ReceiveStock() {
    const navigate = useNavigate();

    const { user } = useAuth();

    const [assets, setAssets] = useState([]);

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        asset_id: "",
        sr_no: "",
        ledger_number: "",
        quantity_received: "",
        purchase_cost: "",
        purchase_date: "",
        remarks: "",
        status: 1,
    });


    useEffect(() => {

        const loadAssets = async () => {

            try {

                const response = await api.get("/assets");

                setAssets(response.data.data);

            } catch (error) {

                console.error(error);

                toast.error("Failed to load assets.");

            }

        };

        loadAssets();

    }, []);

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);

        try {

            await api.post("/inventory", {
                ...formData,
                received_by: user.id,
            });

            toast.success("Stock received successfully.");

            setFormData({
                asset_id: "",
                sr_no: "",
                ledger_number: "",
                quantity_received: "",
                purchase_cost: "",
                purchase_date: "",
                remarks: "",
                status: 1,
            });

            navigate("/inventory/assets");

        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Failed to receive stock."
            );

        } finally{
            setLoading(false);
        }

    };

  return (
    <div className="space-y-6">

      <PageHeader
        title="Receive Stock"
        subtitle="Add newly received inventory items."
      />

      <FormCard title="Stock Information">
        <form className="space-y-6" onSubmit={handleSubmit}>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <Input
                    label="Sr. No."
                    placeholder="Enter serial number"
                    value={formData.sr_no}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            sr_no: e.target.value,
                        })
                    }
                />

                <Input
                    label="Ledger Number"
                    placeholder="Enter ledger number"
                    value={formData.ledger_number}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            ledger_number: e.target.value,
                        })
                    }
                />

                <Select
                    label="Asset"
                    placeholder="Select Asset"
                    value={formData.asset_id}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            asset_id: e.target.value,
                        })
                    }
                    options={assets.map(asset => ({
                        value: asset.asset_id,
                        label: asset.asset_name,
                    }))}
                />

                
                

                <Input
                    label="Quantity"
                    type="number"
                    placeholder="Enter quantity"
                    value={formData.quantity_received}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            quantity_received: e.target.value,
                        })
                    }
                />

                <Input
                    label="Purchase Cost"
                    type="number"
                    placeholder="₹ Enter purchase cost"
                    value={formData.purchase_cost}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            purchase_cost: e.target.value,
                        })
                    }
                />

                <Input
                    label="Purchase Date"
                    type="date"
                    value={formData.purchase_date}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            purchase_date: e.target.value,
                        })
                    }
                />

                <Input
                    label="Received By"
                    value={`${user?.firstName || ""} ${user?.lastName || ""}`}
                    disabled
                />

            </div>

            <Textarea
                label="Remarks"
                placeholder="Enter remarks (optional)"
                rows={4}
                value={formData.remarks}
                onChange={(e) =>
                    setFormData({
                        ...formData,
                        remarks: e.target.value,
                    })
                }
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
                    variant="success"
                    disabled={loading}
                >
                    {loading ? "Receiving..." : "Receive Stock"}
                </Button>

            </div>

        </form>
      </FormCard>

    </div>
  );
}

export default ReceiveStock;