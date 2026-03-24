import { useState } from "react";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Modal from "../components/ui/Modal";
import { useToast } from "../hooks/useToast";

const slots = ["10:00 AM", "11:30 AM", "2:00 PM", "4:30 PM"];

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast } = useToast();

  const confirmBooking = () => {
    setIsModalOpen(false);
    showToast("Booking confirmed successfully.");
    setStep(1);
    setSelectedSlot("");
  };

  return (
    <div className="space-y-6">
      <Card>
        <h2>Book a session</h2>
        <p className="mt-2">Complete booking in maximum 3 steps.</p>
        <div className="mt-4 flex gap-3">
          {[1, 2, 3].map((item) => (
            <Badge key={item} variant={item <= step ? "accent" : "default"}>
              Step {item}
            </Badge>
          ))}
        </div>
      </Card>

      <Card>
        {step === 1 ? (
          <div>
            <h3>Step 1: Select Date</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <button
                  key={day}
                  className="rounded-card border border-border px-4 py-3 text-left text-small font-medium hover:border-primary"
                  onClick={() => setStep(2)}
                  type="button">
                  {day} – Next available
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div>
            <h3>Step 2: Choose Available Time Slot</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {slots.map((slot) => (
                <button
                  key={slot}
                  className={`rounded-card border px-4 py-3 text-small font-medium ${
                    selectedSlot === slot
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border"
                  }`}
                  onClick={() => {
                    setSelectedSlot(slot);
                    setStep(3);
                  }}
                  type="button">
                  {slot}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div>
            <h3>Step 3: Confirm Booking</h3>
            <p className="mt-2 text-small text-neutral">
              Selected time: {selectedSlot || "No slot selected"}
            </p>
            <Button
              className="mt-4"
              onClick={() => setIsModalOpen(true)}
              variant="cta">
              Confirm Booking
            </Button>
          </div>
        ) : null}
      </Card>

      <Modal
        confirmLabel="Confirm"
        description="Please confirm your session booking details."
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmBooking}
        title="Confirm booking">
        <p className="text-small text-neutral">Session time: {selectedSlot}</p>
      </Modal>
    </div>
  );
}
