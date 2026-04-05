import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MetricCard from "../components/dashboard/MetricCard";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import DataTable from "../components/ui/DataTable";
import FilterSelect from "../components/ui/FilterSelect";
import MotionReveal from "../components/ui/MotionReveal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faCalendarCheck,
  faCircleInfo,
  faComments,
  faCrown,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { fetchOverviewStats } from "../services/statsService";
import {
  fetchApprovedUsers,
  fetchPendingUsers,
  fetchUserDetails,
  reviewUser,
} from "../services/userAdminService";
import { useToast } from "../hooks/useToast";

const departmentFilterOptions = [
  { value: "", label: "All departments" },
  { value: "CSE", label: "CSE" },
  { value: "EEE", label: "EEE" },
  { value: "BBA", label: "BBA" },
  { value: "English", label: "English" },
  { value: "Law", label: "Law" },
  { value: "Architecture", label: "Architecture" },
];

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const getMemberProfilePath = (member) =>
    `/admin/connections/${member._id || member.id}`;

  const [stats, setStats] = useState(null);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [loadingDetailUserId, setLoadingDetailUserId] = useState("");
  const [pendingRoleFilter, setPendingRoleFilter] = useState("");
  const [approvedFilters, setApprovedFilters] = useState({
    q: "",
    department: "",
    role: "",
    bloodGroup: "",
  });

  const clearApprovedFilters = () => {
    setApprovedFilters({
      q: "",
      department: "",
      role: "",
      bloodGroup: "",
    });
  };

  useEffect(() => {
    const load = async () => {
      try {
        const [overview, pending, approved] = await Promise.all([
          fetchOverviewStats(),
          fetchPendingUsers(pendingRoleFilter || undefined),
          fetchApprovedUsers(),
        ]);
        setStats(overview);
        setPendingUsers(pending);
        setApprovedUsers(approved);
      } catch {
        setStats(null);
        setPendingUsers([]);
        setApprovedUsers([]);
      }
    };

    load();
  }, [pendingRoleFilter]);

  useEffect(() => {
    const loadApproved = async () => {
      try {
        const approved = await fetchApprovedUsers({
          q: approvedFilters.q || undefined,
          department: approvedFilters.department || undefined,
          role: approvedFilters.role || undefined,
          bloodGroup: approvedFilters.bloodGroup || undefined,
        });
        setApprovedUsers(approved);
      } catch {
        setApprovedUsers([]);
      }
    };

    loadApproved();
  }, [approvedFilters]);

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
    {
      key: "role",
      header: "Role",
      render: (row) => {
        const isMentor = row.role === "mentor";
        return (
          <Badge variant={isMentor ? "accent" : "default"}>
            {isMentor ? (
              <span className="inline-flex items-center gap-1">
                <FontAwesomeIcon icon={faCrown} /> Mentor
              </span>
            ) : (
              "Student"
            )}
          </Badge>
        );
      },
    },
    { key: "department", header: "Department" },
    { key: "universityId", header: "University ID" },
    {
      key: "phone",
      header: "Mobile",
      render: (row) => row.phone || "N/A",
    },
    {
      key: "bloodGroup",
      header: "Blood Group",
      render: (row) => row.bloodGroup || "N/A",
    },
    {
      key: "status",
      header: "Status",
      render: () => <Badge variant="warning">Pending</Badge>,
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          <Button
            className="hover:-translate-y-0.5"
            disabled={Boolean(loadingDetailUserId)}
            size="sm"
            variant="secondary"
            onClick={async () => {
              const userId = row._id || row.id;
              if (!userId) {
                showToast("User id not found for this row.", "error");
                return;
              }

              setLoadingDetailUserId(userId);
              try {
                const details = await fetchUserDetails(userId);
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
                setLoadingDetailUserId("");
              }
            }}>
            <span className="inline-flex items-center gap-1">
              <FontAwesomeIcon icon={faCircleInfo} />
              {loadingDetailUserId === (row._id || row.id)
                ? "Loading..."
                : "Details"}
            </span>
          </Button>
          <Button
            className="hover:-translate-y-0.5"
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
            className="hover:-translate-y-0.5"
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

  const approvedColumns = [
    {
      key: "fullName",
      header: "Name",
      render: (row) => {
        const memberId = row._id || row.id;

        if (!memberId) {
          return row.fullName;
        }

        return (
          <Link
            className="font-medium text-primary underline-offset-2 hover:underline"
            to={getMemberProfilePath(row)}>
            {row.fullName}
          </Link>
        );
      },
    },
    { key: "universityId", header: "ID" },
    {
      key: "role",
      header: "Role",
      render: (row) => {
        const isMentor = row.role === "mentor";
        return (
          <Badge variant={isMentor ? "accent" : "success"}>
            {isMentor ? (
              <span className="inline-flex items-center gap-1">
                <FontAwesomeIcon icon={faCrown} /> Mentor
              </span>
            ) : (
              "Student"
            )}
          </Badge>
        );
      },
    },
    { key: "department", header: "Department" },
    {
      key: "bloodGroup",
      header: "Blood Group",
      render: (row) => row.bloodGroup || "N/A",
    },
    {
      key: "status",
      header: "Status",
      render: () => <Badge variant="success">Approved</Badge>,
    },
  ];

  return (
    <div className="space-y-6">
      <MotionReveal y={14}>
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Card
              key={action.title}
              className="cursor-pointer transition-shadow hover:shadow-lg">
              <div className="mb-3 text-3xl text-primary">
                <FontAwesomeIcon icon={action.icon} />
              </div>
              <h4 className="mb-1 font-semibold">{action.title}</h4>
              <p className="mb-3 text-small text-neutral">
                {action.description}
              </p>
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
      </MotionReveal>

      <MotionReveal delay={80} y={16}>
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
      </MotionReveal>

      <MotionReveal delay={130} y={18}>
        <section className="border-t pt-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-h3">Pending Approvals</h2>
            <div className="w-full max-w-[220px]">
              <FilterSelect
                value={pendingRoleFilter}
                onChange={setPendingRoleFilter}
                options={[
                  { value: "", label: "All roles" },
                  { value: "student", label: "Student" },
                  { value: "mentor", label: "Mentor" },
                ]}
              />
            </div>
          </div>
          {pendingUsers.length > 0 ? (
            <div className="rounded-card border border-primary/15 bg-gradient-to-br from-white via-white to-primary/5 p-1 shadow-soft transition-all duration-300 hover:shadow-lg">
              <DataTable columns={columns} rows={pendingUsers} />
            </div>
          ) : (
            <Card className="py-8 text-center">
              <p className="text-neutral">No pending approvals</p>
            </Card>
          )}
        </section>
      </MotionReveal>

      <MotionReveal delay={180} y={20}>
        <section className="border-t pt-6">
          <h2 className="mb-4 text-h3">Approved Members</h2>
          <div className="mb-4 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
            <input
              className="rounded-card border border-border bg-white px-3 py-2 text-small"
              placeholder="Search by name or ID"
              value={approvedFilters.q}
              onChange={(event) =>
                setApprovedFilters((prev) => ({
                  ...prev,
                  q: event.target.value,
                }))
              }
            />
            <FilterSelect
              value={approvedFilters.department}
              onChange={(value) =>
                setApprovedFilters((prev) => ({
                  ...prev,
                  department: value,
                }))
              }
              options={departmentFilterOptions}
            />
            <FilterSelect
              value={approvedFilters.role}
              onChange={(value) =>
                setApprovedFilters((prev) => ({
                  ...prev,
                  role: value,
                }))
              }
              options={[
                { value: "", label: "All roles" },
                { value: "student", label: "Student" },
                { value: "mentor", label: "Mentor" },
              ]}
            />
            <FilterSelect
              value={approvedFilters.bloodGroup}
              onChange={(value) =>
                setApprovedFilters((prev) => ({
                  ...prev,
                  bloodGroup: value,
                }))
              }
              options={[
                { value: "", label: "All blood groups" },
                { value: "A+", label: "A+" },
                { value: "A-", label: "A-" },
                { value: "B+", label: "B+" },
                { value: "B-", label: "B-" },
                { value: "AB+", label: "AB+" },
                { value: "AB-", label: "AB-" },
                { value: "O+", label: "O+" },
                { value: "O-", label: "O-" },
              ]}
            />
            <Button
              variant="secondary"
              onClick={clearApprovedFilters}
              className="w-full"
              type="button">
              Clear Filters
            </Button>
          </div>
          {approvedUsers.length > 0 ? (
            <DataTable columns={approvedColumns} rows={approvedUsers} />
          ) : (
            <Card className="py-8 text-center">
              <p className="text-neutral">No approved members found</p>
            </Card>
          )}
        </section>
      </MotionReveal>

      {selectedUser ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/55 p-4 backdrop-blur-sm">
          <MotionReveal y={18}>
            <Card className="w-full max-w-3xl border-primary/20 bg-white shadow-2xl">
              <div className="mb-4 flex items-start justify-between gap-4 border-b border-border pb-4">
                <div>
                  <p className="text-small font-semibold uppercase tracking-wide text-primary">
                    Pending Approval Details
                  </p>
                  <h3 className="mt-1 text-h3">{selectedUser.fullName}</h3>
                  <p className="mt-1 text-small text-neutral">
                    {selectedUser.email || "No email provided"}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setSelectedUser(null)}>
                  Close
                </Button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <p className="text-small">
                  <strong>Role:</strong> {selectedUser.role || "N/A"}
                </p>
                <p className="text-small">
                  <strong>University ID:</strong>{" "}
                  {selectedUser.universityId || "N/A"}
                </p>
                <p className="text-small">
                  <strong>Mobile Number:</strong> {selectedUser.phone || "N/A"}
                </p>
                <p className="text-small">
                  <strong>Department:</strong>{" "}
                  {selectedUser.department || "N/A"}
                </p>
                <p className="text-small">
                  <strong>Batch:</strong> {selectedUser.batch || "N/A"}
                </p>
                <p className="text-small">
                  <strong>Blood Group:</strong>{" "}
                  {selectedUser.bloodGroup || "N/A"}
                </p>
                <p className="text-small">
                  <strong>Section:</strong> {selectedUser.section || "N/A"}
                </p>
                <p className="text-small">
                  <strong>Shift:</strong> {selectedUser.shift || "N/A"}
                </p>
              </div>

              <p className="mt-5 text-small text-neutral">
                Registration details load instantly here so admin can review
                before Approve/Ban.
              </p>
            </Card>
          </MotionReveal>
        </div>
      ) : null}
    </div>
  );
}
