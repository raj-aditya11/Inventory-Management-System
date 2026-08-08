import { useState, useEffect } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";

import PageHeader from "../../components/common/PageHeader";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Button from "../../components/common/Button";
import FormCard from "../../components/common/FormCard";
import Table from "../../components/common/Table";

import api from "../../services/api";
import toast from "react-hot-toast";

function Users() {
    const [showForm, setShowForm] = useState(false); 
       

    const [users, setUsers] = useState([]);
    const [groups, setGroups] = useState([]);
    const [cadres, setCadres] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [internalDesignations, setInternalDesignations] = useState([]);

    const [loading, setLoading] = useState(false);

    const [editingUser, setEditingUser] = useState(null);

    const [formData, setFormData] = useState({
        first_name: "",
        user_name: "",
        email_id: "",
        mobile_no: "",
        cadre_id: "",
        group_id: "",
        role: "",
        desig_id: "",
        internal_desig_id: "",
        status: 1,
        password: "",
        confirmPassword: "",
    });

    const roleOptions = [
        { value: "ADMIN", label: "Admin" },
        { value: "INVENTORY_HOLDER", label: "Inventory Holder" },
        { value: "USER", label: "User" },
    ];
    const groupOptions = groups.map(group => ({
        value: group.group_id,
        label: group.group_name,
    }));
    const cadreOptions = cadres.map(cadre => ({
        value: cadre.cadre_id,
        label: cadre.cadre_name,
    }));

    const designationOptions = designations.map(designation => ({
        value: designation.desig_id,
        label: designation.designation_name,
    }));

    const internalDesignationOptions = internalDesignations.map(designation => ({
        value: designation.internal_desig_id,
        label: designation.designation_name,
    }));

    const statusOptions = [
        { value: 1, label: "Active" },
        { value: 0, label: "Inactive" },
    ];

    const loadData = async () => {

        try {

            const [
                usersResponse,
                groupsResponse,
                cadresResponse,
                designationsResponse,
                internalDesignationsResponse,
            ] = await Promise.all([
                api.get("/users"),
                api.get("/groups"),
                api.get("/cadres"),
                api.get("/designations"),
                api.get("/internal-designations"),
            ]);

            setUsers(
                usersResponse.data.data.map((user) => ({
                    ...user,

                    name: [
                        user.first_name,
                        user.middle_name,
                        user.last_name,
                    ]
                        .filter(Boolean)
                        .join(" "),

                    email: user.email_id,

                    mobile: user.mobile_no,

                    cadre:
                        cadresResponse.data.data.find(
                            c => c.cadre_id === user.cadre_id
                        )?.cadre_name || "-",

                    designation:
                        designationsResponse.data.data.find(
                            d => d.desig_id === user.desig_id
                        )?.designation_name || "-",

                    internalDesignation:
                        internalDesignationsResponse.data.data.find(
                            d => d.internal_desig_id === user.internal_desig_id
                        )?.designation_name || "-",

                    group:
                        groupsResponse.data.data.find(
                            g => g.group_id === user.group_id
                        )?.group_name || "-",

                    statusLabel:
                        user.status === 1
                            ? "Active"
                            : "Inactive",

                    roleLabel:
                        user.role === "ADMIN"
                            ? "Admin"
                            : user.role === "USER"
                            ? "User"
                            : "Inventory Holder",
                }))
            );

            setGroups(groupsResponse.data.data);
            setCadres(cadresResponse.data.data);
            setDesignations(designationsResponse.data.data);
            setInternalDesignations(
                internalDesignationsResponse.data.data
            );

        } catch (error) {

            console.error(error);

            toast.error("Failed to load data.");

        }

    };

    useEffect(() => {

        loadData();

    }, []);

    const columns = [
        {
            header: "Name",
            accessor: "name",
        },
        {
            header: "Email",
            accessor: "email",
        },
        {
            header: "Mobile Number",
            accessor: "mobile",
        },
        {
            header: "Cadre",
            accessor: "cadre",
        },
        {
            header: "Designation",
            accessor: "designation",
        },
        {
            header: "Internal Designation",
            accessor: "internalDesignation"
        },
        {
            header: "Group",
            accessor: "group",
        },
        {
            header: "Role",
            accessor: "roleLabel",

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
            header: "Status",
            accessor: "statusLabel",

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

            render: (_, row) => (

                <div className="flex gap-2">

                    <Button
                        size="sm"
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
        }
        
    ];

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (
            !editingUser &&
            formData.password !== formData.confirmPassword
        ) {
            toast.error("Passwords do not match.");
            return;
        }

        try {

            setLoading(true);

            if (editingUser) {

                await api.put(
                    `/users/${editingUser}`,
                    {
                        first_name: formData.first_name,
                        user_name: formData.user_name,
                        email_id: formData.email_id,
                        mobile_no: formData.mobile_no,
                        cadre_id: Number(formData.cadre_id),
                        desig_id: Number(formData.desig_id),
                        internal_desig_id: Number(formData.internal_desig_id),
                        group_id: Number(formData.group_id),
                        role: formData.role,
                        status: Number(formData.status),
                    }
                );

                toast.success("User updated successfully.");

            } else {

                if (formData.password !== formData.confirmPassword) {

                    toast.error("Passwords do not match.");

                    return;

                }

                await api.post("/users", {

                    first_name: formData.first_name,
                    user_name: formData.user_name,
                    email_id: formData.email_id,
                    mobile_no: formData.mobile_no,
                    cadre_id: Number(formData.cadre_id),
                    desig_id: Number(formData.desig_id),
                    internal_desig_id: Number(formData.internal_desig_id),
                    group_id: Number(formData.group_id),
                    role: formData.role,
                    status: Number(formData.status),
                    password: formData.password,

                });

                toast.success("User created successfully.");

            }

            setEditingUser(null);

            setFormData({
                first_name: "",
                user_name: "",
                email_id: "",
                mobile_no: "",
                cadre_id: "",
                desig_id: "",
                internal_desig_id: "",
                group_id: "",
                role: "",
                status: 1,
                password: "",
                confirmPassword: "",
            });

            setShowForm(false);

            loadData();

        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Failed to save user."
            );

        } finally {

            setLoading(false);

        }

    };

    const handleEdit = (user) => {

        setEditingUser(user.id);

        setFormData({
            first_name: user.first_name || "",
            user_name: user.user_name || "",
            email_id: user.email_id || "",
            mobile_no: user.mobile_no || "",

            cadre_id: user.cadre_id || "",
            desig_id: user.desig_id || "",
            internal_desig_id: user.internal_desig_id || "",
            group_id: user.group_id || "",

            role: user.role,
            status: user.status,

            password: "",
            confirmPassword: "",
        });

        setShowForm(true);

    };

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this user?"
        );

        if (!confirmDelete) return;

        try {

            await api.delete(`/users/${id}`);

            toast.success("User deleted successfully.");

            loadData();

        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Failed to delete user."
            );

        }

    };

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

                <FormCard
                    title={
                        editingUser
                            ? "Edit User"
                            : "Add New User"
                    }
                >

                    <form className="space-y-6" onSubmit={handleSubmit}>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            <Input
                                name="first_name"
                                label="First Name *"
                                placeholder="Enter first name"
                                value={formData.first_name}
                                onChange={handleChange}
                            />

                            <Input
                                name="user_name"
                                label="Username *"
                                placeholder="Enter username"
                                value={formData.user_name}
                                onChange={handleChange}
                            />

                            <Input
                                name="email_id"
                                label="Email *"
                                type="email"
                                placeholder="Enter email"
                                value={formData.email_id}
                                onChange={handleChange}
                            />

                            <Input
                                name="mobile_no"
                                label="Mobile Number *"
                                placeholder="Enter mobile number"
                                value={formData.mobile_no}
                                onChange={handleChange}
                            />

                            <Select
                                name="cadre_id"
                                label="Cadre *"
                                value={formData.cadre_id}
                                onChange={handleChange}
                                options={cadreOptions}
                            />

                            <Select
                                name="group_id"
                                label="Group *"
                                value={formData.group_id}
                                onChange={handleChange}
                                options={groupOptions}
                            />

                            <Select
                                name="role"
                                label="Role *"
                                value={formData.role}
                                onChange={handleChange}
                                options={roleOptions}
                            />

                            <Select
                                name="desig_id"
                                label="Designation *"
                                value={formData.desig_id}
                                onChange={handleChange}
                                options={designationOptions}
                            />

                            <Select
                                name="internal_desig_id"
                                label="Internal Designation *"
                                value={formData.internal_desig_id}
                                onChange={handleChange}
                                options={internalDesignationOptions}
                            />

                            <Select
                                name="status"
                                label="Status *"
                                value={formData.status}
                                onChange={handleChange}
                                options={statusOptions}
                            />

                            {!editingUser && (
                                <>
                                    <Input
                                        name="password"
                                        label="Password *"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />

                                    <Input
                                        name="confirmPassword"
                                        label="Confirm Password *"
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                    />
                                </>
                            )}

                        </div>

                        <div className="flex justify-end gap-4">

                            <Button
                            variant="secondary"
                            onClick={() => {

                                setEditingUser(null);

                                setFormData({
                                    first_name: "",
                                    user_name: "",
                                    email_id: "",
                                    mobile_no: "",
                                    cadre_id: "",
                                    desig_id: "",
                                    internal_desig_id: "",
                                    group_id: "",
                                    role: "",
                                    status: 1,
                                    password: "",
                                    confirmPassword: "",
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
                                {loading ? editingUser ? "Updating..." : "Creating..." : editingUser ? "Update User" : "Create User"}
                            </Button>

                        </div>

                    </form>

                </FormCard>

            )}

            <div className="overflow-x-auto">

                <Table
                    columns={columns}
                    data={users}
                />

            </div>
        </div>
    );
}

export default Users;