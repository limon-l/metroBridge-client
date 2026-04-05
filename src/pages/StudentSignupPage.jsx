import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "../components/auth/AuthShell";
import Button from "../components/ui/Button";
import InputField from "../components/ui/InputField";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";

const initialState = {
  fullName: "",
  universityId: "",
  department: "",
  batch: "",
  email: "",
  password: "",
  phone: "",
  bloodGroup: "",
};

const departmentOptions = [
  { value: "", label: "Select department" },
  { value: "CSE", label: "CSE" },
  { value: "EEE", label: "EEE" },
  { value: "BBA", label: "BBA" },
  { value: "English", label: "English" },
  { value: "Law", label: "Law" },
  { value: "Architecture", label: "Architecture" },
];

const batchOptions = [
  { value: "", label: "Select batch" },
  ...Array.from({ length: 30 }, (_, index) => {
    const value = String(index + 1);
    return { value, label: value };
  }),
];

const bloodGroupOptions = [
  { value: "", label: "Select blood group" },
  { value: "A+", label: "A+" },
  { value: "A-", label: "A-" },
  { value: "B+", label: "B+" },
  { value: "B-", label: "B-" },
  { value: "AB+", label: "AB+" },
  { value: "AB-", label: "AB-" },
  { value: "O+", label: "O+" },
  { value: "O-", label: "O-" },
];

const formatUniversityId = (value) => {
  const digitsOnly = String(value || "")
    .replace(/\D/g, "")
    .slice(0, 9);

  if (digitsOnly.length <= 3) {
    return digitsOnly;
  }

  if (digitsOnly.length <= 6) {
    return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3)}`;
  }

  return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
};

export default function StudentSignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup, logout } = useAuth();
  const { showToast } = useToast();

  const updateField = (field) => (event) =>
    setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const updateUniversityId = (event) => {
    setForm((prev) => ({
      ...prev,
      universityId: formatUniversityId(event.target.value),
    }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    const required = [
      "fullName",
      "universityId",
      "department",
      "batch",
      "email",
      "password",
      "phone",
      "bloodGroup",
    ];

    const hasEmpty = required.some((key) => !String(form[key] || "").trim());
    if (hasEmpty) {
      showToast("Please complete all required fields.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      await signup({ ...form, role: "student" });
      await logout();
      showToast("Student registration submitted. Wait for admin approval.");
      navigate("/student-login");
    } catch (error) {
      showToast(error?.message || "Unable to create account.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Student Registration"
      subtitle="Submit core details for admin verification."
      tag="Student Onboarding"
      sideTitle="Verification Required"
      sideText="After registration, admin will review your details and approve or ban access.">
      <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={onSubmit}>
        <InputField
          label="Full Name"
          value={form.fullName}
          onChange={updateField("fullName")}
          required
        />
        <InputField
          label="University ID"
          hint="Format: XXX-XXX-XXX"
          inputMode="numeric"
          maxLength={11}
          value={form.universityId}
          onChange={updateUniversityId}
          required
        />
        <InputField
          label="Department"
          options={departmentOptions}
          value={form.department}
          onChange={updateField("department")}
          required
        />
        <InputField
          label="Batch"
          options={batchOptions}
          value={form.batch}
          onChange={updateField("batch")}
          required
        />
        <InputField
          className="sm:col-span-2"
          label="Email"
          type="email"
          value={form.email}
          onChange={updateField("email")}
          required
        />
        <InputField
          className="sm:col-span-2"
          label="Password"
          type="password"
          value={form.password}
          onChange={updateField("password")}
          required
        />
        <InputField
          label="Mobile Number"
          value={form.phone}
          onChange={updateField("phone")}
          required
        />
        <InputField
          label="Blood Group"
          options={bloodGroupOptions}
          value={form.bloodGroup}
          onChange={updateField("bloodGroup")}
          required
        />
        <div className="sm:col-span-2">
          <Button
            className="w-full"
            disabled={isSubmitting}
            type="submit"
            variant="cta">
            {isSubmitting ? "Submitting..." : "Submit for Admin Approval"}
          </Button>
        </div>
      </form>
      <p className="mt-4 text-small text-neutral">
        Already applied?{" "}
        <Link className="font-medium text-primary" to="/student-login">
          Student login
        </Link>
      </p>
    </AuthShell>
  );
}
