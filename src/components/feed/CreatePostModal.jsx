import { useRef, useState } from "react";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import { useAuth } from "../../hooks/useAuth";

const QUICK_EMOJIS = ["😀", "🔥", "👏", "💡", "📚", "🚀", "❤️"];

export default function CreatePostModal({ isOpen, onClose, onSubmit }) {
  const [content, setContent] = useState("");
  const [mediaPreview, setMediaPreview] = useState("");
  const [mediaName, setMediaName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const { user } = useAuth();

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaPreview(String(reader.result || ""));
      setMediaName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const insertEmoji = (emoji) => {
    setContent((prev) => `${prev}${emoji}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !mediaPreview) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        content,
        mediaUrl: mediaPreview,
        mediaName,
        author: {
          id: user?.uid,
          name: user?.displayName || user?.email?.split("@")[0],
          avatar: user?.photoURL,
        },
        createdAt: new Date().toISOString(),
      });

      setContent("");
      setMediaPreview("");
      setMediaName("");
      onClose();
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create a new post">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* User Info */}
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center font-semibold text-primary">
            {(user?.displayName || user?.email)?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold">
              {user?.displayName || user?.email?.split("@")[0]}
            </p>
            <p className="text-small text-neutral">Public</p>
          </div>
        </div>

        {/* Text Input */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share an update, resource, or achievement..."
          maxLength={1000}
          className="w-full min-h-[120px] rounded-lg border border-border p-3 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        />

        {/* Character Count */}
        <div className="text-right text-small text-neutral">
          {content.length}/1000
        </div>

        {/* Media Preview */}
        {mediaPreview ? (
          <div className="overflow-hidden rounded-lg border border-border bg-slate-50">
            <img
              src={mediaPreview}
              alt={mediaName || "Post preview"}
              className="h-52 w-full object-cover"
            />
            <div className="flex items-center justify-between gap-2 border-t border-border px-3 py-2 text-small text-neutral">
              <span className="truncate">{mediaName || "Selected photo"}</span>
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

        <div className="flex flex-wrap gap-2 rounded-lg border border-border bg-slate-50 px-3 py-2">
          {QUICK_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => insertEmoji(emoji)}
              className="rounded-full px-2 py-1 text-lg transition-transform hover:scale-110 hover:bg-white"
              title="Insert emoji">
              {emoji}
            </button>
          ))}
        </div>

        {/* Upload Media Button */}
        <div className="flex flex-wrap gap-2 border-t border-b border-border py-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-primary transition-colors hover:bg-neutral-light">
            <span>📷</span>
            <span className="text-small">Photo</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={(!content.trim() && !mediaPreview) || isSubmitting}>
            {isSubmitting ? "Posting..." : "Post now"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
