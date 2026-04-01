import { Link, NavLink } from "react-router-dom";
import Button from "../ui/Button";

export default function PublicNavbar() {
  const linkClass = ({ isActive }) =>
    `text-small font-medium transition ${isActive ? "text-primary" : "text-neutral hover:text-primary"}`;

  return (
    <header className="sticky top-0 z-30 border-b border-white/20 bg-primary/95 backdrop-blur">
      <div className="content-container flex h-16 items-center justify-between">
        <Link className="text-h3 font-bold text-white" to="/">
          MetroBridge
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <NavLink className={linkClass} to="/">
            Home
          </NavLink>
          <a
            className="text-small font-medium text-neutral/90 hover:text-white"
            href="#features">
            Features
          </a>
          <a
            className="text-small font-medium text-neutral/90 hover:text-white"
            href="#benefits">
            Benefits
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/student-login">
            <Button size="sm" variant="secondary">
              Login
            </Button>
          </Link>
          <Link to="/student-signup">
            <Button size="sm" variant="cta">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
