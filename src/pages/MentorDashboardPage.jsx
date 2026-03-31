import { useNavigate } from "react-router-dom";
import MetricCard from "../components/dashboard/MetricCard";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

const sessionRequests = [
  {
    student: "Rifat Islam",
    topic: "React hooks and state",
    date: "Tue, 5:30 PM",
  },
  { student: "Mili Das", topic: "Signals and systems", date: "Wed, 3:15 PM" },
];

export default function MentorDashboardPage() {
  const navigate = useNavigate();

  const quickActions = [
    {
      icon: "💬",
      title: "Community Feed",
      description: "Share insights with students",
      onClick: () => navigate("/mentor/feed"),
    },
    {
      icon: "📨",
      title: "Messages",
      description: "Chat with students",
      onClick: () => navigate("/mentor/messages"),
    },
    {
      icon: "📅",
      title: "Appointments",
      description: "Manage session requests",
      onClick: () => navigate("/mentor/appointments"),
    },
    {
      icon: "📚",
      title: "Documents",
      description: "Upload materials",
      onClick: () => navigate("/mentor/documents"),
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <h2>Mentor workspace</h2>
        <p className="mt-2">
          Manage session requests, resources, and performance feedback.
        </p>
      </Card>

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
        <MetricCard title="Session requests" value="09" />
        <MetricCard title="Uploaded content" value="17" />
        <MetricCard title="Ratings/reviews" value="4.8 / 5" />
        <MetricCard title="Credit earnings" value="1,260" />
      </section>

      <Card>
        <h3>Pending requests</h3>
        <div className="mt-4 space-y-3">
          {sessionRequests.map((request) => (
            <div
              key={request.student}
              className="flex flex-col gap-3 rounded-card border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-primary">{request.student}</p>
                <p className="text-small text-neutral">{request.topic}</p>
                <p className="text-small text-neutral">{request.date}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary">
                  Decline
                </Button>
                <Button size="sm" variant="primary">
                  Approve
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5">
          <Badge variant="success">Response rate: 96%</Badge>
        </div>
      </Card>
    </div>
  );
}
