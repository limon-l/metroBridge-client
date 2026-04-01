import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-white">
      {/* Main footer content */}
      <div className="content-container py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand section */}
          <div>
            <h3 className="text-lg font-bold text-primary">MetroBridge</h3>
            <p className="mt-2 text-small text-neutral">
              Connecting students with mentors for academic excellence and
              career success.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-primary">Platform</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href="#features"
                  className="text-small text-neutral transition-colors hover:text-primary">
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#reviews"
                  className="text-small text-neutral transition-colors hover:text-primary">
                  Reviews
                </a>
              </li>
              <li>
                <a
                  href="#team"
                  className="text-small text-neutral transition-colors hover:text-primary">
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Authentication */}
          <div>
            <h4 className="font-semibold text-primary">Access</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  to="/student-login"
                  className="text-small text-neutral transition-colors hover:text-primary">
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  to="/student-signup"
                  className="text-small text-neutral transition-colors hover:text-primary">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-small text-neutral transition-colors hover:text-primary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-primary">Support</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href="#"
                  className="text-small text-neutral transition-colors hover:text-primary">
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-small text-neutral transition-colors hover:text-primary">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-small text-neutral transition-colors hover:text-primary">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border bg-slate-50 py-6">
        <div className="content-container text-center">
          <p className="text-small text-neutral">
            © {currentYear} MetroBridge. All rights reserved. Metropolitan
            University.
          </p>
        </div>
      </div>
    </footer>
  );
}
