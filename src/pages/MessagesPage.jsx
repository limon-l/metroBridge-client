import { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import ChatWindow from "../components/messaging/ChatWindow";
import EmptyState from "../components/ui/EmptyState";
import { useAuth } from "../hooks/useAuth";

export default function MessagesPage({ role }) {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
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
        };
      }
      return conv;
    });

    saveConversations(updatedConversations);
    setSelectedConversation(
      updatedConversations.find((c) => c.id === messageData.conversationId),
    );
  };

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
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Conversations List */}
        <div className="lg:col-span-1">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3>Conversations</h3>
              {role !== "student" && (
                <Button size="sm" variant="primary">
                  New Chat
                </Button>
              )}
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
                          <p className="font-semibold text-sm">
                            {otherUser?.name}
                          </p>
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

        {/* Chat View */}
        <div className="lg:col-span-2">
          {selectedConversation ? (
            <Card className="h-96 flex flex-col">
              <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
                <div>
                  <p className="font-semibold">
                    {
                      selectedConversation.participants.find(
                        (p) => p.id !== user?.uid,
                      )?.name
                    }
                  </p>
                  <p className="text-small text-neutral">Online</p>
                </div>
                <button className="text-xl hover:text-primary transition-colors">
                  ⋮
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                {selectedConversation.messages?.map((message) => {
                  const isOwn = message.senderId === user?.uid;

                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-xs px-3 py-2 rounded-lg ${
                          isOwn
                            ? "bg-primary text-white rounded-br-none"
                            : "bg-neutral-light text-text rounded-bl-none"
                        }`}>
                        <p className="text-sm break-words">{message.text}</p>
                        <p
                          className={`text-xs mt-1 ${isOwn ? "text-white/70" : "text-neutral"}`}>
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const input = e.target.elements[0];
                  if (input.value.trim()) {
                    handleSendMessage({
                      conversationId: selectedConversation.id,
                      text: input.value,
                      senderId: user?.uid,
                      senderName:
                        user?.displayName || user?.email?.split("@")[0],
                      timestamp: new Date().toISOString(),
                    });
                    input.value = "";
                  }
                }}
                className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  maxLength={500}
                  className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
                <Button type="submit" size="sm" variant="primary">
                  Send
                </Button>
              </form>
            </Card>
          ) : (
            <EmptyState
              icon="💬"
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
        />
      )}
    </div>
  );
}
