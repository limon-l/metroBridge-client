import { useState } from "react";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import InputField from "../components/ui/InputField";
import Modal from "../components/ui/Modal";
import { useToast } from "../hooks/useToast";

const reports = [
  {
    id: 1,
    subject: "Inappropriate language in chat",
    reporter: "Student A",
    status: "Pending",
  },
  {
    id: 2,
    subject: "Spam resource upload",
    reporter: "Mentor B",
    status: "Reviewing",
  },
];

export default function ModerationPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const { showToast } = useToast();

  const submitReport = () => {
    if (!reason || !description) {
      showToast("Please complete report reason and description.", "error");
      return;
    }

    setIsOpen(false);
    setReason("");
    setDescription("");
    showToast("Report submitted successfully.");
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2>Moderation Center</h2>
            <p className="mt-2">
              Report concerns and moderate platform safety.
            </p>
          </div>
          <Button onClick={() => setIsOpen(true)} variant="danger">
            Report
          </Button>
        </div>
      </Card>

      <Card>
        <h3>Admin moderation queue</h3>
        <div className="mt-4 space-y-3">
          {reports.map((report) => (
            <div
              key={report.id}
              className="flex flex-col gap-3 rounded-card border border-border p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold text-primary">{report.subject}</p>
                <p className="text-small text-neutral">
                  Reporter: {report.reporter}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="warning">{report.status}</Badge>
                <Button size="sm" variant="primary">
                  Approve
                </Button>
                <Button size="sm" variant="secondary">
                  Reject
                </Button>
                <Button size="sm" variant="danger">
                  Ban
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Modal
        confirmLabel="Submit Report"
        description="Provide clear details for moderation review."
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={submitReport}
        title="Report content or user">
        <div className="space-y-3">
          <InputField
            label="Reason"
            onChange={(event) => setReason(event.target.value)}
            value={reason}
          />
          <div className="space-y-2">
            <label
              className="text-small font-medium text-gray-700"
              htmlFor="description">
              Description
            </label>
            <textarea
              className="w-full rounded-card border border-border px-4 py-3 text-body outline-none focus:border-primary-light focus:ring-2 focus:ring-blue-100"
              id="description"
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe the issue"
              rows={4}
              value={description}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
