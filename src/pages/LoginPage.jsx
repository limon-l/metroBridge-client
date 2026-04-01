import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "../components/auth/AuthShell";
import Button from "../components/ui/Button";
import InputField from "../components/ui/InputField";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();

  const emailError = submitted && !email ? "Email is required." : "";
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
      showToast("Login successful.");

      if (user?.role === "admin") {
        navigate("/admin");
        return;
      }
      if (user?.role === "mentor") {
        navigate("/mentor");
        return;
      }
      navigate("/student");
    } catch (error) {
      showToast(error?.message || "Unable to login right now.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      sideText="Sign in to continue your mentorship journey, access your dashboard, and collaborate securely with mentors and peers."
      sideTitle="Welcome Back"
      subtitle="Login only after admin approval."
      tag="MetroBridge Access"
      title="Sign In">
      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <InputField
          error={emailError}
          id="email"
          label="Email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter your university email"
          type="email"
          value={email}
        />
        <InputField
          error={passwordError}
          id="password"
          label="Password"
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter your password"
          type="password"
          value={password}
        />
        <Button
          className="w-full"
          disabled={isSubmitting}
          type="submit"
          variant="primary">
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Button>
      </form>
      <p className="mt-4 text-small text-neutral">
        New here?{" "}
        <Link className="font-medium text-primary" to="/signup">
          Create an account
        </Link>
      </p>
      <p className="mt-2 text-small text-neutral">
        Admin access?{" "}
        <Link className="font-medium text-primary" to="/admin-login">
          Admin login
        </Link>
      </p>
    </AuthShell>
  );
}
