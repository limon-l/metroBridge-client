import { Outlet } from "react-router-dom";
import ProfessionalNavbar from "../components/navigation/ProfessionalNavbar";
import ScrollToTopButton from "../components/ui/ScrollToTopButton";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-surface">
      <ProfessionalNavbar />
      <main>
        <Outlet />
      </main>
      <ScrollToTopButton />
      <footer className="border-t border-border bg-white py-8">
        <div className="content-container flex flex-col items-center justify-between gap-2 text-small text-neutral sm:flex-row">
          <p>
            © {new Date().getFullYear()} MetroBridge – Metropolitan University,
            Sylhet
          </p>
          <p>Secure mentorship and academic collaboration platform</p>
        </div>
      </footer>
    </div>
  );
}
