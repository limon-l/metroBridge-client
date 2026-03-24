import MetricCard from "../components/dashboard/MetricCard";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
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
