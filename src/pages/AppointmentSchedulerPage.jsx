import { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Modal from "../components/ui/Modal";
import EmptyState from "../components/ui/EmptyState";
import MotionReveal from "../components/ui/MotionReveal";
import { useAuth } from "../hooks/useAuth";
import { fetchMentors } from "../services/mentorService";
import {
  createAppointment,
  fetchAppointments,
  updateAppointmentStatus,
} from "../services/appointmentService";

export default function AppointmentSchedulerPage({ role }) {
  const [appointments, setAppointments] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    date: "",
    time: "",
    topic: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [mentorsResponse, appointmentsResponse] = await Promise.all([
          fetchMentors(),
          fetchAppointments({ limit: 100 }),
        ]);

        setMentors(
          (mentorsResponse || []).map((mentor) => ({
            id: mentor._id || mentor.id,
            name: mentor.fullName,
            expertise:
              (mentor.expertise || []).join(", ") || "General mentorship",
            availability: ["Select date and time in booking form"],
            rating: mentor.rating || 0,
          })),
        );
        setAppointments(appointmentsResponse || []);
      } catch {
        setMentors([]);
        setAppointments([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!bookingDetails.date || !bookingDetails.time || !bookingDetails.topic) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const scheduledAt = new Date(
        `${bookingDetails.date}T${bookingDetails.time}:00`,
      ).toISOString();

      const created = await createAppointment({
        mentorId: selectedMentor.id,
        topic: bookingDetails.topic,
        scheduledAt,
        durationMinutes: 60,
      });

      setAppointments((prev) => [created, ...prev]);
    } catch {
      alert("Unable to create appointment right now.");
      return;
    }

    setIsBookingModalOpen(false);
    setSelectedMentor(null);
    setBookingDetails({ date: "", time: "", topic: "" });

    alert("Appointment request sent! Awaiting mentor approval.");
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (window.confirm("Cancel this appointment?")) {
      try {
        const updated = await updateAppointmentStatus(appointmentId, {
          status: "cancelled",
        });
        setAppointments((prev) =>
          prev.map((item) => (item._id === updated._id ? updated : item)),
        );
      } catch {
        alert("Unable to cancel appointment.");
      }
    }
  };

  const handleApproveAppointment = async (appointmentId) => {
    try {
      const updated = await updateAppointmentStatus(appointmentId, {
        status: "confirmed",
      });
      setAppointments((prev) =>
        prev.map((item) => (item._id === updated._id ? updated : item)),
      );
    } catch {
      alert("Unable to approve appointment.");
    }
  };

  const getAppointmentsForRole = () => {
    return appointments;
  };

  const userAppointments = getAppointmentsForRole();

  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return <Badge variant="success">Confirmed</Badge>;
      case "pending":
        return <Badge variant="warning">Pending</Badge>;
      case "completed":
        return <Badge variant="secondary">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDateTime = (date, time) => {
    if (date && time)
      return `${new Date(date).toLocaleDateString()} at ${time}`;
    return new Date(date).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <MotionReveal>
        <Card className="bg-gradient-to-r from-primary to-primary-light text-white">
          <p className="text-small font-semibold uppercase tracking-wide text-white/80">
            Appointments & Scheduling
          </p>
          <h2 className="text-white">
            {role === "student" ? "Book a Session" : "Appointment Management"}
          </h2>
          <p className="mt-2 text-white/90">
            {role === "student"
              ? "Schedule 1-on-1 sessions with experienced mentors"
              : "Manage your appointment requests and confirmations"}
          </p>
        </Card>
      </MotionReveal>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Panel - Mentors or Stats */}
        {role === "student" ? (
          <MotionReveal className="lg:col-span-1" delay={80}>
            <Card>
              <h3 className="mb-4">Available Mentors</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {mentors.map((mentor) => (
                  <button
                    key={mentor.id}
                    onClick={() => setSelectedMentor(mentor)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 hover:-translate-y-0.5 ${
                      selectedMentor?.id === mentor.id
                        ? "bg-primary/10 border border-primary"
                        : "border border-border hover:border-primary"
                    }`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-sm">{mentor.name}</p>
                        <p className="text-xs text-neutral">
                          {mentor.expertise}
                        </p>
                      </div>
                      <Badge className="text-yellow-600 bg-yellow-100">
                        ⭐ {mentor.rating}
                      </Badge>
                    </div>
                    <p className="text-xs text-neutral font-semibold">
                      Session based mentorship
                    </p>
                  </button>
                ))}
              </div>
            </Card>
          </MotionReveal>
        ) : (
          <MotionReveal className="lg:col-span-1" delay={80}>
            <Card>
              <h3 className="mb-4">Pending Requests</h3>
              {isLoading ? (
                <p className="text-neutral">Loading...</p>
              ) : userAppointments.filter((a) => a.status === "pending")
                  .length > 0 ? (
                <div className="space-y-2">
                  {userAppointments
                    .filter((a) => a.status === "pending")
                    .map((apt) => (
                      <div key={apt.id} className="p-2 bg-yellow-50 rounded-lg">
                        <p className="text-sm font-semibold">
                          {apt.studentName}
                        </p>
                        <p className="text-xs text-neutral">
                          {formatDateTime(apt.date, apt.time)}
                        </p>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-neutral text-sm">No pending requests</p>
              )}
            </Card>
          </MotionReveal>
        )}

        {/* Right Panel - Booking Form or Appointments */}
        <MotionReveal className="lg:col-span-2" delay={140}>
          {role === "student" && selectedMentor ? (
            <Card>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                <div>
                  <h3>{selectedMentor.name}</h3>
                  <p className="text-small text-neutral mt-1">
                    {selectedMentor.expertise}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedMentor(null)}
                  className="text-2xl hover:text-primary transition-colors">
                  ✕
                </button>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-sm mb-3">Available Slots</h4>
                <div className="grid gap-2 sm:grid-cols-2">
                  {selectedMentor.availability.map((slot, idx) => (
                    <button
                      key={idx}
                      onClick={() => setIsBookingModalOpen(true)}
                      className="p-2 border border-border rounded-lg hover:bg-primary/10 hover:border-primary transition-all duration-200 hover:-translate-y-0.5 text-left">
                      <p className="text-sm font-semibold text-primary">
                        {slot}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                variant="primary"
                onClick={() => setIsBookingModalOpen(true)}
                className="w-full">
                Book Session
              </Button>
            </Card>
          ) : (
            <Card>
              <h3 className="mb-4">
                {role === "student"
                  ? "Upcoming Appointments"
                  : "All Appointments"}
              </h3>

              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-neutral">Loading...</p>
                </div>
              ) : userAppointments.length === 0 ? (
                <EmptyState
                  icon="📅"
                  title="No appointments yet"
                  description={
                    role === "student"
                      ? "Select a mentor to book a session"
                      : "No appointment requests yet"
                  }
                />
              ) : (
                <div className="space-y-3">
                  {userAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="border border-border rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold">
                            {role === "student"
                              ? appointment.mentor?.fullName
                              : appointment.student?.fullName}
                          </p>
                          <p className="text-small text-neutral">
                            Topic: {appointment.topic}
                          </p>
                          <p className="text-small text-neutral mt-1">
                            {formatDateTime(
                              appointment.scheduledAt,
                              appointment.time,
                            )}
                          </p>
                        </div>
                        {getStatusBadge(appointment.status)}
                      </div>

                      {role === "mentor" &&
                        appointment.status === "pending" && (
                          <div className="flex gap-2 pt-3 border-t border-border">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() =>
                                handleCancelAppointment(appointment.id)
                              }>
                              Decline
                            </Button>
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() =>
                                handleApproveAppointment(appointment.id)
                              }>
                              Approve
                            </Button>
                          </div>
                        )}

                      {appointment.status === "confirmed" && (
                        <Button
                          size="sm"
                          variant="primary"
                          className="w-full mt-3"
                          onClick={() =>
                            window.open(
                              appointment.meetingLink ||
                                `http://localhost:5173/${role}/video-call?appointmentId=${appointment._id}`,
                              "_blank",
                            )
                          }>
                          Join Video Call
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}
        </MotionReveal>
      </div>

      {/* Booking Modal */}
      <Modal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        title={`Book Session with ${selectedMentor?.name}`}>
        <form onSubmit={handleBooking} className="space-y-4">
          <div>
            <label className="block text-small font-semibold mb-2">Date</label>
            <input
              type="date"
              value={bookingDetails.date}
              onChange={(e) =>
                setBookingDetails({ ...bookingDetails, date: e.target.value })
              }
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-small font-semibold mb-2">Time</label>
            <input
              type="time"
              value={bookingDetails.time}
              onChange={(e) =>
                setBookingDetails({ ...bookingDetails, time: e.target.value })
              }
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-small font-semibold mb-2">Topic</label>
            <textarea
              value={bookingDetails.topic}
              onChange={(e) =>
                setBookingDetails({ ...bookingDetails, topic: e.target.value })
              }
              placeholder="What would you like to discuss?"
              maxLength={200}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows="3"
              required
            />
          </div>

          <div className="flex gap-2 justify-end pt-4 border-t border-border">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsBookingModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Send Request
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
