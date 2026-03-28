import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="content-container py-12">
        <div className="rounded-card border border-border bg-white p-6 text-small text-neutral shadow-soft">
          Verifying your session...
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate replace to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === "admin") return <Navigate replace to="/admin" />;
    if (role === "mentor") return <Navigate replace to="/mentor" />;
    return <Navigate replace to="/student" />;
  }

  return children;
}
