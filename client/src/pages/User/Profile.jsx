import { FaUserCircle } from "react-icons/fa";

import PageHeader from "../../components/common/PageHeader";
import FormCard from "../../components/common/FormCard";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

import { profileData } from "../../data/mockData";

function Profile() {
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
            {profileData.name}
          </h2>

          <p className="text-gray-500">
            {profileData.department}        
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Full Name"
            defaultValue= {profileData.name}
          />

          <Input
            label="Email"
            type="email"
            defaultValue= {profileData.email}
          />

          <Input
            label="Phone Number"
            defaultValue= {profileData.phone}
          />

          <Input
            label="Employee ID"
            defaultValue= {profileData.employeeId}
            disabled
          />

          <Input
            label="Department"
            defaultValue= {profileData.department}
            disabled
          />

          <Input
            label="Role"
            defaultValue= {profileData.role}
            disabled
          />

          <Input
            label="Group"
            defaultValue= {profileData.group}
            disabled
          />
        </div>
      </FormCard>

      {/* Change Password */}
      <FormCard title="Change Password">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Input
            label="Current Password"
            type="password"
            placeholder="Enter current password"
          />

          <Input
            label="New Password"
            type="password"
            placeholder="Enter new password"
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm new password"
          />
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <Button variant="secondary">
            Cancel
          </Button>

          <Button>
            Save Changes
          </Button>
        </div>
      </FormCard>
    </div>
  );
}

export default Profile;