import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MetricCard from "../components/dashboard/MetricCard";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import Skeleton from "../components/ui/Skeleton";
import MotionReveal from "../components/ui/MotionReveal";
import { useAuth } from "../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faCalendarCheck,
  faComments,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { fetchOverviewStats } from "../services/statsService";
import { fetchAppointments } from "../services/appointmentService";
import { fetchDocuments } from "../services/documentService";

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [recentResources, setRecentResources] = useState([]);

  const studentName =
    user?.displayName ||
    user?.email?.split("@")[0]?.replace(/[._-]+/g, " ") ||
    "Student";

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [overview, appointments, documents] = await Promise.all([
          fetchOverviewStats(),
          fetchAppointments({ limit: 4 }),
          fetchDocuments({ limit: 3 }),
        ]);

        setStats(overview);

        const sortedAppointments = [...appointments]
          .filter((item) => new Date(item.scheduledAt) >= new Date())
          .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));
        setUpcomingSessions(sortedAppointments.slice(0, 3));

        setRecentResources(documents.slice(0, 3));
      } catch {
        setStats(null);
        setUpcomingSessions([]);
        setRecentResources([]);
      }
    };

    loadDashboard();
  }, []);

  const quickActions = [
    {
      icon: faComments,
      title: "Community Feed",
      description: "Share and discuss with mentors",
      onClick: () => navigate("/student/feed"),
    },
    {
      icon: faCalendarCheck,
      title: "Appointments",
      description: "Book sessions with mentors",
      onClick: () => navigate("/student/appointments"),
    },
    {
      icon: faBookOpen,
      title: "Documents",
      description: "Download resources",
      onClick: () => navigate("/student/documents"),
    },
    {
      icon: faUserPlus,
      title: "Connections",
      description: "Connect with students and mentors",
      onClick: () => navigate("/student/connections"),
    },
  ];

  return (
    <div className="space-y-6">
      <MotionReveal y={14}>
        <Card className="banner-surface bg-gradient-to-r from-primary via-primary-light to-accent text-white">
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
      </MotionReveal>

      {/* Quick Actions */}
      <MotionReveal delay={80} y={16}>
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Card
              key={action.title}
              className="cursor-pointer hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-3 text-primary">
                <FontAwesomeIcon icon={action.icon} />
              </div>
              <h4 className="font-semibold mb-1">{action.title}</h4>
              <p className="text-small text-neutral mb-3">
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

      <MotionReveal delay={130} y={18}>
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            subtitle="Available for booking"
            title="Upcoming sessions"
            value={String(stats?.sessions?.upcoming ?? 0).padStart(2, "0")}
          />
          <MetricCard
            subtitle="Matched to your courses"
            title="Recommended mentors"
            value={String(stats?.mentors ?? 0).padStart(2, "0")}
          />
          <MetricCard
            subtitle="Download and review"
            title="Recent resources"
            value={String(stats?.documents ?? 0).padStart(2, "0")}
          />
          <MetricCard
            subtitle="Spend on sessions"
            title="Messages"
            value={String(stats?.messages ?? 0).padStart(2, "0")}
          />
        </section>
      </MotionReveal>

      <MotionReveal delay={170} y={20}>
        <section className="grid gap-4 lg:grid-cols-2">
          <Card>
            <h3>Upcoming sessions</h3>
            <div className="mt-4 space-y-3">
              {upcomingSessions.length === 0 ? (
                <p className="text-small text-neutral">
                  No upcoming sessions found.
                </p>
              ) : (
                upcomingSessions.map((session) => (
                  <div
                    key={session._id}
                    className="rounded-card border border-border p-4">
                    <p className="font-semibold text-primary">
                      {session.topic}
                    </p>
                    <p className="text-small text-neutral">
                      Mentor: {session.mentor?.fullName || "TBD"}
                    </p>
                    <p className="text-small text-neutral">
                      {new Date(session.scheduledAt).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card>
            <h3>Recent resources</h3>
            <div className="mt-4 space-y-3">
              {recentResources.length === 0 ? (
                <p className="text-small text-neutral">
                  No resources uploaded yet.
                </p>
              ) : (
                recentResources.map((resource) => (
                  <div
                    key={resource.id}
                    className="flex items-center justify-between rounded-card border border-border p-3">
                    <p className="text-small text-gray-700">{resource.title}</p>
                    <Badge variant="success">New</Badge>
                  </div>
                ))
              )}
            </div>
          </Card>
        </section>
      </MotionReveal>

      <MotionReveal delay={220} y={22}>
        <section className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <EmptyState
            description="You do not have pending mentor feedback right now."
            title="No pending reviews"
          />
        </section>
      </MotionReveal>
    </div>
  );
}
