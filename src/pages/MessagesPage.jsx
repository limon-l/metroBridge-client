import { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import ChatWindow from "../components/messaging/ChatWindow";
import EmptyState from "../components/ui/EmptyState";
import { useAuth } from "../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faComments,
  faMessage,
  faPaperPlane,
  faSignal,
} from "@fortawesome/free-solid-svg-icons";

export default function MessagesPage({ role }) {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isMiniChatMinimized, setIsMiniChatMinimized] = useState(false);
  const [notificationText, setNotificationText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Load conversations from localStorage
  useEffect(() => {
    const savedConversations = localStorage.getItem("conversations");
    if (savedConversations) {
      setConversations(JSON.parse(savedConversations));
    } else {
      // Initialize with mock data
      const mockConversations = [
        {
          id: "1",
          participants: [
            { id: user?.uid, name: user?.displayName || "You" },
            { id: "mentor1", name: "Dr. Sarah Ahmed" },
          ],
          messages: [
            {
              id: "m1",
              senderId: "mentor1",
              text: "Hi! How are you doing with the React assignment?",
              timestamp: new Date(Date.now() - 3600000).toISOString(),
            },
            {
              id: "m2",
              senderId: user?.uid,
              text: "Hey Dr. Sarah! I'm almost done, just need help with the context API part.",
              timestamp: new Date(Date.now() - 1800000).toISOString(),
            },
          ],
          lastMessage:
            "I'm almost done, just need help with the context API part.",
          lastMessageTime: new Date(Date.now() - 1800000).toISOString(),
          unreadCount: 0,
        },
      ];
      setConversations(mockConversations);
      localStorage.setItem("conversations", JSON.stringify(mockConversations));
    }
    setIsLoading(false);
  }, [user?.uid]);

  const saveConversations = (updatedConversations) => {
    localStorage.setItem("conversations", JSON.stringify(updatedConversations));
    setConversations(updatedConversations);
  };

  const handleSendMessage = async (messageData) => {
    const updatedConversations = conversations.map((conv) => {
      if (conv.id === messageData.conversationId) {
        const newMessage = {
          id: Date.now().toString(),
          senderId: messageData.senderId,
          text: messageData.text,
          timestamp: messageData.timestamp,
        };

        return {
          ...conv,
          messages: [...(conv.messages || []), newMessage],
          lastMessage: messageData.text,
          lastMessageTime: messageData.timestamp,
          unreadCount: 0,
        };
      }
      return conv;
    });

    saveConversations(updatedConversations);
    setSelectedConversation(
      updatedConversations.find((c) => c.id === messageData.conversationId),
    );
  };

  const totalUnread = conversations.reduce(
    (sum, conv) => sum + (conv.unreadCount || 0),
    0,
  );

  useEffect(() => {
    localStorage.setItem(`messagesUnread:${role}`, String(totalUnread));
  }, [role, totalUnread]);

  useEffect(() => {
    if (!selectedConversation) return;

    setConversations((prev) => {
      const updated = prev.map((conv) =>
        conv.id === selectedConversation.id
          ? { ...conv, unreadCount: 0 }
          : conv,
      );
      localStorage.setItem("conversations", JSON.stringify(updated));
      return updated;
    });
  }, [selectedConversation]);

  useEffect(() => {
    if (!conversations.length || !user?.uid) return;

    const autoReplies = [
      "Thanks, that makes sense. Can we review this in the next session?",
      "I just shared updated notes. Please check when you get a chance.",
      "Great progress. Keep the momentum going.",
      "Can we meet 15 minutes earlier tomorrow?",
    ];

    const intervalId = setInterval(() => {
      setConversations((prev) => {
        if (!prev.length) return prev;

        const target = prev[0];
        const sender = target.participants.find((p) => p.id !== user.uid);
        const randomText =
          autoReplies[Math.floor(Math.random() * autoReplies.length)];
        const nowIso = new Date().toISOString();
        const isActiveThread = selectedConversation?.id === target.id;
        const shouldCountAsUnread = !isActiveThread || isMiniChatMinimized;

        const next = prev.map((conv) => {
          if (conv.id !== target.id) return conv;
          const incomingMessage = {
            id: `auto-${Date.now()}`,
            senderId: sender?.id || "system",
            text: randomText,
            timestamp: nowIso,
          };

          return {
            ...conv,
            messages: [...(conv.messages || []), incomingMessage],
            lastMessage: randomText,
            lastMessageTime: nowIso,
            unreadCount: shouldCountAsUnread ? (conv.unreadCount || 0) + 1 : 0,
          };
        });

        localStorage.setItem("conversations", JSON.stringify(next));
        setNotificationText(`${sender?.name || "New message"}: ${randomText}`);

        return next;
      });
    }, 28000);

    return () => clearInterval(intervalId);
  }, [
    conversations.length,
    isMiniChatMinimized,
    selectedConversation,
    user?.uid,
  ]);

  useEffect(() => {
    if (!notificationText) return;
    const timer = setTimeout(() => setNotificationText(""), 4500);
    return () => clearTimeout(timer);
  }, [notificationText]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }
    return date.toLocaleDateString();
  };

  const truncateMessage = (text, length = 50) => {
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-primary to-primary-light text-white">
        <p className="text-small font-semibold uppercase tracking-wide text-white/80">
          Messages
        </p>
        <h2 className="text-white">Your Conversations</h2>
        <p className="mt-2 text-white/90">
          Connect with mentors and students. Share resources and schedule
          sessions.
        </p>
        <div className="mt-4 flex items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
            <FontAwesomeIcon icon={faSignal} /> Live status active
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
            <FontAwesomeIcon icon={faComments} /> {conversations.length} threads
          </span>
        </div>
      </Card>

      {notificationText && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300 rounded-lg border border-primary/20 bg-white px-4 py-3 shadow-soft">
          <p className="text-sm font-semibold text-primary inline-flex items-center gap-2">
            <FontAwesomeIcon icon={faBell} /> New message
          </p>
          <p className="mt-1 text-sm text-neutral">{notificationText}</p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Conversations List */}
        <div className="lg:col-span-1">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3>Conversations</h3>
              <div className="relative">
                {totalUnread > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                    {totalUnread > 99 ? "99+" : totalUnread}
                  </span>
                )}
                <Button
                  size="sm"
                  variant="primary"
                  className="inline-flex items-center gap-2">
                  <FontAwesomeIcon icon={faMessage} /> Inbox
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-neutral">Loading...</p>
              </div>
            ) : conversations.length === 0 ? (
              <EmptyState
                icon="💬"
                title="No conversations yet"
                description="Start a conversation to connect!"
                className="py-8"
              />
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {conversations.map((conv) => {
                  const otherUser = conv.participants.find(
                    (p) => p.id !== user?.uid,
                  );

                  return (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedConversation?.id === conv.id
                          ? "bg-primary/10 border border-primary"
                          : "hover:bg-neutral-light border border-transparent"
                      }`}>
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary flex-shrink-0">
                          {(otherUser?.name || "U").charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-semibold text-sm truncate">
                              {otherUser?.name}
                            </p>
                            {(conv.unreadCount || 0) > 0 && (
                              <span className="h-5 min-w-5 rounded-full bg-red-600 px-1.5 text-[10px] font-bold text-white inline-flex items-center justify-center">
                                {conv.unreadCount > 99
                                  ? "99+"
                                  : conv.unreadCount}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-neutral truncate">
                            {truncateMessage(conv.lastMessage)}
                          </p>
                          <p className="text-xs text-neutral/50 mt-1">
                            {formatTime(conv.lastMessageTime)}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Conversation Status */}
        <div className="lg:col-span-2">
          {selectedConversation ? (
            <Card className="h-96 flex flex-col justify-between bg-gradient-to-br from-white to-slate-50">
              <div>
                <p className="text-xs uppercase tracking-wide text-neutral font-semibold inline-flex items-center gap-2">
                  <FontAwesomeIcon icon={faComments} /> Active thread
                </p>
                <h3 className="mt-3">
                  {
                    selectedConversation.participants.find(
                      (p) => p.id !== user?.uid,
                    )?.name
                  }
                </h3>
                <p className="text-small text-neutral mt-2">
                  Mini-chat is enabled at the bottom right. You can minimize it,
                  and new messages will continue to show unread notifications.
                </p>
              </div>

              <div className="space-y-2">
                <div className="rounded-lg border border-border bg-white p-3">
                  <p className="text-xs text-neutral">Latest message</p>
                  <p className="text-sm font-medium mt-1">
                    {selectedConversation.lastMessage}
                  </p>
                </div>
                <Button
                  variant="secondary"
                  className="inline-flex items-center gap-2"
                  onClick={() => setIsMiniChatMinimized((prev) => !prev)}>
                  <FontAwesomeIcon icon={faPaperPlane} />
                  {isMiniChatMinimized
                    ? "Open chat bubble"
                    : "Minimize chat bubble"}
                </Button>
              </div>
            </Card>
          ) : (
            <EmptyState
              title="Select a conversation"
              description="Choose a conversation from the list to start chatting"
            />
          )}
        </div>
      </div>

      {/* Floating Chat Window */}
      {selectedConversation && (
        <ChatWindow
          conversation={selectedConversation}
          onSendMessage={handleSendMessage}
          onClose={() => setSelectedConversation(null)}
          isMinimized={isMiniChatMinimized}
          onToggleMinimize={() => setIsMiniChatMinimized((prev) => !prev)}
          unreadCount={
            conversations.find((c) => c.id === selectedConversation.id)
              ?.unreadCount || 0
          }
        />
      )}
    </div>
  );
}
