import { useState } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";

import PageHeader from "../../components/common/PageHeader";
import Input from "../../components/common/Input";
import Textarea from "../../components/common/Textarea";
import Button from "../../components/common/Button";
import FormCard from "../../components/common/FormCard";
import Table from "../../components/common/Table";

import { groupsData } from "../../data/mockData";

function Groups() {
    const [showForm, setShowForm] = useState(false);

    const columns = [
        {
            header: "Group ID",
            accessor: "id",
        },
        {
            header: "Group Name",
            accessor: "name",
        },
        {
            header: "Description",
            accessor: "description",
        },
        {
            header: "Members",
            accessor: "members",
        },
        {
            header: "Actions",
            accessor: "id",

            render: () => (
                <Button
                    size="sm"
                    variant="primary"
                >
                    Edit
                </Button>
            ),
        },
    ];
    return(
        <div className="space-y-6">
            <PageHeader
                title="Groups"
                subtitle="Manage user groups."
            />

            <div className="flex flex-col md:flex-row justify-between items-center gap-4">

                <div className="w-full md:max-w-md">
                    <Input
                        placeholder="Search groups..."
                        icon={FaSearch}
                    />
                </div>

                <Button
                    icon={!showForm ? FaPlus : null}
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? "Close Form" : "Add Group"}
                </Button>
            </div>

            {showForm && (

                <FormCard title="Add New Group">

                    <form className="space-y-6">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <Input
                                label="Group Name"
                                placeholder="Enter group name"
                            />

                            <Textarea
                                label="Description"
                                placeholder="Enter group description"
                            />

                        </div>

                        <div className="flex justify-end gap-4">

                            <Button
                                variant="secondary"
                                onClick={() => setShowForm(false)}
                                >
                                Cancel
                            </Button>

                            <Button variant="success">
                                Create User
                            </Button>

                        </div>

                    </form>

                </FormCard>

            )}

            <div className="overflow-x-auto">

                <Table
                    columns={columns}
                    data={groupsData}
                />

            </div>
        </div>
    );
}

export default Groups;