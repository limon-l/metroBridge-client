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
  email: "",
  password: "",
  phone: "",
  expertise: "",
  bio: "",
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

const expertiseOptions = [
  { value: "", label: "Select primary expertise" },
  { value: "Programming Fundamentals", label: "Programming Fundamentals" },
  {
    value: "Data Structures & Algorithms",
    label: "Data Structures & Algorithms",
  },
  { value: "Database Systems", label: "Database Systems" },
  { value: "Software Engineering", label: "Software Engineering" },
  { value: "Networking", label: "Networking" },
  { value: "Career Guidance", label: "Career Guidance" },
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

export default function MentorSignupPage() {
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
      "email",
      "password",
      "phone",
      "expertise",
      "bio",
    ];
    const hasEmpty = required.some((key) => !String(form[key] || "").trim());
    if (hasEmpty) {
      showToast("Please complete all required fields.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      await signup({
        ...form,
        role: "mentor",
        expertise: form.expertise
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      });
      await logout();
      showToast("Mentor registration submitted. Wait for admin approval.");
      navigate("/mentor-login");
    } catch (error) {
      showToast(error?.message || "Unable to create account.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Mentor Registration"
      subtitle="Submit your profile and expertise for admin verification."
      tag="Mentor Onboarding"
      sideTitle="Verification Required"
      sideText="Only admin-approved mentors can log into mentor workspace.">
      <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={onSubmit}>
        <InputField
          label="Full Name"
          value={form.fullName}
          onChange={updateField("fullName")}
          required
        />
        <InputField
          label="University/Employee ID"
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
          label="Phone"
          value={form.phone}
          onChange={updateField("phone")}
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
          className="sm:col-span-2"
          label="Primary Expertise"
          options={expertiseOptions}
          value={form.expertise}
          onChange={updateField("expertise")}
          required
        />
        <InputField
          className="sm:col-span-2"
          label="Professional Bio"
          value={form.bio}
          onChange={updateField("bio")}
          required
        />
        <div className="sm:col-span-2">
          <Button
            className="w-full"
            disabled={isSubmitting}
            type="submit"
            variant="cta">
            {isSubmitting ? "Submitting..." : "Submit Mentor Profile"}
          </Button>
        </div>
      </form>
      <p className="mt-4 text-small text-neutral">
        Already applied?{" "}
        <Link className="font-medium text-primary" to="/mentor-login">
          Mentor login
        </Link>
      </p>
    </AuthShell>
  );
}
