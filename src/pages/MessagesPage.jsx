import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import ChatWindow from "../components/messaging/ChatWindow";
import EmptyState from "../components/ui/EmptyState";
import MotionReveal from "../components/ui/MotionReveal";
import { useAuth } from "../hooks/useAuth";
import {
  fetchConversations,
  fetchMessages,
  sendConversationMessage,
} from "../services/conversationService";

export default function MessagesPage({ role }) {
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isMiniChatMinimized, setIsMiniChatMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const { user } = useAuth();

  const currentRole = role || "student";

  const loadConversations = async () => {
    setIsLoading(true);
    try {
      const items = await fetchConversations();
      setConversations(items);
    } catch {
      setConversations([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    const openConversationId = location.state?.openConversationId;
    if (!openConversationId || conversations.length === 0) {
      return;
    }

    const match = conversations.find((item) => item.id === openConversationId);
    if (match) {
      openConversation(match);
    }
  }, [conversations, location.state]);

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

      if (!matchesSearch) {
        return false;
      }

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

  const selectedOtherUser = selectedConversation?.participants.find(
    (participant) => participant.id !== user?.uid,
  );

  const openConversation = async (conversation) => {
    try {
      const messages = await fetchMessages(conversation.id);
      setSelectedConversation({ ...conversation, messages });
    } catch {
      setSelectedConversation({ ...conversation, messages: [] });
    }
  };

  const handleSendMessage = async (messageData) => {
    const sent = await sendConversationMessage(
      messageData.conversationId,
      messageData.text,
    );

    setSelectedConversation((prev) => {
      if (!prev || prev.id !== messageData.conversationId) return prev;
      return {
        ...prev,
        messages: [...(prev.messages || []), sent],
        lastMessage: sent.text,
        lastMessageTime: sent.timestamp,
      };
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

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <MotionReveal y={12}>
        <Card className="banner-surface relative bg-gradient-to-r from-primary via-primary-light to-accent p-5 text-white sm:p-6 lg:p-7">
          <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/15 blur-2xl" />
          <div className="absolute -bottom-8 left-1/3 h-28 w-28 rounded-full bg-white/20 blur-2xl" />
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
            <Card className="h-full">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h3>Conversations</h3>
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
                <div className="max-h-[30rem] space-y-2 overflow-y-auto pr-1">
                  {filteredConversations.map((conversation) => {
                    const otherUser = conversation.participants.find(
                      (participant) => participant.id !== user?.uid,
                    );

                    return (
                      <button
                        key={conversation.id}
                        onClick={() => openConversation(conversation)}
                        className={`w-full rounded-card border p-3 text-left transition-all hover:translate-y-[-1px] hover:shadow-soft ${
                          selectedConversation?.id === conversation.id
                            ? "border-primary bg-primary/10"
                            : "border-border hover:bg-neutral-light"
                        }`}>
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-slate-800">
                            {otherUser?.name || "Unknown"}
                          </p>
                          <p className="text-[11px] text-neutral/80">
                            {formatTime(conversation.lastMessageTime)}
                          </p>
                        </div>
                        <p className="mt-1 line-clamp-1 text-xs text-neutral">
                          {conversation.lastMessage || "No message yet"}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>

          <div className="lg:col-span-8">
            {selectedConversation ? (
              <Card className="h-full min-h-[18rem]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3>{selectedOtherUser?.name || "Conversation"}</h3>
                    <p className="mt-1 text-small text-neutral">
                      Direct messages with persistent history.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="secondary">
                      Pin chat
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setIsMiniChatMinimized(false)}>
                      Expand chat
                    </Button>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-card border border-border bg-slate-50 p-3">
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Last update
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {formatTime(selectedConversation.lastMessageTime)}
                    </p>
                  </div>
                  <div className="rounded-card border border-border bg-slate-50 p-3">
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Messages
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {(selectedConversation.messages || []).length}
                    </p>
                  </div>
                  <div className="rounded-card border border-border bg-slate-50 p-3">
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Status
                    </p>
                    <p className="mt-1 text-sm font-semibold text-emerald-600">
                      Active thread
                    </p>
                  </div>
                </div>
              </Card>
            ) : (
              <EmptyState
                title="Select a conversation"
                description="Choose a thread from the inbox to open your premium chat window."
              />
            )}
          </div>
        </div>
      </MotionReveal>

      {selectedConversation && (
        <ChatWindow
          conversation={selectedConversation}
          onSendMessage={handleSendMessage}
          onClose={() => setSelectedConversation(null)}
          isMinimized={isMiniChatMinimized}
          onToggleMinimize={() => setIsMiniChatMinimized((prev) => !prev)}
        />
      )}
    </div>
  );
}
