import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Modal from "../components/ui/Modal";
import { useToast } from "../hooks/useToast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faCalendarDays,
  faCircleCheck,
  faClock,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";

const slots = ["10:00 AM", "11:30 AM", "2:00 PM", "4:30 PM"];
const sessionTypes = [
  "Career guidance",
  "Assignment review",
  "Project mentoring",
  "Interview preparation",
];

export default function BookingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedMentor = location.state?.mentor || null;
  const [step, setStep] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedTopic, setSelectedTopic] = useState(sessionTypes[0]);
  const [selectedDate, setSelectedDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast } = useToast();

  const suggestedDates = useMemo(() => {
    const dates = [];
    for (let offset = 1; offset <= 6; offset += 1) {
      const date = new Date();
      date.setDate(date.getDate() + offset);
      dates.push({
        label: date.toLocaleDateString(undefined, { weekday: "short" }),
        value: date.toISOString().slice(0, 10),
        display: date.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        }),
      });
    }
    return dates;
  }, []);

  const confirmBooking = () => {
    setIsModalOpen(false);
    showToast("Booking confirmed successfully.");
    setStep(1);
    setSelectedSlot("");
    setSelectedDate("");
    setSelectedTopic(sessionTypes[0]);
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-primary/10 bg-gradient-to-br from-primary via-primary-light to-accent text-white shadow-soft">
        <div className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr] lg:items-end">
          <div>
            <p className="text-small font-semibold uppercase tracking-wide text-white/80">
              Booking studio
            </p>
            <h2 className="mt-2 text-white">Reserve a mentor session</h2>
            <p className="mt-3 max-w-2xl text-white/90">
              Choose a mentor, pick a time, and confirm in a clean guided flow
              designed for quick professional scheduling.
            </p>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
            <p className="text-small font-semibold uppercase tracking-wide text-white/70">
              Selected mentor
            </p>
            <h3 className="mt-2 text-white">
              {selectedMentor?.name || "Choose a mentor from search"}
            </h3>
            <p className="mt-1 text-sm text-white/80">
              {selectedMentor?.department || "Mentor profile will appear here."}
            </p>
            {selectedMentor ? (
              <div className="mt-4 flex items-center gap-2 text-sm text-white/90">
                <FontAwesomeIcon icon={faCircleCheck} />
                Ready to book
              </div>
            ) : null}
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="space-y-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-primary">Step {step} of 3</h3>
              <p className="text-small text-neutral">
                Guided booking with date, time, and topic selection.
              </p>
            </div>
            <Badge variant={step >= 3 ? "success" : "accent"}>
              {step >= 3 ? "Ready to confirm" : "In progress"}
            </Badge>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-neutral-light">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {suggestedDates.map((date) => (
              <button
                key={date.value}
                type="button"
                onClick={() => {
                  setSelectedDate(date.value);
                  setStep(2);
                }}
                className={`rounded-2xl border px-4 py-4 text-left transition-all duration-200 ${
                  selectedDate === date.value
                    ? "border-primary bg-primary/5 text-primary shadow-sm"
                    : "border-border bg-white hover:border-primary/40 hover:shadow-sm"
                }`}>
                <p className="text-xs uppercase tracking-wide text-neutral">
                  {date.label}
                </p>
                <p className="mt-1 text-sm font-semibold">{date.display}</p>
                <p className="mt-2 text-xs text-neutral">Open availability</p>
              </button>
            ))}
          </div>

          <div>
            <h3 className="mb-3 text-primary">Choose session topic</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {sessionTypes.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => {
                    setSelectedTopic(topic);
                    setStep(3);
                  }}
                  className={`rounded-2xl border px-4 py-3 text-left text-small font-medium transition-all duration-200 ${
                    selectedTopic === topic
                      ? "border-primary bg-primary/5 text-primary shadow-sm"
                      : "border-border bg-white hover:border-primary/40 hover:shadow-sm"
                  }`}>
                  {topic}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-primary">Available time slots</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {slots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => {
                    setSelectedSlot(slot);
                    setStep(3);
                  }}
                  className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-small font-medium transition-all duration-200 ${
                    selectedSlot === slot
                      ? "border-primary bg-primary/5 text-primary shadow-sm"
                      : "border-border bg-white hover:border-primary/40 hover:shadow-sm"
                  }`}>
                  <span>{slot}</span>
                  <FontAwesomeIcon icon={faClock} className="text-xs" />
                </button>
              ))}
            </div>
          </div>
        </Card>

        <Card className="space-y-5 border-border/80 bg-slate-50">
          <div>
            <p className="text-small font-semibold uppercase tracking-wide text-primary">
              Session preview
            </p>
            <h3 className="mt-2">Booking summary</h3>
          </div>

          <div className="space-y-3 rounded-2xl border border-border bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="mt-1 rounded-full bg-primary/10 p-2 text-primary">
                <FontAwesomeIcon icon={faCalendarDays} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-neutral">
                  Date
                </p>
                <p className="font-medium">
                  {selectedDate || "Pick a date from the planner"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 rounded-full bg-primary/10 p-2 text-primary">
                <FontAwesomeIcon icon={faClock} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-neutral">
                  Time
                </p>
                <p className="font-medium">
                  {selectedSlot || "Pick an available time"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 rounded-full bg-primary/10 p-2 text-primary">
                <FontAwesomeIcon icon={faVideo} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-neutral">
                  Topic
                </p>
                <p className="font-medium">{selectedTopic}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 border-t border-border pt-3">
              <div className="mt-1 rounded-full bg-primary/10 p-2 text-primary">
                <FontAwesomeIcon icon={faCircleCheck} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-neutral">
                  Mentor
                </p>
                <p className="font-medium">
                  {selectedMentor?.name || "No mentor selected"}
                </p>
                <p className="text-small text-neutral">
                  {selectedMentor?.expertise || "Select a mentor to continue."}
                </p>
              </div>
            </div>
          </div>

          <Button
            className="w-full"
            disabled={!selectedMentor || !selectedDate || !selectedSlot}
            onClick={() => setIsModalOpen(true)}
            variant="cta">
            Confirm booking
            <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
          </Button>

          <Button
            className="w-full"
            onClick={() => navigate("/student/mentors")}
            variant="secondary">
            Back to mentors
          </Button>
        </Card>
      </div>

      <Modal
        confirmLabel="Confirm"
        description="Please confirm your session booking details."
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmBooking}
        title="Confirm booking">
        <div className="space-y-2 text-small text-neutral">
          <p>Mentor: {selectedMentor?.name || "Selected mentor"}</p>
          <p>Date: {selectedDate || "Not selected"}</p>
          <p>Time: {selectedSlot || "Not selected"}</p>
          <p>Topic: {selectedTopic}</p>
        </div>
      </Modal>
    </div>
  );
}
