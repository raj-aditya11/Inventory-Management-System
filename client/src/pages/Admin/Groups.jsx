import { useState, useEffect } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";

import PageHeader from "../../components/common/PageHeader";
import Input from "../../components/common/Input";
import Textarea from "../../components/common/Textarea";
import Button from "../../components/common/Button";
import FormCard from "../../components/common/FormCard";
import Table from "../../components/common/Table";

import api from "../../services/api";
import toast from "react-hot-toast";

function Groups() {
    const [showForm, setShowForm] = useState(false);

    const [groups, setGroups] = useState([]);

    const [loading, setLoading] = useState(false);

    const [editingGroup, setEditingGroup] = useState(null);

    const [formData, setFormData] = useState({
        group_name: "",
        description: "",
    });

    const loadGroups = async () => {

        try {

            const response = await api.get("/groups");

            setGroups(
                response.data.data.map(group => ({
                    ...group,
                    id: group.group_id,
                    name: group.group_name,
                    description: group.description || "-",
                    members: group.members,
                }))
            );

        } catch (error) {

            console.error(error);

            toast.error("Failed to load groups.");

        }

    };

    useEffect(() => {

        loadGroups();

    }, []);

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

            render: (_, row) => (
                <div className="flex gap-2">

                    <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleEdit(row)}
                    >
                        Edit
                    </Button>

                    <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(row.id)}
                    >
                        Delete
                    </Button>

                </div>
            ),
        },
    ];

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            if (editingGroup) {

                await api.put(
                    `/groups/${editingGroup}`,
                    {
                        group_name: formData.group_name,
                        description: formData.description,
                        status: 1,
                    }
                );

                toast.success("Group updated successfully.");

            } else {

                await api.post("/groups", {
                    group_name: formData.group_name,
                    description: formData.description,
                    status: 1,
                });

                toast.success("Group created successfully.");

            }

            setShowForm(false);

           setFormData({
                group_name: "",
                description: "",
            });

            setEditingGroup(null);

            setShowForm(false);

            loadGroups();

        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Failed to create group."
            );

        } finally {

            setLoading(false);

        }

    };

    const handleEdit = (group) => {

        setEditingGroup(group.id);

        setFormData({
            group_name: group.name,
            description:
                group.description === "-"
                    ? ""
                    : group.description,
        });

        setShowForm(true);

    };

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this group?"
        );

        if (!confirmDelete) return;

        try {

            await api.delete(`/groups/${id}`);

            toast.success("Group deleted successfully.");

            loadGroups();

        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Failed to delete group."
            );

        }

    };

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

                <FormCard
                    title={
                        editingGroup
                            ? "Edit Group"
                            : "Add New Group"
                    }
                >

                    <form className="space-y-6" onSubmit={handleSubmit}>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <Input
                                name="group_name"
                                label="Group Name"
                                value={formData.group_name}
                                onChange={handleChange}
                                placeholder="Enter group name"
                            />

                            <Textarea
                                name="description"
                                label="Description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter group description"
                            />

                        </div>

                        <div className="flex justify-end gap-4">

                            <Button
                                variant="secondary"
                                onClick={() => {

                                    setEditingGroup(null);

                                    setFormData({
                                        group_name: "",
                                        description: "",
                                    });

                                    setShowForm(false);

                                }}
                                >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                variant="success"
                                disabled={loading}
                            >
                                {loading ? editingGroup ? "Updating..." : "Creating..." : editingGroup ? "Update Group" : "Create Group"}
                            </Button>

                        </div>

                    </form>

                </FormCard>

            )}

            <div className="overflow-x-auto">

                <Table
                    columns={columns}
                    data={groups}
                />

            </div>
        </div>
    );
}

export default Groups;