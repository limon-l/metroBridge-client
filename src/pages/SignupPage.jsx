import { useState } from "react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Dropdown from "../components/ui/Dropdown";
import InputField from "../components/ui/InputField";
import { useToast } from "../hooks/useToast";
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
  const [form, setForm] = useState(initialState);
  const [submitted, setSubmitted] = useState(false);
  const { showToast } = useToast();

  const updateField = (field) => (event) =>
    setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const onSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);

    const hasEmpty = Object.values(form).some((value) => !String(value).trim());
    if (hasEmpty) {
      showToast("Please complete all signup fields.", "error");
      return;
    }

    showToast(
      "Signup submitted. Your account will be reviewed before approval.",
    );
    setForm(initialState);
    setSubmitted(false);
  };

  return (
    <div className="content-container py-10">
      <Card className="mx-auto w-full max-w-2xl">
        <h2>Create account</h2>
        <p className="mt-2 text-small text-neutral">
          Your account will be reviewed before approval.
        </p>

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
            error={submitted && !form.password ? "Required" : ""}
            label="Password"
            onChange={updateField("password")}
            required
            type="password"
            value={form.password}
          />

          <div className="sm:col-span-2">
            <Button className="w-full" type="submit" variant="cta">
              Submit for Approval
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
