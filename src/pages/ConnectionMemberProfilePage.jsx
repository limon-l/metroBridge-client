import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import InputField from "../components/ui/InputField";
import MotionReveal from "../components/ui/MotionReveal";
import {
  disconnectMember,
  fetchMemberProfile,
  reportMember,
} from "../services/connectionService";
import { createConversation } from "../services/conversationService";
import { useToast } from "../hooks/useToast";
import { useAuth } from "../hooks/useAuth";

export default function ConnectionMemberProfilePage() {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { role } = useAuth();

  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [showReportBox, setShowReportBox] = useState(false);
  const [actionBusy, setActionBusy] = useState(false);
  const menuRef = useRef(null);
  const roleBasePath =
    role === "mentor" ? "/mentor" : role === "admin" ? "/admin" : "/student";

  const loadProfile = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchMemberProfile(memberId);
      setMember(data);
    } catch (error) {
      setMember(null);
      showToast(error?.message || "Could not load profile.", "error");
    } finally {
      setLoading(false);
    }
  }, [memberId, showToast]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    const onClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    const onEscape = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setShowReportBox(false);
      }
    };

    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);

    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, []);

  const handleOpenMessage = async () => {
    try {
      const conversation = await createConversation(memberId);
      showToast("Conversation opened.", "success");
      navigate(`${roleBasePath}/messages`, {
        state: { openConversationId: conversation.id },
      });
    } catch (error) {
      showToast(error?.message || "Failed to open chat.", "error");
    }
  };

  const canDisconnect = member?.relationship === "connected";

  const menuActions = [
    {
      key: "message",
      label: "Send message",
      onClick: () => handleOpenMessage(),
    },
    {
      key: "disconnect",
      label: "Disconnect",
      disabled: !canDisconnect || actionBusy,
      onClick: async () => {
        if (!canDisconnect) return;

        const confirmed = window.confirm(
          "Are you sure you want to disconnect this member?",
        );
        if (!confirmed) return;

        try {
          setActionBusy(true);
          await disconnectMember(memberId);
          showToast("Disconnected successfully.", "success");
          navigate(`${roleBasePath}/connections`);
        } catch (error) {
          showToast(error?.message || "Disconnect failed.", "error");
        } finally {
          setActionBusy(false);
        }
      },
    },
    {
      key: "report",
      label: "Report profile",
      onClick: () => setShowReportBox(true),
    },
    {
      key: "copy-link",
      label: "Copy profile link",
      onClick: async () => {
        const link = `${window.location.origin}${roleBasePath}/connections/${memberId}`;
        try {
          await navigator.clipboard.writeText(link);
          showToast("Profile link copied.", "success");
        } catch {
          showToast("Could not copy profile link.", "error");
        }
      },
    },
    {
      key: "block",
      label: "Block (coming soon)",
      onClick: () => showToast("Block option can be added in next phase."),
    },
  ];

  if (loading) {
    return (
      <Card>
        <p className="text-neutral">Loading profile...</p>
      </Card>
    );
  }

  if (!member) {
    return (
      <Card>
        <p className="text-neutral">Member profile not available.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <MotionReveal y={12}>
        <Card className="bg-gradient-to-r from-primary to-primary-light text-white">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-white">{member.fullName}</h2>
              <p className="mt-1 text-white/90">{member.email}</p>
            </div>
            <div className="relative" ref={menuRef}>
              <Button
                variant="secondary"
                onClick={() => setMenuOpen((p) => !p)}>
                •••
              </Button>
              {menuOpen ? (
                <div className="absolute right-0 z-10 mt-2 w-56 rounded-card border border-border bg-white p-2 text-slate-800 shadow-soft transition-all duration-200">
                  {menuActions.map((action) => (
                    <button
                      key={action.key}
                      className="w-full rounded-card px-3 py-2 text-left text-small text-slate-800 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={Boolean(action.disabled)}
                      onClick={async () => {
                        await action.onClick();
                        setMenuOpen(false);
                      }}>
                      {action.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant={member.role === "mentor" ? "accent" : "default"}>
              {member.role}
            </Badge>
            <Badge variant="success">{member.relationship}</Badge>
          </div>
        </Card>
      </MotionReveal>

      <MotionReveal delay={80} y={16}>
        <section className="grid gap-4 lg:grid-cols-2">
          <Card>
            <h3>Basic Information</h3>
            <div className="mt-4 space-y-2 text-small text-neutral">
              <p>
                <strong className="text-gray-700">Department:</strong>{" "}
                {member.department || "N/A"}
              </p>
              <p>
                <strong className="text-gray-700">Batch:</strong>{" "}
                {member.batch || "N/A"}
              </p>
              <p>
                <strong className="text-gray-700">University ID:</strong>{" "}
                {member.universityId || "N/A"}
              </p>
              <p>
                <strong className="text-gray-700">Educational Details:</strong>{" "}
                {member.educationDetails || "N/A"}
              </p>
              <p>
                <strong className="text-gray-700">Job Details:</strong>{" "}
                {member.jobDetails || "N/A"}
              </p>
            </div>
            <div className="mt-4">
              <Button onClick={handleOpenMessage}>Message</Button>
            </div>
          </Card>

          <Card>
            <h3>Academic and Research</h3>
            <p className="mt-3 text-small text-neutral">
              <strong className="text-gray-700">Thesis:</strong>{" "}
              {member.thesis || "N/A"}
            </p>
            <div className="mt-3">
              <p className="text-small font-semibold text-gray-700">Projects</p>
              {Array.isArray(member.projects) && member.projects.length > 0 ? (
                <ul className="mt-2 list-disc space-y-1 pl-5 text-small text-neutral">
                  {member.projects.map((item, index) => (
                    <li key={`${index}-${item}`}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 text-small text-neutral">
                  No projects added.
                </p>
              )}
            </div>
            <p className="mt-4 text-small text-neutral">
              <strong className="text-gray-700">Bio:</strong>{" "}
              {member.bio || "N/A"}
            </p>
          </Card>
        </section>
      </MotionReveal>

      {showReportBox ? (
        <MotionReveal delay={120} y={14}>
          <Card>
            <h3>Report Member</h3>
            <InputField
              className="mt-3"
              label="Reason"
              value={reportReason}
              onChange={(event) => setReportReason(event.target.value)}
              placeholder="Explain your report"
            />
            <div className="mt-3 flex gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowReportBox(false);
                  setReportReason("");
                }}>
                Cancel
              </Button>
              <Button
                disabled={actionBusy}
                onClick={async () => {
                  const reason = reportReason.trim();
                  if (reason.length < 5) {
                    showToast("Please provide at least 5 characters.", "error");
                    return;
                  }

                  try {
                    setActionBusy(true);
                    await reportMember(memberId, reason);
                    showToast("Report submitted.", "success");
                    setShowReportBox(false);
                    setReportReason("");
                  } catch (error) {
                    showToast(error?.message || "Report failed.", "error");
                  } finally {
                    setActionBusy(false);
                  }
                }}>
                Submit Report
              </Button>
            </div>
          </Card>
        </MotionReveal>
      ) : null}
    </div>
  );
}
