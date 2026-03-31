import { useNavigate } from "react-router-dom";
import MetricCard from "../components/dashboard/MetricCard";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import Skeleton from "../components/ui/Skeleton";
import { useAuth } from "../hooks/useAuth";

const sessions = [
  {
    id: 1,
    mentor: "Nafisa Rahman",
    course: "Data Structures",
    time: "Tomorrow, 4:00 PM",
  },
  {
    id: 2,
    mentor: "Sabbir Ahmed",
    course: "Circuit Theory",
    time: "Friday, 2:30 PM",
  },
];

const resources = [
  "Structured Programming Notes",
  "Career Guidance Handbook",
  "Semester Planner Template",
];

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const studentName =
    user?.displayName ||
    user?.email?.split("@")[0]?.replace(/[._-]+/g, " ") ||
    "Student";

  const quickActions = [
    {
      icon: "💬",
      title: "Community Feed",
      description: "Share and discuss with mentors",
      onClick: () => navigate("/student/feed"),
    },
    {
      icon: "📨",
      title: "Messages",
      description: "Chat with mentors",
      onClick: () => navigate("/student/messages"),
    },
    {
      icon: "📅",
      title: "Appointments",
      description: "Book sessions with mentors",
      onClick: () => navigate("/student/appointments"),
    },
    {
      icon: "📚",
      title: "Documents",
      description: "Download resources",
      onClick: () => navigate("/student/documents"),
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-primary to-primary-light text-white">
        <p className="text-small font-semibold uppercase tracking-wide text-white/80">
          Student Dashboard
        </p>
        <h2 className="text-white">Welcome back, {studentName}</h2>
        <p className="mt-2 text-white/90">
          Track your mentorship sessions and continue your academic growth.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="success">Active Student</Badge>
          <Badge>Shift: Day</Badge>
          <Badge>Section: C</Badge>
        </div>
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
        <MetricCard
          subtitle="Available for booking"
          title="Upcoming sessions"
          value="04"
        />
        <MetricCard
          subtitle="Matched to your courses"
          title="Recommended mentors"
          value="12"
        />
        <MetricCard
          subtitle="Download and review"
          title="Recent resources"
          value="08"
        />
        <MetricCard
          subtitle="Spend on sessions"
          title="Credit balance"
          value="220"
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h3>Upcoming sessions</h3>
          <div className="mt-4 space-y-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="rounded-card border border-border p-4">
                <p className="font-semibold text-primary">{session.course}</p>
                <p className="text-small text-neutral">
                  Mentor: {session.mentor}
                </p>
                <p className="text-small text-neutral">{session.time}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3>Recent resources</h3>
          <div className="mt-4 space-y-3">
            {resources.map((resource) => (
              <div
                key={resource}
                className="flex items-center justify-between rounded-card border border-border p-3">
                <p className="text-small text-gray-700">{resource}</p>
                <Badge variant="success">New</Badge>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <EmptyState
          description="You do not have pending mentor feedback right now."
          title="No pending reviews"
        />
      </section>
    </div>
  );
}
