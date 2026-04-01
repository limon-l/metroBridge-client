import { useEffect, useState } from "react";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { fetchAppointments } from "../services/appointmentService";

export default function VideoCallPage() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const items = await fetchAppointments({
          status: "confirmed",
          limit: 10,
        });
        const nextSessions = (items || [])
          .filter((session) => new Date(session.scheduledAt) >= new Date())
          .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));
        setSessions(nextSessions);
      } catch {
        setSessions([]);
      }
    };

    loadSessions();
  }, []);

  const nextSession = sessions[0];
  const joinLink =
    nextSession?.meetingLink || "https://meet.jit.si/metrobridge-room";

  return (
    <div className="rounded-card bg-primary-dark p-4 text-white shadow-soft sm:p-6">
      <div className="grid gap-4 lg:grid-cols-[2fr_320px]">
        <div className="space-y-4">
          <div className="relative flex h-[360px] items-center justify-center rounded-card bg-[#0f0d24]">
            <p className="text-body text-slate-300">Main video stream</p>
            <div className="absolute bottom-4 right-4 h-20 w-32 rounded-md border border-white/20 bg-primary-light p-2 text-small text-slate-100">
              Participant
            </div>
          </div>
          <Card className="bg-[#100e28] p-3">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Badge variant="success">
                {nextSession
                  ? `Next: ${new Date(nextSession.scheduledAt).toLocaleString()}`
                  : "No confirmed session"}
              </Badge>
              <Button size="sm" variant="secondary">
                Mic
              </Button>
              <Button size="sm" variant="secondary">
                Camera
              </Button>
              <Button size="sm" variant="secondary">
                Screen Share
              </Button>
              <a href={joinLink} rel="noreferrer" target="_blank">
                <Button size="sm" variant="primary">
                  Join Room
                </Button>
              </a>
              <Button size="sm" variant="danger">
                End Call
              </Button>
            </div>
          </Card>
        </div>

        <Card className="bg-[#100e28] p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white">Collaboration Panel</h3>
            <Badge variant="success">Live</Badge>
          </div>
          <div className="mt-4 h-48 rounded-card border border-white/15 p-3">
            <p className="text-small text-slate-300">Chat window</p>
          </div>
          <div className="mt-3 h-28 rounded-card border border-white/15 p-3">
            <p className="text-small text-slate-300">File sharing area</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
