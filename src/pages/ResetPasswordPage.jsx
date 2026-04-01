import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AuthShell from "../components/auth/AuthShell";
import Button from "../components/ui/Button";
import InputField from "../components/ui/InputField";
import { submitPasswordReset } from "../services/authService";
import { useToast } from "../hooks/useToast";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();
  const tokenFromQuery = useMemo(
    () => searchParams.get("token") || "",
    [searchParams],
  );

  const [token, setToken] = useState(tokenFromQuery);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!token.trim() || !password || !confirmPassword) {
      showToast("Please complete all required fields.", "error");
      return;
    }

    if (password.length < 6) {
      showToast("Password must be at least 6 characters.", "error");
      return;
    }

    if (password !== confirmPassword) {
      showToast("Passwords do not match.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitPasswordReset(token.trim(), password);
      showToast("Password reset successful. Please login.", "success");
      navigate("/student-login");
    } catch (error) {
      showToast(error?.message || "Could not reset password.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Reset Password"
      subtitle="Set a new password using your reset token."
      tag="Account Recovery"
      sideTitle="Finish Reset"
      sideText="Use the token from forgot password request and set a new secure password.">
      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <InputField
          id="reset-token"
          label="Reset Token"
          value={token}
          onChange={(event) => setToken(event.target.value)}
          placeholder="Paste reset token"
          required
        />
        <InputField
          id="reset-password"
          label="New Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter new password"
          required
        />
        <InputField
          id="reset-confirm-password"
          label="Confirm New Password"
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="Re-enter new password"
          required
        />

        <Button
          className="w-full"
          disabled={isSubmitting}
          type="submit"
          variant="primary">
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </Button>
      </form>

      <p className="mt-4 text-small text-neutral">
        Back to login?{" "}
        <Link className="font-medium text-primary" to="/student-login">
          Student login
        </Link>
      </p>
    </AuthShell>
  );
}
