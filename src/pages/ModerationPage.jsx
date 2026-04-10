import { useCallback, useEffect, useMemo, useState } from "react";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import InputField from "../components/ui/InputField";
import Modal from "../components/ui/Modal";
import { useToast } from "../hooks/useToast";
import { useAuth } from "../hooks/useAuth";
import {
  fetchModerationReports,
  reviewModerationReport,
} from "../services/connectionService";

const statusBadgeVariant = {
  pending: "warning",
  reviewing: "default",
  resolved: "success",
  rejected: "secondary",
};

const priorityBadgeVariant = {
  high: "danger",
  medium: "warning",
  low: "secondary",
};

export default function ModerationPage() {
  const { role } = useAuth();
  const isAdmin = role === "admin";
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [actionNote, setActionNote] = useState("");
  const [pendingAction, setPendingAction] = useState(null);
  const [reports, setReports] = useState([]);
  const [summary, setSummary] = useState({
    pending: 0,
    reviewing: 0,
    resolved: 0,
    rejected: 0,
    highPriority: 0,
  });
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isActionBusy, setIsActionBusy] = useState(false);
  const { showToast } = useToast();

  const loadReports = useCallback(async () => {
    if (!isAdmin) {
      setReports([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const { reports: items, meta } = await fetchModerationReports({
        status: statusFilter === "all" ? undefined : statusFilter,
        q: searchText.trim() || undefined,
        limit: 100,
      });
      setReports(items);
      setSummary(
        meta?.summary || {
          pending: 0,
          reviewing: 0,
          resolved: 0,
          rejected: 0,
          highPriority: 0,
        },
      );
    } catch (error) {
      showToast(error?.message || "Failed to load moderation queue.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin, searchText, showToast, statusFilter]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const openActionModal = (reportId, action) => {
    setPendingAction({ reportId, action });
    setActionNote("");
    setIsActionModalOpen(true);
  };

  const performAction = async () => {
    if (!pendingAction) return;

    setIsActionBusy(true);
    try {
      await reviewModerationReport(pendingAction.reportId, {
        action: pendingAction.action,
        note: actionNote.trim(),
      });
      showToast("Moderation decision saved.", "success");
      setIsActionModalOpen(false);
      setPendingAction(null);
      setActionNote("");
      await loadReports();
    } catch (error) {
      showToast(error?.message || "Action failed.", "error");
    } finally {
      setIsActionBusy(false);
    }
  };

  const quickInsights = useMemo(
    () => [
      { label: "Pending", value: summary.pending },
      { label: "Reviewing", value: summary.reviewing },
      { label: "Resolved", value: summary.resolved },
      { label: "High Priority", value: summary.highPriority },
    ],
    [summary],
  );

  const formatDateTime = (value) => {
    if (!value) return "N/A";
    return new Date(value).toLocaleString();
  };

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <Card>
          <h2>Moderation Center</h2>
          <p className="mt-2 text-neutral">
            Only admins can access the moderation queue. To report a user, open
            their profile and use the report action from there.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2>Moderation Center</h2>
            <p className="mt-2">
              Live report queue with role-safe moderation decisions.
            </p>
          </div>
          <Button onClick={loadReports} variant="secondary">
            Refresh Queue
          </Button>
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {quickInsights.map((item) => (
          <Card key={item.label}>
            <p className="text-small text-neutral">{item.label}</p>
            <p className="mt-2 text-h3 font-semibold text-primary">
              {item.value}
            </p>
          </Card>
        ))}
      </div>

      <Card>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <label
              className="text-small font-medium text-gray-700"
              htmlFor="statusFilter">
              Status filter
            </label>
            <select
              className="w-full rounded-card border border-border bg-white px-4 py-3 text-body text-gray-800 outline-none transition focus:border-primary-light focus:ring-2 focus:ring-blue-100"
              id="statusFilter"
              onChange={(event) => setStatusFilter(event.target.value)}
              value={statusFilter}>
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="reviewing">Reviewing</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <InputField
            label="Search in report reason"
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="e.g. harassment, spam, abuse"
            value={searchText}
          />
        </div>
      </Card>

      <Card>
        <h3>Admin moderation queue</h3>
        <div className="mt-4 space-y-3">
          {isLoading ? (
            <p className="text-small text-neutral">Loading queue...</p>
          ) : reports.length === 0 ? (
            <p className="text-small text-neutral">No reports found.</p>
          ) : (
            reports.map((report) => (
              <div
                key={report._id}
                className="space-y-3 rounded-card border border-border p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-primary">
                      {report.reason}
                    </p>
                    <p className="mt-1 text-small text-neutral">
                      Reporter: {report.reporter?.fullName || "Unknown"} (
                      {report.reporter?.role || "N/A"})
                    </p>
                    <p className="text-small text-neutral">
                      Reported: {report.reportedUser?.fullName || "Unknown"} (
                      {report.reportedUser?.role || "N/A"})
                    </p>
                    <p className="text-small text-neutral">
                      Created: {formatDateTime(report.createdAt)}
                    </p>
                    <p className="text-small text-neutral">
                      Last reviewed: {formatDateTime(report.reviewedAt)}
                    </p>
                    {report.adminNote ? (
                      <p className="mt-1 text-small text-neutral">
                        Admin note: {report.adminNote}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant={
                        statusBadgeVariant[report.status] || "secondary"
                      }>
                      {report.status}
                    </Badge>
                    <Badge
                      variant={
                        priorityBadgeVariant[report.priority] || "secondary"
                      }>
                      {report.priority} priority
                    </Badge>
                    <Badge variant="secondary">
                      {report.category || "other"}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => openActionModal(report._id, "review")}
                    disabled={isActionBusy}>
                    Mark Reviewing
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => openActionModal(report._id, "approve")}
                    disabled={isActionBusy}>
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => openActionModal(report._id, "reject")}
                    disabled={isActionBusy}>
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => openActionModal(report._id, "ban")}
                    disabled={isActionBusy}>
                    Ban User
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      <Modal
        confirmLabel={isActionBusy ? "Applying..." : "Confirm Action"}
        description="Add optional moderation note for audit trail."
        isOpen={isActionModalOpen}
        onClose={() => {
          if (isActionBusy) return;
          setIsActionModalOpen(false);
          setPendingAction(null);
          setActionNote("");
        }}
        onConfirm={performAction}
        title="Confirm moderation decision">
        <div className="space-y-3">
          <p className="text-small text-neutral">
            Action:{" "}
            <span className="font-semibold uppercase">
              {pendingAction?.action || "N/A"}
            </span>
          </p>
          <InputField
            label="Admin note (optional)"
            onChange={(event) => setActionNote(event.target.value)}
            value={actionNote}
          />
        </div>
      </Modal>
    </div>
  );
}
