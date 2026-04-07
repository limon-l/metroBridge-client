import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import SidebarNav from "../components/navigation/SidebarNav";
import TopNavbar from "../components/navigation/TopNavbar";

export default function DashboardLayout({ role }) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleCloseMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-surface lg:grid lg:grid-cols-dashboard">
      <div className="hidden lg:block">
        <SidebarNav role={role} className="sticky top-0 h-screen" />
      </div>
      <div className="min-w-0">
        <TopNavbar
          role={role}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />
        <main className="content-container py-6">
          <div className="mb-4 rounded-card bg-primary px-4 py-2 text-small font-medium text-white lg:hidden">
            Use the menu icon to open dashboard navigation.
          </div>
          <div key={location.pathname} className="fade-in">
            <Outlet />
          </div>
        </main>
      </div>

      {isMobileMenuOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/45"
            onClick={handleCloseMobileMenu}
            aria-label="Close navigation menu"
          />
          <div className="relative h-full w-[260px] max-w-[85vw]">
            <SidebarNav
              role={role}
              onNavigate={handleCloseMobileMenu}
              className="h-screen"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
