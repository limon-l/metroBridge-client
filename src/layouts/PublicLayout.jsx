import { Outlet, useLocation } from "react-router-dom";
import ProfessionalNavbar from "../components/navigation/ProfessionalNavbar";
import Footer from "../components/sections/Footer";
import ScrollToTopButton from "../components/ui/ScrollToTopButton";

export default function PublicLayout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <ProfessionalNavbar />
      <main className="flex-1">
        <div key={location.pathname} className="fade-in">
          <Outlet />
        </div>
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
}
