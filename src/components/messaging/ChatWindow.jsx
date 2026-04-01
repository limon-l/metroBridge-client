import { useState, useRef, useEffect } from "react";
import Button from "../ui/Button";
import Card from "../ui/Card";
import { useAuth } from "../../hooks/useAuth";

export default function ChatWindow({
  conversation,
  onSendMessage,
  onClose,
  isMinimized,
  onToggleMinimize,
  unreadCount = 0,
}) {
  const [messageText, setMessageText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  // Auto scroll to bottom
  useEffect(() => {
    if (isMinimized) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages, isMinimized]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    setIsSubmitting(true);
    try {
      await onSendMessage({
        conversationId: conversation.id,
        text: messageText,
        senderId: user?.uid,
        senderName: user?.displayName || user?.email?.split("@")[0],
        timestamp: new Date().toISOString(),
      });
      setMessageText("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const otherUser = conversation.participants.find((p) => p.id !== user?.uid);

  if (isMinimized) {
    return (
      <div className="fixed bottom-0 right-4 z-40">
        <button
          onClick={onToggleMinimize}
          className="relative flex items-center gap-2 rounded-t-lg bg-primary px-4 py-3 text-white shadow-xl transition-colors hover:bg-primary-light">
          <span className="font-semibold text-sm">{otherUser?.name}</span>
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-red-600 px-1.5 text-xs font-bold text-white animate-pulse">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>
      </div>
    );
  }

  return (
    <Card className="fixed bottom-0 right-4 w-96 max-w-full rounded-t-lg rounded-b-none shadow-xl flex flex-col h-96 bg-white border-t border-l border-r border-border">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div>
          <p className="font-semibold">{otherUser?.name}</p>
          <p className="text-xs text-neutral">Online</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleMinimize}
            className="rounded px-2 py-1 text-sm hover:bg-neutral-light transition-colors"
            aria-label="Minimize chat">
            _
          </button>
          <button
            onClick={onClose}
            className="text-xl hover:text-primary transition-colors"
            aria-label="Close chat">
            ✕
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {conversation?.messages?.map((message) => {
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
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type a message..."
            maxLength={500}
            className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            disabled={isSubmitting}
          />
          <Button
            type="submit"
            size="sm"
            variant="primary"
            disabled={!messageText.trim() || isSubmitting}>
            Send
          </Button>
        </div>
      </form>
    </Card>
  );
}
