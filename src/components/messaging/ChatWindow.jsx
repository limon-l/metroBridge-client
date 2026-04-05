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
  const [mediaPreview, setMediaPreview] = useState("");
  const [mediaName, setMediaName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaPreview(String(reader.result || ""));
      setMediaName(file.name);
    };
    reader.readAsDataURL(file);
  };

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
        content: messageText,
        mediaUrl: mediaPreview,
        mediaType: mediaPreview ? "image" : "",
        senderId: user?.uid,
        senderName: user?.displayName || user?.email?.split("@")[0],
        timestamp: new Date().toISOString(),
      });
      setMessageText("");
      setMediaPreview("");
      setMediaName("");
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
      <div className="fixed bottom-0 right-3 z-40 sm:right-4">
        <button
          onClick={onToggleMinimize}
          className="relative flex items-center gap-2 rounded-t-2xl bg-gradient-to-r from-primary to-primary-light px-4 py-3 text-white shadow-xl transition-all duration-200 hover:translate-y-[-1px] hover:brightness-110">
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
    <Card className="fixed bottom-0 left-2 right-2 z-40 flex h-[32rem] flex-col rounded-t-2xl rounded-b-none border-t border-l border-r border-border bg-white/95 shadow-2xl backdrop-blur sm:left-auto sm:right-4 sm:w-[26rem]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-gradient-to-r from-slate-900 to-primary p-4 text-white">
        <div>
          <p className="font-semibold">{otherUser?.name}</p>
          <p className="text-xs text-white/80">Active now</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleMinimize}
            className="rounded px-2 py-1 text-sm text-white/90 hover:bg-white/20 transition-colors"
            aria-label="Minimize chat">
            _
          </button>
          <button
            onClick={onClose}
            className="text-xl text-white/90 hover:text-white transition-colors"
            aria-label="Close chat">
            ✕
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-slate-50/70 p-4 space-y-3">
        {conversation?.messages?.map((message) => {
          const isOwn = message.senderId === user?.uid;

          return (
            <div
              key={message.id}
              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[78%] px-3 py-2 rounded-2xl shadow-sm ${
                  isOwn
                    ? "bg-gradient-to-r from-primary to-primary-light text-white rounded-br-sm"
                    : "bg-white text-text rounded-bl-sm border border-border"
                }`}>
                <p className="text-sm break-words">{message.text}</p>
                {message.mediaUrl ? (
                  <img
                    alt={message.mediaName || "Shared media"}
                    className="mt-2 max-h-60 w-full rounded-xl object-cover"
                    src={message.mediaUrl}
                  />
                ) : null}
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
      <form
        onSubmit={handleSubmit}
        className="border-t border-border bg-white p-4">
        {mediaPreview ? (
          <div className="mb-3 overflow-hidden rounded-lg border border-border bg-slate-50">
            <img
              alt={mediaName || "Attachment preview"}
              className="h-40 w-full object-cover"
              src={mediaPreview}
            />
            <div className="flex items-center justify-between gap-2 px-3 py-2 text-small text-neutral">
              <span className="truncate">{mediaName}</span>
              <button
                type="button"
                onClick={() => {
                  setMediaPreview("");
                  setMediaName("");
                }}
                className="font-semibold text-danger hover:underline">
                Remove
              </button>
            </div>
          </div>
        ) : null}
        <div className="mb-2 flex flex-wrap gap-2">
          {["👍", "🔥", "👏", "😊", "📷", "💡"].map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => setMessageText((prev) => `${prev}${emoji}`)}
              className="rounded-full border border-border px-2 py-1 text-xs hover:bg-slate-50">
              {emoji}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type a message or send a photo..."
            maxLength={500}
            className="flex-1 rounded-card border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            disabled={isSubmitting}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => fileInputRef.current?.click()}
            disabled={isSubmitting}>
            Photo
          </Button>
          <Button
            type="submit"
            size="sm"
            variant="primary"
            disabled={(!messageText.trim() && !mediaPreview) || isSubmitting}>
            Send
          </Button>
        </div>
      </form>
    </Card>
  );
}
