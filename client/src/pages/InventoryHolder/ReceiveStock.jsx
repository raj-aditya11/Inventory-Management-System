import { useNavigate } from "react-router-dom";

import PageHeader from "../../components/common/PageHeader";
import FormCard from "../../components/common/FormCard";
import Input from "../../components/common/Input";
import Textarea from "../../components/common/Textarea";
import Select from "../../components/common/Select";
import Button from "../../components/common/Button";

function ReceiveStock() {
    const navigate = useNavigate();
  return (
    <div className="space-y-6">

      <PageHeader
        title="Receive Stock"
        subtitle="Add newly received inventory items."
      />

      <FormCard title="Stock Information">
        <form className="space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <Input
                    label="Asset Name"
                    placeholder="Enter asset name"
                />

                <Select
                    label="Category"
                    options={[
                        { value: "Laptop", label: "Laptop" },
                        { value: "Printer", label: "Printer" },
                        { value: "Networking", label: "Networking" },
                        { value: "Scanner", label: "Scanner" },
                        { value: "Desktop", label: "Desktop" },
                    ]}
                />

                <Input
                    label="Ledger Number"
                    placeholder="Enter ledger number"
                />

                <Input
                    label="Quantity"
                    type="number"
                    placeholder="Enter quantity"
                />

                <Input
                    label="Purchase Cost"
                    type="number"
                    placeholder="₹ Enter purchase cost"
                />

                <Input
                    label="Purchase Date"
                    type="date"
                />

                <Input
                    label="Received By"
                    value="Aditya Raj"
                    disabled
                />

            </div>

            <Textarea
                label="Remarks"
                placeholder="Enter remarks (optional)"
                rows={4}
            />

            <div className="flex justify-end gap-4">

                <Button
                    variant="secondary"
                    onClick={() => navigate("/inventory/assets")}
                >
                    Cancel
                </Button>

                <Button
                    variant="success"
                    onClick={() => navigate("/inventory/assets")}
                >
                    Receive Stock
                </Button>

            </div>

        </form>
      </FormCard>

    </div>
  );
}

export default ReceiveStock;