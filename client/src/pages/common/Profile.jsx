import { FaUserCircle } from "react-icons/fa";

import PageHeader from "../../components/common/PageHeader";
import FormCard from "../../components/common/FormCard";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import toast from "react-hot-toast";

function Profile() {

  const { user } = useAuth();

  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);

  const [passwordData, setPasswordData] = useState({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
  });

  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {

      const loadProfile = async () => {

          try {

              const response = await api.get("/users/profile");

              setProfile(response.data.data);

          } catch (error) {

              console.error(error);

              toast.error("Failed to load profile.");

          } finally {

              setLoading(false);

          }

      };

      loadProfile();

  }, []);

  if (loading) {

      return <div>Loading...</div>;

  }

  const roleLabel = {
    ADMIN: "Admin",
    INVENTORY_HOLDER: "Inventory Holder",
    USER: "User",
  };

  const statusLabel = {
    1: "Active",
    0: "Inactive",
  };

  const handlePasswordChange = async (e) => {

    e.preventDefault();

    setPasswordLoading(true);

    try {

        await api.put(
            "/users/change-password",
            passwordData
        );

        toast.success(
            "Password changed successfully."
        );

        setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });

    } catch (error) {

        console.error(error);

        toast.error(
            error.response?.data?.message ||
            "Failed to change password."
        );

    } finally {

        setPasswordLoading(false);

    }

  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        subtitle="View and update your personal information."
      />

      {/* Personal Information */}
      <FormCard title="Personal Information">
        <div className="flex flex-col items-center mb-8">
          <FaUserCircle
            size={90}
            className="text-gray-400"
          />

          <h2 className="text-2xl font-semibold mt-3">
            {`${profile.first_name} ${profile.last_name ?? ""}`}
          </h2>

          <p className="text-gray-500">
              {roleLabel[profile.role]}    
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Full Name"
            value={[
              profile.first_name,
              profile.middle_name,
              profile.last_name,
            ]
            .filter(Boolean)
            .join(" ")}
            disabled
          />

          <Input
              label="Username"
              value={profile.user_name}
              disabled
          />

          <Input
            label="Email"
            type="email"
            value={profile.email_id}
            disabled
          />

          <Input
            label="Phone Number"
            value={profile.mobile_no}
            disabled
          />

          <Input
            label="Cadre"
            value={profile.cadre_name}
            disabled
          />

          <Input
            label="Group"
            value={profile.group_name}
            disabled
          />

          <Input
            label="Role"
            value={profile.role}
            disabled
          />

          <Input
            label="Status"
            value={statusLabel[profile.status]}
            disabled
          />

          <Input
            label="Designation"
            value={profile.designation_name || "-"}
            disabled
          />

          <Input
            label="Internal Designation"
            value={profile.internal_designation || "-"}
            disabled
          />
        </div>
      </FormCard>

      <FormCard title="Change Password">

        <form
            className="space-y-6"
            onSubmit={handlePasswordChange}
        >

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <Input
                    label="Current Password"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                        setPasswordData({
                            ...passwordData,
                            currentPassword: e.target.value,
                        })
                    }
                    required
                />

                <Input
                    label="New Password"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                        setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                        })
                    }
                    required
                />

                <Input
                    label="Confirm New Password"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                        setPasswordData({
                            ...passwordData,
                            confirmPassword: e.target.value,
                        })
                    }
                    required
                />

            </div>

            <div className="flex justify-end">

                <Button
                    type="submit"
                    variant="success"
                    disabled={passwordLoading}
                >
                    {passwordLoading
                        ? "Changing Password..."
                        : "Change Password"}
                </Button>

            </div>

        </form>

    </FormCard>
    </div>
  );
}

export default Profile;