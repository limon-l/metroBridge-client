import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "../components/auth/AuthShell";
import Button from "../components/ui/Button";
import InputField from "../components/ui/InputField";
import { requestPasswordReset } from "../services/authService";
import { useToast } from "../hooks/useToast";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!email.trim()) {
      showToast("Please enter your email.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await requestPasswordReset(email.trim());

      if (data?.resetToken) {
        showToast("Reset token generated. Continue to reset password page.");
        navigate(`/reset-password?token=${data.resetToken}`);
      } else {
        showToast("If your email exists, reset instructions were sent.");
      }
    } catch (error) {
      showToast(error?.message || "Could not process request.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Forgot Password"
      subtitle="Enter your account email to start password reset."
      tag="Account Recovery"
      sideTitle="Secure Reset"
      sideText="For this local setup, a reset token is generated and forwarded automatically.">
      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <InputField
          id="forgot-email"
          label="Account Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter your email"
          required
        />
        <Button
          className="w-full"
          disabled={isSubmitting}
          type="submit"
          variant="primary">
          {isSubmitting ? "Processing..." : "Send Reset Request"}
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
