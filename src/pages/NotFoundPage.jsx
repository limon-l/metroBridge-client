import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

export default function NotFoundPage() {
  return (
    <div className="content-container flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <h1>Page not found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/">
        <Button variant="primary">Go to Home</Button>
      </Link>
    </div>
  );
}
