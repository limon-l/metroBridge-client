import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "../components/auth/AuthShell";
import Button from "../components/ui/Button";
import InputField from "../components/ui/InputField";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";

export default function StudentLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, logout } = useAuth();
  const { showToast } = useToast();

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!email || !password) {
      showToast("Please complete all required fields.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await login({ email: email.trim(), password });
      if (user.role !== "student") {
        await logout();
        showToast("Use mentor/admin login panel for this account.", "error");
        return;
      }
      showToast("Student login successful.");
      navigate("/student");
    } catch (error) {
      showToast(error?.message || "Unable to login right now.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Student Login"
      subtitle="Login only after admin approval."
      tag="Student Access"
      sideTitle="Welcome Student"
      sideText="Access mentors, classes, shared documents, and student activities.">
      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <InputField
          id="student-email"
          label="Student Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          placeholder="Enter your email"
        />
        <InputField
          id="student-password"
          label="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          placeholder="Enter your password"
        />
        <Button
          className="w-full"
          disabled={isSubmitting}
          type="submit"
          variant="primary">
          {isSubmitting ? "Signing in..." : "Sign In as Student"}
        </Button>
        <p className="text-small text-neutral">
          Forgot password?{" "}
          <Link className="font-medium text-primary" to="/forgot-password">
            Reset it
          </Link>
        </p>
      </form>
      <p className="mt-4 text-small text-neutral">
        New student?{" "}
        <Link className="font-medium text-primary" to="/student-signup">
          Register here
        </Link>
      </p>
      <p className="mt-2 text-small text-neutral">
        Mentor?{" "}
        <Link className="font-medium text-primary" to="/mentor-login">
          Mentor login
        </Link>
      </p>
    </AuthShell>
  );
}
