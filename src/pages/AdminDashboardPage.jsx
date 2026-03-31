import { useNavigate } from "react-router-dom";
import MetricCard from "../components/dashboard/MetricCard";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import DataTable from "../components/ui/DataTable";

const approvals = [
  {
    id: 1,
    name: "Moumita Akter",
    role: "Student",
    department: "CSE",
    status: "Pending",
  },
  {
    id: 2,
    name: "Sakib Hasan",
    role: "Mentor",
    department: "EEE",
    status: "Pending",
  },
];

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  const quickActions = [
    {
      icon: "💬",
      title: "Community Feed",
      description: "Moderate posts & content",
      onClick: () => navigate("/admin/feed"),
    },
    {
      icon: "📨",
      title: "Messages",
      description: "Message management",
      onClick: () => navigate("/admin/messages"),
    },
    {
      icon: "📅",
      title: "Appointments",
      description: "View all appointments",
      onClick: () => navigate("/admin/appointments"),
    },
    {
      icon: "📚",
      title: "Documents",
      description: "Manage resources",
      onClick: () => navigate("/admin/documents"),
    },
  ];

  const columns = [
    { key: "name", header: "Name" },
    { key: "role", header: "Role" },
    { key: "department", header: "Department" },
    {
      key: "status",
      header: "Status",
      render: () => <Badge variant="warning">Pending</Badge>,
    },
    {
      key: "actions",
      header: "Actions",
      render: () => (
        <div className="flex gap-2">
          <Button size="sm" variant="primary">
            Approve
          </Button>
          <Button size="sm" variant="danger">
            Ban
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action) => (
          <Card
            key={action.title}
            className="cursor-pointer hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-3">{action.icon}</div>
            <h4 className="font-semibold mb-1">{action.title}</h4>
            <p className="text-small text-neutral mb-3">{action.description}</p>
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
        <MetricCard title="Pending approvals" value="24" />
        <MetricCard title="Reported users/content" value="06" />
        <MetricCard title="Total active users" value="1,245" />
        <MetricCard title="Sessions this month" value="432" />
      </section>

      <DataTable columns={columns} rows={approvals} />
    </div>
  );
}
