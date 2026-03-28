import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "../components/auth/AuthShell";
import Button from "../components/ui/Button";
import InputField from "../components/ui/InputField";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { getFirebaseAuthErrorMessage } from "../utils/firebaseAuthError";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailError = submitted && !email ? "Admin email is required." : "";
  const passwordError = submitted && !password ? "Password is required." : "";

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitted(true);

    if (!email || !password) {
      showToast("Please complete all required fields.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await login({ email: email.trim(), password });
      const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || "")
        .split(",")
        .map((item) => item.trim().toLowerCase())
        .filter(Boolean);

      const currentEmail = user?.email?.toLowerCase() || "";
      if (!adminEmails.includes(currentEmail)) {
        showToast("This account is not configured as admin.", "error");
        return;
      }

      showToast("Admin login successful.");
      navigate("/admin");
    } catch (error) {
      showToast(
        getFirebaseAuthErrorMessage(error, "Unable to login right now."),
        "error",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      sideText="Use your authorized admin email to manage approvals, moderation, and platform operations securely."
      sideTitle="Admin Control Panel"
      subtitle="Restricted access for MetroBridge administrators."
      tag="Administrator Access"
      title="Admin Login">
      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <InputField
          error={emailError}
          id="admin-email"
          label="Admin Email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter admin email"
          type="email"
          value={email}
        />

        <InputField
          error={passwordError}
          id="admin-password"
          label="Password"
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter admin password"
          type="password"
          value={password}
        />

        <Button
          className="w-full"
          disabled={isSubmitting}
          type="submit"
          variant="primary">
          {isSubmitting ? "Signing in..." : "Sign In as Admin"}
        </Button>
      </form>
      <div className="mt-5 rounded-card border border-border bg-slate-50 p-3">
        <p className="text-small font-medium text-primary">
          Admin Access Policy
        </p>
        <p className="mt-1 text-small text-neutral">
          Only emails listed in{" "}
          <span className="font-semibold">VITE_ADMIN_EMAILS</span> can access
          the admin dashboard.
        </p>
      </div>

      <p className="mt-4 text-small text-neutral">
        User login?{" "}
        <Link className="font-medium text-primary" to="/login">
          Go to standard login
        </Link>
      </p>
    </AuthShell>
  );
}
