import { useState } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";

import PageHeader from "../../components/common/PageHeader";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Button from "../../components/common/Button";
import FormCard from "../../components/common/FormCard";
import Table from "../../components/common/Table";

import { usersData } from "../../data/mockData";

function Users() {
    const [showForm, setShowForm] = useState(false);    

    const roleOptions = [
        { value: "Admin", label: "Admin" },
        { value: "Inventory Holder", label: "Inventory Holder" },
        { value: "User", label: "User" },
    ];
    const groupOptions = [
        { value: "IT", label: "IT Department" },
        { value: "HR", label: "Human Resources" },
        { value: "Accounts", label: "Accounts" },
    ];
    const cadreOptions = [
        { value: "Scientist", label: "Scientist" },
        { value: "Technical", label: "Technical" },
        { value: "Administrative", label: "Administrative" },
        { value: "Contractual", label: "Contractual" },
    ];

    const designationOptions = [
        { value: "Scientist C", label: "Scientist C" },
        { value: "Scientist D", label: "Scientist D" },
        { value: "Senior Technician", label: "Senior Technician" },
        { value: "Assistant", label: "Assistant" },
    ];

    const internalDesignationOptions = [
        { value: "Inventory Holder", label: "Inventory Holder" },
        { value: "Store Incharge", label: "Store Incharge" },
        { value: "Lab Incharge", label: "Lab Incharge" },
        { value: "Project Lead", label: "Project Lead" },
    ];

    const statusOptions = [
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
    ];

    const columns = [
        {
            header: "User ID",
            accessor: "id",
        },
        {
            header: "Name",
            accessor: "name",
        },
        {
            header: "Email",
            accessor: "email",
        },
        {
            header: "Role",
            accessor: "role",

            render: (value) => {

            const colors = {
                Admin: "bg-red-100 text-red-700",
                "Inventory Holder": "bg-blue-100 text-blue-700",
                User: "bg-green-100 text-green-700",
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
            header: "Group",
            accessor: "group",
        },
        {
            header: "Status",
            accessor: "status",

            render: (value) => {

            const colors = {
                Active: "bg-green-100 text-green-700",
                Inactive: "bg-red-100 text-red-700",
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
                title="Users"
                subtitle="Manage system users."
            />

            <div className="flex flex-col md:flex-row justify-between items-center gap-4">

                <div className="w-full md:max-w-md">
                    <Input
                        placeholder="Search users..."
                        icon={FaSearch}
                    />
                </div>

                <Button
                    icon={!showForm ? FaPlus : null}
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? "Close Form" : "Add User"}
                </Button>
            </div>

            {showForm && (

                <FormCard title="Add New User">

                    <form className="space-y-6">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <Input
                                label="Name *" 
                                placeholder="e.g. Rahul Sharma" 
                            />

                            <Input
                                label="Email *"
                                type="email"
                                placeholder="name@example.com"
                            />

                            <Input
                                label="Mobile Number *"
                                type="tel"
                                placeholder="e.g. 9876543210"
                            />

                            <Select
                                label="Cadre *"
                                placeholder="Select Cadre"
                                options={cadreOptions}
                            />

                            <Select
                                label="Group *"
                                placeholder="Select Group"
                                options={groupOptions}
                            />

                            <Select
                                label="Role *"
                                placeholder="Select Role"
                                options={roleOptions}
                            />

                            <Select
                                label="Designation *"
                                placeholder="Select Designation"
                                options={designationOptions}
                            />

                            <Select
                                label="Internal Designation *"
                                placeholder="Select Internal Designation"
                                options={internalDesignationOptions}
                            />

                            <Select
                                label="Status *"
                                placeholder="Select Status"
                                options={statusOptions}
                            />

                            <Input
                                label="Password *"
                                type="password"
                                placeholder="Enter password"
                            />

                            <Input
                                label="Confirm Password *"
                                type="password"
                                placeholder="Confirm password"
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
                    data={usersData}
                />

            </div>
        </div>
    );
}

export default Users;