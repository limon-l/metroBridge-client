import { useEffect, useState } from "react";
import Button from "../ui/Button";
import { useAuth } from "../../hooks/useAuth";
import {
  addCommentToPost,
  fetchCommentsByPost,
} from "../../services/postService";

export default function CommentSection({
  postId,
  onAddComment,
  onOpenProfile,
}) {
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [loadedComments, setLoadedComments] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const loadComments = async () => {
      setIsLoadingComments(true);
      try {
        const items = await fetchCommentsByPost(postId);
        setLoadedComments(items);
      } catch {
        setLoadedComments([]);
      } finally {
        setIsLoadingComments(false);
      }
    };

    loadComments();
  }, [postId]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    try {
      const created = await addCommentToPost(postId, commentText);
      setLoadedComments((prev) => [...prev, created]);
      onAddComment?.(created);
      setCommentText("");
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border-t border-border pt-4 space-y-4">
      <form onSubmit={handleSubmitComment} className="space-y-3">
        <div className="flex gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary flex-shrink-0">
            {(user?.displayName || user?.email)?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 space-y-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment... use @name to mention"
              maxLength={1000}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
            <div className="flex justify-between items-center gap-2">
              <p className="text-xs text-neutral">
                Mention format: @firstName or @emailPrefix
              </p>
              <Button
                type="submit"
                size="sm"
                variant="primary"
                disabled={!commentText.trim() || isSubmitting}>
                {isSubmitting ? "Posting..." : "Comment"}
              </Button>
            </div>
          </div>
        </div>
      </form>

      {isLoadingComments ? (
        <p className="text-small text-neutral">Loading comments...</p>
      ) : loadedComments.length > 0 ? (
        <div className="mb-4 space-y-3">
          {loadedComments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary flex-shrink-0">
                {(comment.author?.name || "U").charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="bg-neutral-light rounded-lg px-3 py-2">
                  <button
                    type="button"
                    onClick={() => onOpenProfile?.(comment.author)}
                    className="text-sm font-semibold text-primary underline-offset-2 hover:underline">
                    {comment.author?.name || "Unknown"}
                  </button>
                  <p className="mt-1 text-sm">{comment.text}</p>
                </div>
                <p className="text-xs text-neutral mt-1">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-small text-neutral">No comments yet.</p>
      )}
    </div>
  );
}
