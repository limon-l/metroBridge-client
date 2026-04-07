import NotificationTray from "./NotificationTray";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

const roleLabel = {
  student: "Student",
  mentor: "Mentor",
  admin: "Admin",
};

export default function TopNavbar({ role, onOpenMobileMenu }) {
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
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => onOpenMobileMenu?.()}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-primary lg:hidden"
            aria-label="Open navigation menu">
            <FontAwesomeIcon icon={faBars} />
          </button>
          <div>
            <p className="hidden text-small font-medium text-neutral sm:block">
              Academic Collaboration Platform
            </p>
            <p className="text-body font-semibold text-primary">
              Welcome to MetroBridge
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden sm:inline-flex">
            <Badge variant="accent">{roleLabel[role]}</Badge>
          </span>
          <NotificationTray />
          <Button
            onClick={onLogout}
            size="sm"
            variant="danger"
            className="px-3 sm:px-4">
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
