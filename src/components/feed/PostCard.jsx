import { useState } from "react";
import ReactionPicker from "./ReactionPicker";
import CommentSection from "./CommentSection";
import Button from "../ui/Button";
import { useAuth } from "../../hooks/useAuth";

export default function PostCard({
  post,
  onDelete,
  onReact,
  onComment,
  onShare,
  onOpenProfile,
}) {
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();

  const isAuthor = user?.uid === post.author?.id;
  const isValidMongoId = (value) => /^[a-f\d]{24}$/i.test(String(value || ""));
  const uploaderId = post.author?.id || post.author?._id || post.author?.uid;

  const reactionCounts = post.reactions || {};
  const totalReactions = Object.values(reactionCounts).length || 0;
  const userReaction = post.userReaction;

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await onDelete(post.id);
      setIsMenuOpen(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <article className="rounded-2xl border border-border bg-white p-4 shadow-soft transition-all duration-300 hover:-translate-y-[1px] hover:shadow-lg">
      {/* Post Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary-light/20 flex items-center justify-center font-semibold text-primary">
            {(post.author?.name || "U").charAt(0).toUpperCase()}
          </div>
          <div>
            <button
              type="button"
              onClick={() => onOpenProfile?.(post.author)}
              disabled={!isValidMongoId(uploaderId)}
              className="text-left font-semibold text-sm text-primary underline-offset-2 hover:underline disabled:cursor-default disabled:text-slate-700 disabled:no-underline">
              {post.author?.name || "Unknown"}
            </button>
            <p className="text-xs text-neutral">{formatDate(post.createdAt)}</p>
          </div>
        </div>

        {/* Menu Button */}
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-xl hover:text-primary transition-colors p-1">
            ⋮
          </button>

          {isMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsMenuOpen(false)}
              />
              <div className="absolute right-0 top-full mt-1 min-w-[160px] rounded-xl border border-border bg-white shadow-lg z-20">
                {isAuthor && (
                  <>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-neutral-light text-small">
                      Edit Post
                    </button>
                    <button
                      onClick={handleDelete}
                      className="w-full text-left px-3 py-2 hover:bg-danger/10 text-small text-danger">
                      Delete Post
                    </button>
                  </>
                )}
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-neutral-light text-small">
                  Report Post
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Post Content */}
      <div className="mb-3">
        <p className="text-text mb-3 leading-relaxed">{post.content}</p>

        {/* Media Gallery */}
        {post.media && post.media.length > 0 && (
          <div
            className={`grid gap-2 mb-3 ${
              post.media.length === 1
                ? "grid-cols-1"
                : post.media.length === 2
                  ? "grid-cols-2"
                  : "grid-cols-2 sm:grid-cols-3"
            }`}>
            {post.media.map((media, index) => (
              <div
                key={index}
                className="rounded-lg overflow-hidden bg-neutral-light">
                <img
                  src={media.url}
                  alt={`Post media ${index + 1}`}
                  className="h-32 w-full cursor-pointer object-cover transition-all duration-300 hover:scale-[1.02] hover:opacity-90 sm:h-48"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reaction Stats */}
      {totalReactions > 0 && (
        <div className="mb-3 flex items-center justify-between border-t border-b border-border py-2 text-xs text-neutral">
          <span>{totalReactions} reactions</span>
          <span>
            {post.comments?.length || 0} comments • {post.shares?.length || 0}{" "}
            shares
          </span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mb-4 -mx-2 flex gap-2">
        <button
          onClick={() =>
            onReact(post.id, userReaction === "like" ? null : "like")
          }
          className={`flex-1 rounded-lg px-3 py-2 text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
            userReaction === "like"
              ? "bg-primary/10 text-primary font-semibold"
              : "text-neutral hover:bg-neutral-light hover:text-primary"
          }`}>
          <ReactionPicker
            onReact={(reaction) =>
              onReact(post.id, reaction === userReaction ? null : reaction)
            }
            currentReaction={userReaction}
          />
          <span>Like</span>
        </button>

        <button
          onClick={() => setIsCommentOpen(!isCommentOpen)}
          className="flex-1 rounded-lg px-3 py-2 text-sm transition-all duration-200 flex items-center justify-center gap-2 text-neutral hover:bg-neutral-light hover:text-primary">
          <span>💬</span>
          <span>Comment</span>
        </button>

        <button
          onClick={() => onShare(post.id)}
          className="flex-1 rounded-lg px-3 py-2 text-sm transition-all duration-200 flex items-center justify-center gap-2 text-neutral hover:bg-neutral-light hover:text-primary">
          <span>🔄</span>
          <span>Share</span>
        </button>
      </div>

      {/* Comment Section */}
      {isCommentOpen && (
        <CommentSection
          postId={post.id}
          comments={post.comments || []}
          onAddComment={onComment}
        />
      )}
    </article>
  );
}
