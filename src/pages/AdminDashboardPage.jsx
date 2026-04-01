import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MetricCard from "../components/dashboard/MetricCard";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import DataTable from "../components/ui/DataTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faCalendarCheck,
  faComments,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { fetchOverviewStats } from "../services/statsService";
import {
  fetchPendingUsers,
  fetchUserDetails,
  reviewUser,
} from "../services/userAdminService";
import { useToast } from "../hooks/useToast";

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [stats, setStats] = useState(null);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [overview, pending] = await Promise.all([
          fetchOverviewStats(),
          fetchPendingUsers(),
        ]);
        setStats(overview);
        setPendingUsers(pending);
      } catch {
        setStats(null);
        setPendingUsers([]);
      }
    };

    load();
  }, []);

  const quickActions = [
    {
      icon: faComments,
      title: "Community Feed",
      description: "Moderate posts & content",
      onClick: () => navigate("/admin/feed"),
    },
    {
      icon: faEnvelope,
      title: "Messages",
      description: "Message management",
      onClick: () => navigate("/admin/messages"),
    },
    {
      icon: faCalendarCheck,
      title: "Appointments",
      description: "View all appointments",
      onClick: () => navigate("/admin/appointments"),
    },
    {
      icon: faBookOpen,
      title: "Documents",
      description: "Manage resources",
      onClick: () => navigate("/admin/documents"),
    },
  ];

  const columns = [
    { key: "fullName", header: "Name" },
    { key: "role", header: "Role" },
    { key: "department", header: "Department" },
    { key: "universityId", header: "University ID" },
    {
      key: "status",
      header: "Status",
      render: () => <Badge variant="warning">Pending</Badge>,
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <Button
            disabled={isLoadingDetails}
            size="sm"
            variant="secondary"
            onClick={async () => {
              setIsLoadingDetails(true);
              try {
                const details = await fetchUserDetails(row._id || row.id);
                if (details) {
                  setSelectedUser(details);
                } else {
                  showToast("Could not load user details.", "error");
                }
              } catch {
                showToast(
                  "Error fetching user details. Please try again.",
                  "error",
                );
              } finally {
                setIsLoadingDetails(false);
              }
            }}>
            {isLoadingDetails ? "Loading..." : "Details"}
          </Button>
          <Button
            disabled={isReviewing}
            size="sm"
            variant="primary"
            onClick={async () => {
              setIsReviewing(true);
              try {
                await reviewUser(
                  row._id || row.id,
                  "approve",
                  "Profile verified by admin",
                );
                setPendingUsers((prev) =>
                  prev.filter(
                    (item) => (item._id || item.id) !== (row._id || row.id),
                  ),
                );
                if (
                  (selectedUser?._id || selectedUser?.id) ===
                  (row._id || row.id)
                ) {
                  setSelectedUser(null);
                }
                showToast("User approved successfully.", "success");
              } catch {
                showToast("Failed to approve user.", "error");
              } finally {
                setIsReviewing(false);
              }
            }}>
            Approve
          </Button>
          <Button
            disabled={isReviewing}
            size="sm"
            variant="danger"
            onClick={async () => {
              setIsReviewing(true);
              try {
                await reviewUser(row._id || row.id, "ban", "Profile mismatch");
                setPendingUsers((prev) =>
                  prev.filter(
                    (item) => (item._id || item.id) !== (row._id || row.id),
                  ),
                );
                if (
                  (selectedUser?._id || selectedUser?.id) ===
                  (row._id || row.id)
                ) {
                  setSelectedUser(null);
                }
                showToast("User banned successfully.", "success");
              } catch {
                showToast("Failed to ban user.", "error");
              } finally {
                setIsReviewing(false);
              }
            }}>
            Ban
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action) => (
          <Card
            key={action.title}
            className="cursor-pointer transition-shadow hover:shadow-lg">
            <div className="mb-3 text-3xl text-primary">
              <FontAwesomeIcon icon={action.icon} />
            </div>
            <h4 className="mb-1 font-semibold">{action.title}</h4>
            <p className="mb-3 text-small text-neutral">{action.description}</p>
            <Button
              size="sm"
              variant="primary"
              onClick={action.onClick}
              className="w-full">
              Go
            </Button>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Pending approvals"
          value={String(stats?.approvals?.pending ?? 0)}
        />
        <MetricCard title="Total posts" value={String(stats?.posts ?? 0)} />
        <MetricCard
          title="Total active users"
          value={String(stats?.users ?? 0)}
        />
        <MetricCard
          title="Upcoming sessions"
          value={String(stats?.sessions?.upcoming ?? 0)}
        />
      </section>

      <section className="border-t pt-6">
        <h2 className="mb-4 text-h3">Pending Approvals</h2>
        {pendingUsers.length > 0 ? (
          <DataTable columns={columns} rows={pendingUsers} />
        ) : (
          <Card className="py-8 text-center">
            <p className="text-neutral">No pending approvals</p>
          </Card>
        )}
      </section>

      {selectedUser ? (
        <Card>
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h3 className="text-h3">Review {selectedUser.fullName}</h3>
              <p className="mt-1 text-small text-neutral">
                {selectedUser.email}
              </p>
            </div>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setSelectedUser(null)}>
              Close
            </Button>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <p className="text-small">
              <strong>Role:</strong> {selectedUser.role}
            </p>
            <p className="text-small">
              <strong>Department:</strong> {selectedUser.department || "N/A"}
            </p>
            <p className="text-small">
              <strong>University ID:</strong>{" "}
              {selectedUser.universityId || "N/A"}
            </p>
            <p className="text-small">
              <strong>Batch:</strong> {selectedUser.batch || "N/A"}
            </p>
            <p className="text-small">
              <strong>Section:</strong> {selectedUser.section || "N/A"}
            </p>
            <p className="text-small">
              <strong>Shift:</strong> {selectedUser.shift || "N/A"}
            </p>
            <p className="text-small">
              <strong>Phone:</strong> {selectedUser.phone || "N/A"}
            </p>
            <p className="text-small">
              <strong>Blood Group:</strong> {selectedUser.bloodGroup || "N/A"}
            </p>
            <p className="text-small">
              <strong>Guardian:</strong> {selectedUser.guardianName || "N/A"}
            </p>
            <p className="text-small">
              <strong>Guardian Phone:</strong>{" "}
              {selectedUser.guardianPhone || "N/A"}
            </p>
          </div>

          <p className="mt-4 text-small">
            <strong>Bio:</strong> {selectedUser.bio || "N/A"}
          </p>
        </Card>
      ) : null}
    </div>
  );
}
