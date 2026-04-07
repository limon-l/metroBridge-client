import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import InputField from "../components/ui/InputField";
import MotionReveal from "../components/ui/MotionReveal";
import { useAuth } from "../hooks/useAuth";
import {
  fetchConnectionRequests,
  fetchMemberDirectory,
  cancelConnectionRequest,
  respondConnectionRequest,
  sendConnectionRequest,
} from "../services/connectionService";
import { useToast } from "../hooks/useToast";

export default function ConnectionsPage() {
  const { role } = useAuth();
  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const [memberRole, setMemberRole] = useState("");
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [incoming, setIncoming] = useState([]);
  const [sent, setSent] = useState([]);
  const [requestView, setRequestView] = useState("incoming");
  const [loading, setLoading] = useState(false);
  const roleBasePath =
    role === "mentor" ? "/mentor" : role === "admin" ? "/admin" : "/student";

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [directory, incomingRequests, sentRequests] = await Promise.all([
        fetchMemberDirectory({
          q: search || undefined,
          role: memberRole || undefined,
        }),
        fetchConnectionRequests({ type: "incoming" }),
        fetchConnectionRequests({ type: "sent" }),
      ]);
      setMembers(directory);
      setIncoming(incomingRequests);
      setSent(sentRequests);
    } catch {
      setMembers([]);
      setIncoming([]);
      setSent([]);
    } finally {
      setLoading(false);
    }
  }, [memberRole, search]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const pendingIncoming = useMemo(
    () => incoming.filter((item) => item.status === "pending"),
    [incoming],
  );

  const pendingSent = useMemo(
    () => sent.filter((item) => item.status === "pending"),
    [sent],
  );

  const activeRequests =
    requestView === "incoming" ? pendingIncoming : pendingSent;

  const handleCancelRequest = async (requestId) => {
    try {
      await cancelConnectionRequest(requestId);
      showToast("Request cancelled.", "success");
      loadData();
    } catch (error) {
      showToast(error?.message || "Failed to cancel request.", "error");
    }
  };

  return (
    <div className="space-y-6">
      <MotionReveal y={12}>
        <Card className="banner-surface bg-gradient-to-r from-primary via-primary-light to-accent text-white">
          <h2 className="text-white">Connections</h2>
          <p className="mt-2 text-white/90">
            Explore all approved members, send connection requests, and manage
            incoming or sent requests.
          </p>
        </Card>
      </MotionReveal>

      <MotionReveal delay={80} y={16}>
        <Card>
          <h3>Discover Members</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <InputField
              label="Search by name, ID, or department"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Type to search"
            />
            <div className="space-y-2">
              <label className="text-small font-medium text-gray-700">
                Role
              </label>
              <select
                className="w-full rounded-card border border-border bg-white px-4 py-3 text-body text-gray-700 outline-none focus:border-primary-light focus:ring-2 focus:ring-blue-100"
                value={memberRole}
                onChange={(event) => setMemberRole(event.target.value)}>
                <option value="">All roles</option>
                <option value="student">Student</option>
                <option value="mentor">Mentor</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button className="w-full" variant="secondary" onClick={loadData}>
                Refresh
              </Button>
            </div>
            {members.length === 0 ? (
              <p className="text-small text-neutral">
                {loading ? "Loading members..." : "No members found."}
              </p>
            ) : (
              members.map((member) => (
                <Card key={member._id} className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link
                        className="font-semibold text-primary underline-offset-2 hover:underline"
                        to={`${roleBasePath}/connections/${member._id || member.id}`}>
                        {member.fullName}
                      </Link>
                      <p className="text-small text-neutral">
                        {member.universityId || "No ID"}
                      </p>
                    </div>
                    <Badge
                      variant={member.role === "mentor" ? "accent" : "default"}>
                      {member.role}
                    </Badge>
                  </div>
                  <p className="mt-2 text-small text-neutral">
                    {member.department || "N/A"}
                  </p>
                  <p className="mt-2 text-small text-neutral line-clamp-2">
                    {member.bio || "No bio"}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        navigate(
                          `${roleBasePath}/connections/${member._id || member.id}`,
                        )
                      }>
                      View Profile
                    </Button>
                    {member.relationship === "connected" ? (
                      <Badge variant="success">Connected</Badge>
                    ) : member.relationship === "pending_sent" ? (
                      <Badge variant="warning">Request sent</Badge>
                    ) : member.relationship === "pending_received" ? (
                      <Badge variant="warning">Requested you</Badge>
                    ) : (
                      <Button
                        size="sm"
                        onClick={async () => {
                          try {
                            await sendConnectionRequest(member._id);
                            showToast("Connection request sent.", "success");
                            loadData();
                          } catch (error) {
                            showToast(
                              error?.message || "Could not send request.",
                              "error",
                            );
                          }
                        }}>
                        Connect
                      </Button>
                    )}
                  </div>
                </Card>
              ))
            )}
          </div>
        </Card>
      </MotionReveal>

      <MotionReveal delay={140} y={18}>
        <Card>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3>Connection Requests</h3>
              <p className="text-small text-neutral">
                Incoming requests and sent requests are organized in one block.
              </p>
            </div>
            <div className="flex rounded-full border border-border bg-neutral-light p-1">
              <button
                type="button"
                onClick={() => setRequestView("incoming")}
                className={`rounded-full px-4 py-2 text-small font-semibold transition-colors ${
                  requestView === "incoming"
                    ? "bg-primary text-white"
                    : "text-text hover:text-primary"
                }`}>
                Incoming ({pendingIncoming.length})
              </button>
              <button
                type="button"
                onClick={() => setRequestView("sent")}
                className={`rounded-full px-4 py-2 text-small font-semibold transition-colors ${
                  requestView === "sent"
                    ? "bg-primary text-white"
                    : "text-text hover:text-primary"
                }`}>
                Sent ({pendingSent.length})
              </button>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {activeRequests.length === 0 ? (
              <p className="text-small text-neutral">
                {requestView === "incoming"
                  ? "No incoming requests."
                  : "No sent requests."}
              </p>
            ) : (
              activeRequests.map((item) => {
                const isIncoming = requestView === "incoming";
                const person = isIncoming ? item.requester : item.recipient;

                return (
                  <div
                    key={item._id}
                    className="rounded-2xl border border-border bg-white p-4 shadow-soft">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <Link
                          className="font-semibold text-primary underline-offset-2 hover:underline"
                          to={`${roleBasePath}/connections/${person?._id || person?.id}`}>
                          {person?.fullName}
                        </Link>
                        <p className="text-small text-neutral">
                          {person?.universityId || "No ID"}
                        </p>
                        <p className="text-small text-neutral">
                          {person?.department || "N/A"}
                        </p>
                      </div>

                      <Badge variant={isIncoming ? "accent" : "warning"}>
                        {isIncoming ? "Incoming" : "Sent"}
                      </Badge>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {isIncoming ? (
                        <>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={async () => {
                              try {
                                await respondConnectionRequest(
                                  item._id,
                                  "reject",
                                );
                                showToast("Request rejected.", "success");
                                loadData();
                              } catch (error) {
                                showToast(
                                  error?.message || "Failed to reject.",
                                  "error",
                                );
                              }
                            }}>
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            onClick={async () => {
                              try {
                                await respondConnectionRequest(
                                  item._id,
                                  "approve",
                                );
                                showToast("Request approved.", "success");
                                loadData();
                              } catch (error) {
                                showToast(
                                  error?.message || "Failed to approve.",
                                  "error",
                                );
                              }
                            }}>
                            Approve
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={async () => {
                            try {
                              await handleCancelRequest(item._id);
                            } catch {
                              // handled above
                            }
                          }}>
                          Cancel Request
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </MotionReveal>
    </div>
  );
}
