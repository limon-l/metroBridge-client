import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import ChatWindow from "../components/messaging/ChatWindow";
import EmptyState from "../components/ui/EmptyState";
import MotionReveal from "../components/ui/MotionReveal";
import { useAuth } from "../hooks/useAuth";
import { connectMessageSocket } from "../services/socketClient";
import {
  fetchConversations,
  fetchMessages,
  sendConversationMessage,
} from "../services/conversationService";

export default function MessagesPage({ role }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const autoOpenedConversationRef = useRef(null);
  const currentRole = role || "student";
  const roleBasePath =
    currentRole === "mentor"
      ? "/mentor"
      : currentRole === "admin"
        ? "/admin"
        : "/student";

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const loadConversations = useCallback(async () => {
    setIsLoading(true);
    try {
      const items = await fetchConversations();
      setConversations(items);
    } catch {
      setConversations([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    const openConversationId = location.state?.openConversationId;
    if (!openConversationId || conversations.length === 0) {
      return;
    }

    if (autoOpenedConversationRef.current === openConversationId) {
      return;
    }

    const match = conversations.find((item) => item.id === openConversationId);
    if (match) {
      autoOpenedConversationRef.current = openConversationId;
      openConversation(match);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [conversations, location.pathname, location.state, navigate]);

  const filteredConversations = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return conversations.filter((conversation) => {
      const otherUser = conversation.participants.find(
        (participant) => participant.id !== user?.uid,
      );
      const matchesSearch =
        !query ||
        (otherUser?.name || "").toLowerCase().includes(query) ||
        (conversation.lastMessage || "").toLowerCase().includes(query);

      if (!matchesSearch) return false;

      if (activeFilter === "unread") {
        return Number(conversation.unreadCount || 0) > 0;
      }

      if (activeFilter === "active") {
        const lastMessageTs = new Date(conversation.lastMessageTime).getTime();
        return Date.now() - lastMessageTs < 1000 * 60 * 60 * 24;
      }

      return true;
    });
  }, [activeFilter, conversations, searchQuery, user?.uid]);

  const totalUnread = useMemo(
    () =>
      conversations.reduce(
        (sum, item) => sum + Number(item.unreadCount || 0),
        0,
      ),
    [conversations],
  );

  const mergeIncomingMessage = (conversation, incomingMessage) => {
    const nextMessages = conversation.messages || [];
    const alreadyExists = nextMessages.some(
      (message) => message.id === incomingMessage.id,
    );

    return {
      ...conversation,
      messages: alreadyExists
        ? nextMessages.map((message) =>
            message.id === incomingMessage.id ? incomingMessage : message,
          )
        : [...nextMessages, incomingMessage],
      lastMessage: incomingMessage.text,
      lastMessageTime: incomingMessage.timestamp,
    };
  };

  useEffect(() => {
    const token = localStorage.getItem("metrobridge_token");
    const socket = connectMessageSocket(token);
    if (!socket) return undefined;

    const handleMessage = ({ conversationId, message }) => {
      if (!conversationId || !message?.id) return;

      setConversations((prev) => {
        const next = prev.map((item) =>
          item.id === conversationId
            ? {
                ...item,
                lastMessage: message.text,
                lastMessageTime: message.timestamp,
                unreadCount:
                  selectedConversation?.id === conversationId ||
                  message.senderId === user?.uid
                    ? Number(item.unreadCount || 0)
                    : Number(item.unreadCount || 0) + 1,
              }
            : item,
        );

        return next.sort(
          (left, right) =>
            new Date(right.lastMessageTime).getTime() -
            new Date(left.lastMessageTime).getTime(),
        );
      });

      setSelectedConversation((prev) => {
        if (!prev || prev.id !== conversationId) return prev;
        return mergeIncomingMessage(prev, message);
      });
    };

    socket.on("message:new", handleMessage);
    return () => {
      socket.off("message:new", handleMessage);
    };
  }, [selectedConversation?.id, user?.uid]);

  const openConversation = async (conversation) => {
    try {
      const messages = await fetchMessages(conversation.id);
      setConversations((prev) =>
        prev.map((item) =>
          item.id === conversation.id ? { ...item, unreadCount: 0 } : item,
        ),
      );
      setSelectedConversation({ ...conversation, messages });
    } catch {
      setSelectedConversation({ ...conversation, messages: [] });
    }
  };

  const handleSendMessage = async (messageData) => {
    const sent = await sendConversationMessage(messageData.conversationId, {
      content: messageData.content,
      mediaUrl: messageData.mediaUrl,
      mediaType: messageData.mediaType,
    });

    setSelectedConversation((prev) => {
      if (!prev || prev.id !== messageData.conversationId) return prev;
      return mergeIncomingMessage(prev, sent);
    });

    setConversations((prev) =>
      prev.map((item) =>
        item.id === messageData.conversationId
          ? {
              ...item,
              lastMessage: sent.text,
              lastMessageTime: sent.timestamp,
            }
          : item,
      ),
    );
  };

  const formatConversationTime = (timestamp) => {
    if (!timestamp) return "Now";

    const date = new Date(timestamp);
    const diffMs = Date.now() - date.getTime();
    const minutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMs / 3600000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;

    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <MotionReveal y={12}>
        <Card className="banner-surface relative flex min-h-[9rem] items-center overflow-hidden bg-gradient-to-r from-primary via-primary-light to-accent p-4 text-white sm:p-5 lg:p-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(255,255,255,0.2),transparent_38%)]" />
          <div className="relative">
            <p className="text-small font-semibold uppercase tracking-wide text-white/80">
              Messaging Hub
            </p>
            <h2 className="text-white">Premium Conversations</h2>
            <p className="mt-2 max-w-2xl text-white/90">
              Experience a clean social-style inbox with instant sync, smart
              filtering, and elevated chat controls for {currentRole}s.
            </p>
          </div>
        </Card>
      </MotionReveal>

      <MotionReveal delay={60} y={14}>
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-0 bg-gradient-to-br from-white to-slate-50">
            <p className="text-small text-neutral">Total conversations</p>
            <p className="mt-1 text-h3 text-primary">{conversations.length}</p>
          </Card>
          <Card className="border-0 bg-gradient-to-br from-white to-slate-50">
            <p className="text-small text-neutral">Unread</p>
            <p className="mt-1 text-h3 text-primary">{totalUnread}</p>
          </Card>
          <Card className="border-0 bg-gradient-to-br from-white to-slate-50">
            <p className="text-small text-neutral">Active in 24h</p>
            <p className="mt-1 text-h3 text-primary">
              {
                conversations.filter(
                  (item) =>
                    Date.now() - new Date(item.lastMessageTime).getTime() <
                    1000 * 60 * 60 * 24,
                ).length
              }
            </p>
          </Card>
          <Card className="border-0 bg-gradient-to-br from-white to-slate-50">
            <p className="text-small text-neutral">Live sync</p>
            <p className="mt-1 text-h3 text-emerald-600">Online</p>
          </Card>
        </section>
      </MotionReveal>

      <MotionReveal delay={110} y={18}>
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Card className="h-[36rem] min-h-0 flex flex-col">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h3>Inbox</h3>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={loadConversations}>
                  Refresh
                </Button>
              </div>

              <input
                type="text"
                placeholder="Search by name or message"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="mb-3 w-full rounded-card border border-border px-3 py-2 text-sm outline-none focus:border-primary-light focus:ring-2 focus:ring-blue-100"
              />

              <div className="mb-4 flex flex-wrap gap-2">
                {[
                  { key: "all", label: "All" },
                  { key: "unread", label: "Unread" },
                  { key: "active", label: "Active" },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setActiveFilter(item.key)}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold transition-all ${
                      activeFilter === item.key
                        ? "border-primary bg-primary text-white"
                        : "border-border bg-white text-slate-600 hover:border-primary hover:text-primary"
                    }`}>
                    {item.label}
                  </button>
                ))}
              </div>

              {isLoading ? (
                <p className="text-neutral">Loading...</p>
              ) : filteredConversations.length === 0 ? (
                <EmptyState
                  title="No conversations found"
                  description="Try another search or filter and refresh inbox."
                />
              ) : (
                <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
                  {filteredConversations.map((conversation) => {
                    const otherUser = conversation.participants.find(
                      (participant) => participant.id !== user?.uid,
                    );
                    const initials = (otherUser?.name || "U")
                      .split(" ")
                      .filter(Boolean)
                      .map((word) => word.charAt(0))
                      .slice(0, 2)
                      .join("")
                      .toUpperCase();
                    const isUnread = Number(conversation.unreadCount || 0) > 0;
                    const previewText =
                      conversation.lastMessage?.trim() || "No message yet";
                    const isSelected =
                      selectedConversation?.id === conversation.id;

                    return (
                      <button
                        key={conversation.id}
                        type="button"
                        onClick={() => openConversation(conversation)}
                        className={`w-full rounded-card border p-3 text-left transition-all hover:translate-y-[-1px] hover:shadow-soft ${
                          isSelected
                            ? "border-primary bg-primary/10"
                            : isUnread
                              ? "border-primary/30 bg-primary/5"
                              : "border-border hover:bg-neutral-light"
                        }`}>
                        <div className="flex items-start gap-3">
                          <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20 text-xs font-semibold text-primary">
                            {initials}
                            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-white bg-emerald-500" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <p
                                className={`truncate text-sm font-semibold ${
                                  isSelected
                                    ? "text-primary-dark"
                                    : "text-slate-800"
                                }`}>
                                {otherUser?.name || "Unknown"}
                              </p>
                              <p className="text-[11px] text-neutral/80">
                                {formatConversationTime(
                                  conversation.lastMessageTime,
                                )}
                              </p>
                            </div>
                            <div className="mt-1 flex items-center justify-between gap-2">
                              <p className="line-clamp-1 text-xs text-neutral">
                                {previewText}
                              </p>
                              {isUnread ? (
                                <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
                                  {conversation.unreadCount > 9
                                    ? "9+"
                                    : conversation.unreadCount}
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>

          <div className="lg:col-span-8 h-[36rem]">
            {selectedConversation ? (
              <ChatWindow
                conversation={selectedConversation}
                onSendMessage={handleSendMessage}
                onClose={() => setSelectedConversation(null)}
                isMinimized={false}
                onToggleMinimize={() => {}}
                variant="embedded"
                voiceCallPath={`${roleBasePath}/voice-call`}
              />
            ) : (
              <Card className="flex h-full items-center justify-center border-dashed border-border bg-gradient-to-br from-white to-slate-50">
                <div className="max-w-md text-center">
                  <h3>Select a conversation</h3>
                  <p className="mt-2 text-small text-neutral">
                    Choose a thread from the inbox to open the conversation on
                    the right, just like a modern messenger.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </MotionReveal>
    </div>
  );
}
