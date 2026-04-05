import NotificationTray from "./NotificationTray";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";

const roleLabel = {
  student: "Student",
  mentor: "Mentor",
  admin: "Admin",
};

export default function TopNavbar({ role }) {
  const { logout } = useAuth();
  const { showToast } = useToast();

  const onLogout = async () => {
    try {
      await logout();
      showToast("Logged out successfully.");
    } catch {
      showToast("Unable to logout right now.", "error");
    }
  };

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-small font-medium text-neutral">
            Academic Collaboration Platform
          </p>
          <p className="text-body font-semibold text-primary">
            Welcome to MetroBridge
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="accent">{roleLabel[role]}</Badge>
          <NotificationTray />
          <Button onClick={onLogout} size="sm" variant="danger">
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
