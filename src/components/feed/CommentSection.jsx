import { useEffect, useState } from "react";
import Button from "../ui/Button";
import { useAuth } from "../../hooks/useAuth";
import {
  addCommentToPost,
  fetchCommentsByPost,
} from "../../services/postService";

export default function CommentSection({ postId, comments, onAddComment }) {
  const [isOpen, setIsOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadedComments, setLoadedComments] = useState(comments || []);
  const { user } = useAuth();

  useEffect(() => {
    if (!isOpen) return;

    const loadComments = async () => {
      try {
        const items = await fetchCommentsByPost(postId);
        setLoadedComments(items);
      } catch {
        setLoadedComments(comments || []);
      }
    };

    loadComments();
  }, [comments, isOpen, postId]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    try {
      const created = await addCommentToPost(postId, commentText);
      setLoadedComments((prev) => [...prev, created]);
      if (onAddComment) {
        onAddComment(created);
      }
      setCommentText("");
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border-t border-border pt-4">
      {/* Comment List */}
      {loadedComments && loadedComments.length > 0 && (
        <div className="mb-4 space-y-3">
          {loadedComments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary flex-shrink-0">
                {(comment.author?.name || "U").charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="bg-neutral-light rounded-lg px-3 py-2">
                  <p className="text-sm font-semibold">
                    {comment.author?.name || "Unknown"}
                  </p>
                  <p className="mt-1 text-sm">{comment.text}</p>
                </div>
                <p className="text-xs text-neutral mt-1">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Comment Input Toggle */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="text-primary text-small font-semibold hover:underline">
          Add a comment...
        </button>
      )}

      {/* Comment Input Form */}
      {isOpen && (
        <form onSubmit={handleSubmitComment} className="space-y-3 mt-4">
          <div className="flex gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary flex-shrink-0">
              {(user?.displayName || user?.email)?.charAt(0).toUpperCase()}
            </div>
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              maxLength={200}
              className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setCommentText("");
              }}
              className="px-3 py-1 text-sm text-neutral hover:text-text transition-colors">
              Cancel
            </button>
            <Button
              type="submit"
              size="sm"
              variant="primary"
              disabled={!commentText.trim() || isSubmitting}>
              {isSubmitting ? "Posting..." : "Comment"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
