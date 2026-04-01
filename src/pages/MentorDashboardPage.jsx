import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MetricCard from "../components/dashboard/MetricCard";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faCalendarCheck,
  faComments,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { fetchOverviewStats } from "../services/statsService";
import {
  fetchAppointments,
  updateAppointmentStatus,
} from "../services/appointmentService";

export default function MentorDashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [overview, appointments] = await Promise.all([
          fetchOverviewStats(),
          fetchAppointments({ status: "pending", limit: 10 }),
        ]);

        setStats(overview);
        setPendingRequests(appointments);
      } catch {
        setStats(null);
        setPendingRequests([]);
      }
    };

    load();
  }, []);

  const handleDecision = async (id, status) => {
    try {
      const updated = await updateAppointmentStatus(id, { status });
      setPendingRequests((prev) =>
        prev.filter((item) => item._id !== updated._id),
      );
    } catch {
      // keep existing UI state when action fails
    }
  };

  const quickActions = [
    {
      icon: faComments,
      title: "Community Feed",
      description: "Share insights with students",
      onClick: () => navigate("/mentor/feed"),
    },
    {
      icon: faEnvelope,
      title: "Messages",
      description: "Chat with students",
      onClick: () => navigate("/mentor/messages"),
    },
    {
      icon: faCalendarCheck,
      title: "Appointments",
      description: "Manage session requests",
      onClick: () => navigate("/mentor/appointments"),
    },
    {
      icon: faBookOpen,
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
            <div className="text-3xl mb-3 text-primary">
              <FontAwesomeIcon icon={action.icon} />
            </div>
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
          title="Session requests"
          value={String(stats?.sessions?.pending ?? 0)}
        />
        <MetricCard
          title="Uploaded content"
          value={String(stats?.documents ?? 0)}
        />
        <MetricCard title="Messages" value={String(stats?.messages ?? 0)} />
        <MetricCard title="Active users" value={String(stats?.users ?? 0)} />
      </section>

      <Card>
        <h3>Pending requests</h3>
        <div className="mt-4 space-y-3">
          {pendingRequests.length === 0 ? (
            <p className="text-small text-neutral">No pending requests.</p>
          ) : (
            pendingRequests.map((request) => (
              <div
                key={request._id}
                className="flex flex-col gap-3 rounded-card border border-border p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-primary">
                    {request.student?.fullName}
                  </p>
                  <p className="text-small text-neutral">{request.topic}</p>
                  <p className="text-small text-neutral">
                    {new Date(request.scheduledAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleDecision(request._id, "cancelled")}>
                    Decline
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleDecision(request._id, "confirmed")}>
                    Approve
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="mt-5">
          <Badge variant="success">Response rate: 96%</Badge>
        </div>
      </Card>
    </div>
  );
}
