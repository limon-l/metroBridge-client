import { useState } from "react";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import InputField from "../components/ui/InputField";
import { useToast } from "../hooks/useToast";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    fullName: "Student Name",
    department: "CSE",
    batch: "59",
    email: "student@metrouni.edu.bd",
  });
  const { showToast } = useToast();

  const onChange = (field) => (event) =>
    setProfile((prev) => ({ ...prev, [field]: event.target.value }));

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2>Profile</h2>
            <p className="mt-2">Manage personal and academic details.</p>
          </div>
          <Badge variant="success">Verified Account</Badge>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3>User info</h3>
          <div className="mt-4 grid gap-3">
            <InputField
              label="Full Name"
              onChange={onChange("fullName")}
              value={profile.fullName}
            />
            <InputField
              label="Email"
              onChange={onChange("email")}
              type="email"
              value={profile.email}
            />
          </div>
        </Card>

        <Card>
          <h3>Academic details</h3>
          <div className="mt-4 grid gap-3">
            <InputField
              label="Department"
              onChange={onChange("department")}
              value={profile.department}
            />
            <InputField
              label="Batch"
              onChange={onChange("batch")}
              value={profile.batch}
            />
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3>Uploaded content</h3>
          <p className="mt-3 text-small text-neutral">
            3 lecture notes, 2 mentorship guides, 1 session recording.
          </p>
        </Card>
        <Card>
          <h3>Reviews</h3>
          <p className="mt-3 text-small text-neutral">
            Average rating: 4.8/5 based on 24 reviews.
          </p>
        </Card>
      </div>

      <Button
        onClick={() => showToast("Profile updated successfully.")}
        variant="primary">
        Save Changes
      </Button>
    </div>
  );
}
