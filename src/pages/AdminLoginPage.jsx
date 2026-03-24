import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import InputField from "../components/ui/InputField";
import { useToast } from "../hooks/useToast";

const DEMO_ADMIN = {
  email: "admin@metrobridge.edu.bd",
  password: "Admin@123",
};

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const emailError = submitted && !email ? "Admin email is required." : "";
  const passwordError = submitted && !password ? "Password is required." : "";

  const onSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);

    if (!email || !password) {
      showToast("Please complete all required fields.", "error");
      return;
    }

    if (email === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
      showToast("Admin login successful.");
      navigate("/admin");
      return;
    }

    showToast("Invalid admin credentials.", "error");
  };

  return (
    <div className="content-container flex min-h-[calc(100vh-160px)] items-center justify-center py-10">
      <Card className="w-full max-w-md">
        <h2>Admin Login</h2>
        <p className="mt-2 text-small text-neutral">
          Restricted access for MetroBridge administrators.
        </p>

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

          <Button className="w-full" type="submit" variant="primary">
            Sign In as Admin
          </Button>
        </form>

        <div className="mt-5 rounded-card border border-border bg-slate-50 p-3">
          <p className="text-small font-medium text-primary">
            Demo Admin Credentials
          </p>
          <p className="mt-1 text-small text-neutral">
            Email: {DEMO_ADMIN.email}
          </p>
          <p className="text-small text-neutral">
            Password: {DEMO_ADMIN.password}
          </p>
        </div>

        <p className="mt-4 text-small text-neutral">
          User login?{" "}
          <Link className="font-medium text-primary" to="/login">
            Go to standard login
          </Link>
        </p>
      </Card>
    </div>
  );
}
