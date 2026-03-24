import { useState } from "react";
import Button from "../ui/Button";
import Card from "../ui/Card";
import InputField from "../ui/InputField";
import { useToast } from "../../hooks/useToast";

const initialForm = {
  fullName: "",
  email: "",
  subject: "",
  message: "",
};

export default function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const { showToast } = useToast();

  const updateField = (field) => (event) =>
    setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const onSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);

    const hasEmpty = Object.values(form).some((value) => !String(value).trim());
    if (hasEmpty) {
      showToast("Please complete all required fields.", "error");
      return;
    }

    showToast("Message sent! We'll get back to you within 24 hours.");
    setForm(initialForm);
    setSubmitted(false);
  };

  return (
    <Card>
      <h2>Get in touch</h2>
      <p className="mt-2 text-neutral">
        Send us a message and we'll respond within 24 hours.
      </p>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            error={submitted && !form.fullName ? "Required" : ""}
            id="fullName"
            label="Full Name"
            onChange={updateField("fullName")}
            required
            value={form.fullName}
          />
          <InputField
            error={submitted && !form.email ? "Required" : ""}
            id="email"
            label="Email"
            onChange={updateField("email")}
            required
            type="email"
            value={form.email}
          />
        </div>

        <InputField
          error={submitted && !form.subject ? "Required" : ""}
          id="subject"
          label="Subject"
          onChange={updateField("subject")}
          required
          value={form.subject}
        />

        <div className="space-y-2">
          <label
            className="text-small font-medium text-gray-700"
            htmlFor="message">
            Message <span className="text-accent">*</span>
          </label>
          <textarea
            className={`w-full rounded-card border px-4 py-3 text-body outline-none transition ${
              submitted && !form.message
                ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                : "border-border focus:border-primary-light focus:ring-2 focus:ring-blue-100"
            }`}
            id="message"
            onChange={updateField("message")}
            placeholder="Tell us how we can help..."
            rows={5}
            value={form.message}
          />
          {submitted && !form.message ? (
            <p className="text-small text-red-600">Required</p>
          ) : null}
        </div>

        <Button type="submit" variant="primary">
          Send Message
        </Button>
      </form>
    </Card>
  );
}
