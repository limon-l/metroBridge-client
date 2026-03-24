import { Outlet } from "react-router-dom";
import SidebarNav from "../components/navigation/SidebarNav";
import TopNavbar from "../components/navigation/TopNavbar";

export default function DashboardLayout({ role }) {
  return (
    <div className="min-h-screen bg-surface lg:grid lg:grid-cols-dashboard">
      <div className="hidden lg:block">
        <SidebarNav role={role} />
      </div>
      <div className="min-w-0">
        <TopNavbar role={role} />
        <main className="content-container py-6">
          <div className="mb-4 rounded-card bg-primary px-4 py-2 text-small font-medium text-white lg:hidden">
            Sidebar is collapsed on mobile for touch-friendly navigation.
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
