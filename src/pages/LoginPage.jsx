import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import InputField from "../components/ui/InputField";
import { useToast } from "../hooks/useToast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { showToast } = useToast();

  const emailError = submitted && !email ? "Email is required." : "";
  const passwordError = submitted && !password ? "Password is required." : "";

  const onSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);

    if (!email || !password) {
      showToast("Please complete all required fields.", "error");
      return;
    }

    showToast("Login request submitted successfully.");
  };

  return (
    <div className="content-container flex min-h-[calc(100vh-160px)] items-center justify-center py-10">
      <Card className="w-full max-w-md">
        <h2>Login</h2>
        <p className="mt-2 text-small text-neutral">
          Login only after admin approval.
        </p>
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
          <Button className="w-full" type="submit" variant="primary">
            Sign In
          </Button>
        </form>
        <p className="mt-4 text-small text-neutral">
          New here?{" "}
          <Link className="font-medium text-primary" to="/signup">
            Create an account
          </Link>
        </p>
      </Card>
    </div>
  );
}
