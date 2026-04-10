import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

const roleLinks = {
  student: [
    { label: "Dashboard", to: "/student" },
    { label: "Community Feed", to: "/student/feed" },
    { label: "Appointments", to: "/student/appointments" },
    { label: "Documents", to: "/student/documents" },
    { label: "Mentor Search", to: "/student/mentors" },
    { label: "Connections", to: "/student/connections" },
    { label: "Messages", to: "/student/messages" },
    { label: "Booking", to: "/student/booking" },
    { label: "Video Call", to: "/student/video-call" },
    { label: "Course Library", to: "/student/library" },
    { label: "Virtual Classroom", to: "/student/classroom" },
    { label: "Profile", to: "/student/profile" },
  ],
  mentor: [
    { label: "Dashboard", to: "/mentor" },
    { label: "Community Feed", to: "/mentor/feed" },
    { label: "Connections", to: "/mentor/connections" },
    { label: "Messages", to: "/mentor/messages" },
    { label: "Appointments", to: "/mentor/appointments" },
    { label: "Documents", to: "/mentor/documents" },
    { label: "Virtual Classroom", to: "/mentor/classroom" },
    { label: "Profile", to: "/mentor/profile" },
  ],
  admin: [
    { label: "Dashboard", to: "/admin" },
    { label: "Community Feed", to: "/admin/feed" },
    { label: "Connections", to: "/admin/connections" },
    { label: "Messages", to: "/admin/messages" },
    { label: "Appointments", to: "/admin/appointments" },
    { label: "Documents", to: "/admin/documents" },
    { label: "Moderation", to: "/admin/moderation" },
    { label: "Profile", to: "/admin/profile" },
  ],
};

export default function SidebarNav({ role, className = "", onNavigate }) {
  const links = roleLinks[role] ?? [];
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const getUnread = () => {
      const value = Number(localStorage.getItem(`messagesUnread:${role}`) || 0);
      setUnreadCount(Number.isFinite(value) ? value : 0);
    };

    getUnread();
    const intervalId = setInterval(getUnread, 1200);

    return () => clearInterval(intervalId);
  }, [role]);

  const baseClassName =
    "h-full w-[260px] overflow-y-auto bg-primary px-4 py-6 text-white";

  return (
    <aside className={`${baseClassName} ${className}`.trim()}>
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
            to={link.to}
            onClick={() => onNavigate?.()}>
            <span className="flex items-center justify-between gap-2">
              <span>{link.label}</span>
              {link.label === "Messages" && unreadCount > 0 && (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white animate-pulse">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
