import { NavLink } from "react-router-dom";

const roleLinks = {
  student: [
    { label: "Dashboard", to: "/student" },
    { label: "Community Feed", to: "/student/feed" },
    { label: "Messages", to: "/student/messages" },
    { label: "Appointments", to: "/student/appointments" },
    { label: "Documents", to: "/student/documents" },
    { label: "Mentor Search", to: "/student/mentors" },
    { label: "Booking", to: "/student/booking" },
    { label: "Video Call", to: "/student/video-call" },
    { label: "Course Library", to: "/student/library" },
    { label: "Profile", to: "/student/profile" },
    { label: "Moderation", to: "/student/moderation" },
  ],
  mentor: [
    { label: "Dashboard", to: "/mentor" },
    { label: "Community Feed", to: "/mentor/feed" },
    { label: "Messages", to: "/mentor/messages" },
    { label: "Appointments", to: "/mentor/appointments" },
    { label: "Documents", to: "/mentor/documents" },
    { label: "Profile", to: "/mentor/profile" },
    { label: "Moderation", to: "/mentor/moderation" },
  ],
  admin: [
    { label: "Dashboard", to: "/admin" },
    { label: "Community Feed", to: "/admin/feed" },
    { label: "Messages", to: "/admin/messages" },
    { label: "Appointments", to: "/admin/appointments" },
    { label: "Documents", to: "/admin/documents" },
    { label: "Moderation", to: "/admin/moderation" },
    { label: "Profile", to: "/admin/profile" },
  ],
};

export default function SidebarNav({ role }) {
  const links = roleLinks[role] ?? [];

  return (
    <aside className="fixed left-0 top-0 z-30 h-screen w-[260px] bg-primary px-4 py-6 text-white overflow-y-auto lg:sticky">
      <h2 className="px-2 text-h3 text-white">MetroBridge</h2>
      <p className="px-2 pt-1 text-small text-slate-300">
        Metropolitan University
      </p>
      <nav className="mt-8 flex flex-col gap-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            className={({ isActive }) =>
              `rounded-card border-l-4 px-3 py-2.5 text-small font-medium transition ${
                isActive
                  ? "border-accent bg-primary-light text-white"
                  : "border-transparent text-slate-200 hover:bg-primary-light hover:text-white"
              }`
            }
            end={link.to === `/${role}`}
            to={link.to}>
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
