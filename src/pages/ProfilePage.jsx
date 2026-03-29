import { useMemo, useState } from "react";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import InputField from "../components/ui/InputField";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    fullName: user?.displayName || "",
    studentId: "",
    department: "",
    batch: "",
    section: "",
    shift: "",
    email: user?.email || "",
    phone: "",
    dateOfBirth: "",
    bloodGroup: "",
    gender: "",
    homeAddress: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    guardianName: "",
    guardianPhone: "",
    bio: "",
  });
  const [photoPreview, setPhotoPreview] = useState("");
  const { showToast } = useToast();

  const onChange = (field) => (event) =>
    setProfile((prev) => ({ ...prev, [field]: event.target.value }));

  const formatStudentId = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 9);
    const parts = [
      digits.slice(0, 3),
      digits.slice(3, 6),
      digits.slice(6, 9),
    ].filter(Boolean);
    return parts.join("-");
  };

  const onStudentIdChange = (event) => {
    setProfile((prev) => ({
      ...prev,
      studentId: formatStudentId(event.target.value),
    }));
  };

  const studentName = useMemo(
    () => profile.fullName || "Student Name",
    [profile.fullName],
  );

  const onPhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result?.toString() || "");
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = (event) => {
    event.preventDefault();

    if (!/^\d{3}-\d{3}-\d{3}$/.test(profile.studentId)) {
      showToast("Student ID must be 9 digits in this format: 231-115-218");
      return;
    }

    showToast("Profile updated successfully.");
  };

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <Card className="border-primary/20 bg-gradient-to-r from-primary/10 via-white to-accent/10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2>Profile</h2>
            <p className="mt-2">
              Manage your personal, academic, and emergency details.
            </p>
          </div>
          <Badge variant="success">Verified Account</Badge>
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_2fr]">
        <Card>
          <h3>Student identity</h3>
          <div className="mt-4 flex flex-col items-center rounded-card border border-dashed border-border bg-slate-50 p-5 text-center">
            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-slate-200 shadow-soft">
              {photoPreview ? (
                <img
                  alt="Student profile"
                  className="h-full w-full object-cover"
                  src={photoPreview}
                />
              ) : (
                <span className="text-h3 font-bold text-slate-600">
                  {studentName
                    .split(" ")
                    .slice(0, 2)
                    .map((item) => item?.[0] || "")
                    .join("")
                    .toUpperCase()}
                </span>
              )}
            </div>
            <p className="mt-3 text-small text-neutral">
              Photo is currently preview-only. Backend save can be connected
              later.
            </p>
            <label
              className="mt-3 inline-flex cursor-pointer items-center justify-center rounded-card border border-border bg-white px-4 py-2 text-small font-semibold text-primary transition hover:bg-slate-100"
              htmlFor="profilePhoto">
              Upload Photo
            </label>
            <input
              accept="image/*"
              className="hidden"
              id="profilePhoto"
              onChange={onPhotoChange}
              type="file"
            />
          </div>

          <div className="mt-4 grid gap-3">
            <InputField
              label="Full Name"
              onChange={onChange("fullName")}
              required
              value={profile.fullName}
            />
            <InputField
              hint="Format: XXX-XXX-XXX"
              label="Student ID"
              maxLength={11}
              onChange={onStudentIdChange}
              pattern="\\d{3}-\\d{3}-\\d{3}"
              required
              value={profile.studentId}
            />
            <InputField
              label="Email"
              onChange={onChange("email")}
              required
              type="email"
              value={profile.email}
            />
            <InputField
              label="Phone Number"
              onChange={onChange("phone")}
              required
              value={profile.phone}
            />
            <InputField
              label="Date of Birth"
              onChange={onChange("dateOfBirth")}
              required
              type="date"
              value={profile.dateOfBirth}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <label
                  className="text-small font-medium text-gray-700"
                  htmlFor="section">
                  Section
                </label>
                <select
                  className="w-full rounded-card border border-border bg-white px-4 py-3 text-body text-gray-800 outline-none transition focus:border-primary-light focus:ring-2 focus:ring-blue-100"
                  id="section"
                  onChange={onChange("section")}
                  required
                  value={profile.section}>
                  <option value="">Select section</option>
                  {"ABCDEFGHIJ".split("").map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label
                  className="text-small font-medium text-gray-700"
                  htmlFor="shift">
                  Shift
                </label>
                <select
                  className="w-full rounded-card border border-border bg-white px-4 py-3 text-body text-gray-800 outline-none transition focus:border-primary-light focus:ring-2 focus:ring-blue-100"
                  id="shift"
                  onChange={onChange("shift")}
                  required
                  value={profile.shift}>
                  <option value="">Select shift</option>
                  <option value="Day">Day</option>
                  <option value="Evening">Evening</option>
                </select>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <label
                  className="text-small font-medium text-gray-700"
                  htmlFor="bloodGroup">
                  Blood Group
                  <span className="text-accent"> *</span>
                </label>
                <select
                  className="w-full rounded-card border border-border bg-white px-4 py-3 text-body text-gray-800 outline-none transition focus:border-primary-light focus:ring-2 focus:ring-blue-100"
                  id="bloodGroup"
                  onChange={onChange("bloodGroup")}
                  required
                  value={profile.bloodGroup}>
                  <option value="">Select blood group</option>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                    (group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ),
                  )}
                </select>
              </div>
              <div className="space-y-2">
                <label
                  className="text-small font-medium text-gray-700"
                  htmlFor="gender">
                  Gender
                  <span className="text-accent"> *</span>
                </label>
                <select
                  className="w-full rounded-card border border-border bg-white px-4 py-3 text-body text-gray-800 outline-none transition focus:border-primary-light focus:ring-2 focus:ring-blue-100"
                  id="gender"
                  onChange={onChange("gender")}
                  required
                  value={profile.gender}>
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h3>Academic and contact details</h3>
          <div className="mt-4 grid gap-3">
            <InputField
              label="Department"
              onChange={onChange("department")}
              required
              value={profile.department}
            />
            <InputField
              label="Batch"
              onChange={onChange("batch")}
              required
              value={profile.batch}
            />
            <div className="space-y-2">
              <label
                className="text-small font-medium text-gray-700"
                htmlFor="homeAddress">
                Home Address
              </label>
              <textarea
                className="min-h-24 w-full rounded-card border border-border bg-white px-4 py-3 text-body text-gray-800 outline-none transition focus:border-primary-light focus:ring-2 focus:ring-blue-100"
                id="homeAddress"
                onChange={onChange("homeAddress")}
                placeholder="Village/Road, Area, District"
                required
                value={profile.homeAddress}
              />
            </div>
            <div className="space-y-2">
              <label
                className="text-small font-medium text-gray-700"
                htmlFor="bio">
                Short Bio / About
              </label>
              <textarea
                className="min-h-24 w-full rounded-card border border-border bg-white px-4 py-3 text-body text-gray-800 outline-none transition focus:border-primary-light focus:ring-2 focus:ring-blue-100"
                id="bio"
                onChange={onChange("bio")}
                placeholder="Share your interests, goals, or extra details"
                required
                value={profile.bio}
              />
            </div>
          </div>

          <div className="mt-6 rounded-card border border-border bg-slate-50 p-4">
            <h3>Emergency contact</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <InputField
                label="Contact Person Name"
                onChange={onChange("emergencyContactName")}
                required
                value={profile.emergencyContactName}
              />
              <InputField
                label="Contact Person Phone"
                onChange={onChange("emergencyContactPhone")}
                required
                value={profile.emergencyContactPhone}
              />
              <InputField
                label="Guardian Name"
                onChange={onChange("guardianName")}
                required
                value={profile.guardianName}
              />
              <InputField
                label="Guardian Phone"
                onChange={onChange("guardianPhone")}
                required
                value={profile.guardianPhone}
              />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <h3>Profile completion</h3>
          <p className="mt-3 text-small text-neutral">
            Complete all fields to keep your student profile updated for mentors
            and administration.
          </p>
        </Card>
        <Card>
          <h3>Photo and documents</h3>
          <p className="mt-3 text-small text-neutral">
            Profile photo is shown instantly in UI. Backend persistence can be
            integrated in the next phase.
          </p>
        </Card>
        <Card>
          <h3>Privacy note</h3>
          <p className="mt-3 text-small text-neutral">
            Sensitive data like blood group and emergency contacts should be
            visible only to authorized roles.
          </p>
        </Card>
      </div>

      <Button type="submit" variant="primary">
        Save Changes
      </Button>
    </form>
  );
}
