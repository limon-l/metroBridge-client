import { useEffect, useRef, useState } from "react";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import { useAuth } from "../../hooks/useAuth";

export default function CreatePostModal({ isOpen, onClose, onSubmit }) {
  const [content, setContent] = useState("");
  const [mediaPreview, setMediaPreview] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const { user } = useAuth();

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview((prev) => [
          ...prev,
          { url: reader.result, type: "image" },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeMedia = (index) => {
    setMediaPreview((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        content,
        media: mediaPreview,
        author: {
          id: user?.uid,
          name: user?.displayName || user?.email?.split("@")[0],
          avatar: user?.photoURL,
        },
        createdAt: new Date().toISOString(),
      });

      setContent("");
      setMediaPreview([]);
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
          placeholder="What's on your mind?"
          maxLength={1000}
          className="w-full min-h-[120px] p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        />

        {/* Character Count */}
        <div className="text-right text-small text-neutral">
          {content.length}/1000
        </div>

        {/* Media Preview */}
        {mediaPreview.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {mediaPreview.map((media, index) => (
              <div
                key={index}
                className="relative rounded-lg bg-neutral-light overflow-hidden">
                <img
                  src={media.url}
                  alt={`Preview ${index + 1}`}
                  className="h-24 w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeMedia(index)}
                  className="absolute top-1 right-1 bg-danger text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-danger-dark">
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload Media Button */}
        <div className="flex gap-2 flex-wrap border-t border-b border-border py-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-light transition-colors text-primary">
            <span>📷</span>
            <span className="text-small">Photo</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleImageUpload}
            multiple
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
            disabled={!content.trim() || isSubmitting}>
            {isSubmitting ? "Posting..." : "Post"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
