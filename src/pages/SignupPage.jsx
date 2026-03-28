import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthShell from "../components/auth/AuthShell";
import Button from "../components/ui/Button";
import Dropdown from "../components/ui/Dropdown";
import InputField from "../components/ui/InputField";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { getFirebaseAuthErrorMessage } from "../utils/firebaseAuthError";
import { batches, departments } from "../utils/constants";

const initialState = {
  fullName: "",
  universityId: "",
  department: "CSE",
  batch: "57",
  email: "",
  password: "",
};

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialState);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup } = useAuth();
  const { showToast } = useToast();

  const updateField = (field) => (event) =>
    setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitted(true);

    const hasEmpty = Object.values(form).some((value) => !String(value).trim());
    if (hasEmpty) {
      showToast("Please complete all signup fields.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      await signup({
        email: form.email.trim(),
        password: form.password,
        fullName: form.fullName,
      });

      showToast("Account created successfully.");
      setForm(initialState);
      setSubmitted(false);
      navigate("/student");
    } catch (error) {
      showToast(
        getFirebaseAuthErrorMessage(
          error,
          "Unable to create account right now.",
        ),
        "error",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      sideText="Create your verified MetroBridge account to connect with mentors, access course resources, and build your professional academic network."
      sideTitle="Start Your Journey"
      subtitle="Your account will be reviewed before approval."
      tag="Student Registration"
      title="Create Account">
      <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={onSubmit}>
        <InputField
          error={submitted && !form.fullName ? "Required" : ""}
          label="Full Name"
          onChange={updateField("fullName")}
          required
          value={form.fullName}
        />
        <InputField
          error={submitted && !form.universityId ? "Required" : ""}
          label="University ID"
          onChange={updateField("universityId")}
          required
          value={form.universityId}
        />

        <Dropdown
          label="Department"
          onChange={updateField("department")}
          options={departments
            .slice(1)
            .map((department) => ({ label: department, value: department }))}
          value={form.department}
        />
        <Dropdown
          label="Batch"
          onChange={updateField("batch")}
          options={batches.map((batch) => ({ label: batch, value: batch }))}
          value={form.batch}
        />

        <InputField
          className="sm:col-span-2"
          error={submitted && !form.email ? "Required" : ""}
          label="Email"
          onChange={updateField("email")}
          required
          type="email"
          value={form.email}
        />
        <InputField
          className="sm:col-span-2"
          label="Password"
          hint="Use at least 6 characters with a mix of letters and numbers."
          error={submitted && !form.password ? "Required" : ""}
          onChange={updateField("password")}
          required
          type="password"
          value={form.password}
        />

        <div className="sm:col-span-2">
          <Button
            className="w-full"
            disabled={isSubmitting}
            type="submit"
            variant="cta">
            {isSubmitting ? "Creating Account..." : "Submit for Approval"}
          </Button>
        </div>
      </form>
    </AuthShell>
  );
}
