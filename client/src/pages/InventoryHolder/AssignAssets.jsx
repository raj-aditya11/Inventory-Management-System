import { useNavigate } from "react-router-dom";

import PageHeader from "../../components/common/PageHeader";
import FormCard from "../../components/common/FormCard";
import Input from "../../components/common/Input";
import Textarea from "../../components/common/Textarea";
import Select from "../../components/common/Select";
import Button from "../../components/common/Button";

function AssignAssets(){
    const navigate = useNavigate();
    const assetOptions = [
        { value: "laptop", label: "Dell Latitude 5420" },
        { value: "printer", label: "HP LaserJet Pro" },
        { value: "scanner", label: "Canon Scanner" },
    ];

    const userOptions = [
        { value: "1", label: "Rahul Sharma" },
        { value: "2", label: "Priya Singh" },
        { value: "3", label: "Amit Kumar" },
    ];

    return(
        <div>
            <PageHeader
                title="Assign Assets"
                subtitle="Assign inventory items to users."
            />
            
            <FormCard title= "Assignment Details">
                <form className="space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <Select
                            label="Asset"
                            options={assetOptions}
                        />

                        <Select
                            label="Assigned To"
                            options={userOptions}
                        />

                        <Input
                            label="Quantity"
                            type="number"
                            placeholder="Number of items"
                        />

                        <Input
                            label="Assigned Date"
                            type="date"
                        />

                        <Input
                            label="Expected Return Date (Optional)"
                            type="date"
                        />

                        <Input
                            label="Assigned By"
                            value="Aditya Raj"
                            disabled
                        />

                    </div>

                    <Textarea
                        label="Remarks"
                        placeholder="Enter remarks"
                    />

                    <div className="flex justify-end gap-4">

                        <Button
                            variant="secondary"
                            onClick={() => navigate("/inventory/assets")}
                        >
                            Cancel
                        </Button>

                        <Button
                            variant="primary"
                            onClick={() => navigate("/inventory/assets")}
                        >
                            Assign Asset
                        </Button>

                    </div>

                </form>
            </FormCard>
        </div>
    )
}

export default AssignAssets;