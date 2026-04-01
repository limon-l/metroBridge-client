import { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import ChatWindow from "../components/messaging/ChatWindow";
import EmptyState from "../components/ui/EmptyState";
import { useAuth } from "../hooks/useAuth";
import {
  fetchConversations,
  fetchMessages,
  sendConversationMessage,
} from "../services/conversationService";

export default function MessagesPage() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isMiniChatMinimized, setIsMiniChatMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

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
      <Card className="bg-gradient-to-r from-primary to-primary-light text-white">
        <p className="text-small font-semibold uppercase tracking-wide text-white/80">
          Messages
        </p>
        <h2 className="text-white">Your Conversations</h2>
        <p className="mt-2 text-white/90">
          All message threads are loaded from database.
        </p>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h3>Conversations</h3>
              <Button size="sm" variant="secondary" onClick={loadConversations}>
                Refresh
              </Button>
            </div>

            {isLoading ? (
              <p className="text-neutral">Loading...</p>
            ) : conversations.length === 0 ? (
              <EmptyState
                title="No conversations yet"
                description="Start a conversation to see messages here."
              />
            ) : (
              <div className="max-h-96 space-y-2 overflow-y-auto">
                {conversations.map((conversation) => {
                  const otherUser = conversation.participants.find(
                    (participant) => participant.id !== user?.uid,
                  );

                  return (
                    <button
                      key={conversation.id}
                      onClick={() => openConversation(conversation)}
                      className={`w-full rounded-lg border p-3 text-left transition-colors ${
                        selectedConversation?.id === conversation.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:bg-neutral-light"
                      }`}>
                      <p className="text-sm font-semibold">
                        {otherUser?.name || "Unknown"}
                      </p>
                      <p className="text-xs text-neutral">
                        {conversation.lastMessage || "No message yet"}
                      </p>
                      <p className="mt-1 text-xs text-neutral/70">
                        {formatTime(conversation.lastMessageTime)}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        <div className="lg:col-span-2">
          {selectedConversation ? (
            <Card className="h-96">
              <h3>
                {
                  selectedConversation.participants.find(
                    (participant) => participant.id !== user?.uid,
                  )?.name
                }
              </h3>
              <p className="mt-2 text-small text-neutral">
                Use the floating window to chat in real time with database
                persistence.
              </p>
            </Card>
          ) : (
            <EmptyState
              title="Select a conversation"
              description="Choose a thread from the list to open chat."
            />
          )}
        </div>
      </div>

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
