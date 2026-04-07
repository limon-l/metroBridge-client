import { useEffect, useRef, useState } from "react";
import ReactionPicker from "./ReactionPicker";
import CommentSection from "./CommentSection";
import { fetchPostReactions } from "../../services/postService";
import { useAuth } from "../../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp,
  faComment,
  faShare,
} from "@fortawesome/free-solid-svg-icons";

export default function PostCard({
  post,
  onDelete,
  onReact,
  onComment,
  onShare,
  onOpenProfile,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isReactAnimating, setIsReactAnimating] = useState(false);
  const [isReactorsOpen, setIsReactorsOpen] = useState(false);
  const [isReactorsLoading, setIsReactorsLoading] = useState(false);
  const [reactorItems, setReactorItems] = useState([]);
  const [liveCommentsCount, setLiveCommentsCount] = useState(
    Number(post.commentsCount || 0),
  );
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const reactionFxTimer = useRef(null);
  const { user } = useAuth();

  const isAuthor = (user?.uid || user?.id) === post.author?.id;
  const isValidMongoId = (value) => /^[a-f\d]{24}$/i.test(String(value || ""));
  const uploaderId = post.author?.id || post.author?._id || post.author?.uid;

  const reactionCounts = post.reactions || {};
  const totalReactions = Object.values(reactionCounts).reduce(
    (sum, value) => sum + Number(value || 0),
    0,
  );
  const userReaction = post.userReaction;

  const getReactionEmoji = (type) => {
    const emojiMap = {
      like: "👍",
      love: "❤️",
      wow: "😮",
      support: "🤝",
    };
    return emojiMap[type] || "👍";
  };

  const getReactionLabel = (type) => {
    const labelMap = {
      like: "Liked",
      love: "Loved",
      wow: "Wowed",
      support: "Supported",
    };
    return labelMap[type] || "Liked";
  };

  useEffect(() => {
    setLiveCommentsCount(Number(post.commentsCount || 0));
  }, [post.commentsCount]);

  useEffect(() => {
    return () => {
      if (reactionFxTimer.current) {
        clearTimeout(reactionFxTimer.current);
      }
    };
  }, []);

  const triggerReactionFx = () => {
    if (reactionFxTimer.current) {
      clearTimeout(reactionFxTimer.current);
    }

    setIsReactAnimating(true);
    reactionFxTimer.current = setTimeout(() => {
      setIsReactAnimating(false);
    }, 420);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await onDelete(post.id);
      setIsMenuOpen(false);
    }
  };

  const handleReact = async (reaction) => {
    await onReact(post.id, reaction === userReaction ? null : reaction);
    triggerReactionFx();
  };

  const handleOpenReactors = async () => {
    setIsReactorsOpen(true);
    setIsReactorsLoading(true);
    try {
      const data = await fetchPostReactions(post.id);
      setReactorItems(data.items || []);
    } catch {
      setReactorItems([]);
    } finally {
      setIsReactorsLoading(false);
    }
  };

  const isSharedPost = post.sharedPostId && post.sharedPost;

  if (isSharedPost) {
    return (
      <article className="space-y-3">
        <article className="rounded-2xl border border-border bg-white p-4 shadow-soft">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary-light/20 font-semibold text-primary">
              {(post.author?.name || "U").charAt(0).toUpperCase()}
            </div>
            <div>
              <button
                type="button"
                onClick={() => onOpenProfile?.(post.author)}
                disabled={!isValidMongoId(post.author?.id)}
                className="text-left font-semibold text-sm text-primary underline-offset-2 hover:underline disabled:cursor-default disabled:text-slate-700 disabled:no-underline">
                {post.author?.name || "Unknown"}
              </button>
              <p className="text-xs text-neutral">
                shared a post • {formatDate(post.createdAt)}
              </p>
            </div>
          </div>
          {post.content && (
            <p className="text-sm text-text mb-3 leading-relaxed italic">
              {post.content}
            </p>
          )}
        </article>

        <PostCard
          post={post.sharedPost}
          onDelete={onDelete}
          onReact={onReact}
          onComment={onComment}
          onShare={onShare}
          onOpenProfile={onOpenProfile}
        />
      </article>
    );
  }

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
    <article
      className={`group relative overflow-hidden rounded-2xl border border-border bg-white p-4 shadow-soft transition-all duration-300 hover:-translate-y-[1px] hover:shadow-lg ${
        isReactAnimating ? "ring-2 ring-primary/40" : ""
      }`}>
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-primary-light to-accent opacity-60 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary-light/20 font-semibold text-primary transition-transform duration-300 group-hover:scale-105">
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

        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1 text-xl transition-colors hover:text-primary">
            ...
          </button>

          {isMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsMenuOpen(false)}
              />
              <div className="absolute right-0 top-full z-20 mt-1 min-w-[160px] rounded-xl border border-border bg-white shadow-lg">
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

      <div className="mb-3">
        <p className="text-text mb-3 leading-relaxed">{post.content}</p>

        {post.mediaUrl ? (
          <div className="mb-3 overflow-hidden rounded-xl border border-border bg-slate-50">
            <img
              src={post.mediaUrl}
              alt={post.mediaName || "Post media"}
              className="max-h-[26rem] w-full object-cover transition-transform duration-300 hover:scale-[1.01]"
            />
          </div>
        ) : null}
      </div>

      <div className="mb-3 flex items-center justify-between border-t border-b border-border py-2 text-xs text-neutral">
        <button
          type="button"
          onClick={handleOpenReactors}
          disabled={totalReactions === 0}
          className="font-semibold text-primary underline-offset-2 hover:underline disabled:cursor-default disabled:text-neutral disabled:no-underline">
          {totalReactions} reactions
        </button>
        <button
          type="button"
          onClick={() => setIsCommentOpen(!isCommentOpen)}
          className="font-semibold text-primary underline-offset-2 hover:underline disabled:cursor-default disabled:text-neutral disabled:no-underline">
          {liveCommentsCount} comments
        </button>
      </div>

      <div className="mb-4 -mx-2 flex gap-2">
        <button
          onClick={() => {
            if (userReaction) {
              handleReact(null);
            }
          }}
          className={`flex-1 rounded-lg px-3 py-2 text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
            userReaction
              ? "bg-primary/10 text-primary font-semibold"
              : "text-neutral hover:bg-neutral-light hover:text-primary"
          } ${isReactAnimating ? "scale-[1.02]" : ""}`}>
          {userReaction ? (
            <>
              <span>{getReactionEmoji(userReaction)}</span>
              <span>{getReactionLabel(userReaction)}</span>
            </>
          ) : (
            <>
              <ReactionPicker
                onReact={handleReact}
                currentReaction={userReaction}
              />
              <span>Like</span>
            </>
          )}
        </button>

        <button
          onClick={() => setIsCommentOpen(!isCommentOpen)}
          className="flex-1 rounded-lg px-3 py-2 text-sm transition-all duration-200 flex items-center justify-center gap-2 text-neutral hover:bg-neutral-light hover:text-primary">
          <FontAwesomeIcon icon={faComment} className="text-sm" />
          <span>Comment</span>
        </button>

        <button
          onClick={() => onShare(post.id)}
          className="flex-1 rounded-lg px-3 py-2 text-sm transition-all duration-200 flex items-center justify-center gap-2 text-neutral hover:bg-neutral-light hover:text-primary">
          <FontAwesomeIcon icon={faShare} className="text-sm" />
          <span>Share</span>
        </button>
      </div>

      {isCommentOpen && (
        <CommentSection
          postId={post.id}
          onOpenProfile={onOpenProfile}
          onAddComment={(created) => {
            setLiveCommentsCount((prev) => prev + 1);
            onComment?.(created);
          }}
        />
      )}

      {isReactorsOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-primary-dark/50 p-4">
          <div className="w-full max-w-md rounded-card border border-border bg-white p-4 shadow-soft">
            <div className="mb-3 flex items-center justify-between">
              <h3>Reactors</h3>
              <button
                type="button"
                onClick={() => setIsReactorsOpen(false)}
                className="rounded px-2 py-1 text-small text-neutral hover:bg-neutral-light">
                Close
              </button>
            </div>

            {isReactorsLoading ? (
              <p className="text-small text-neutral">Loading reactors...</p>
            ) : reactorItems.length === 0 ? (
              <p className="text-small text-neutral">No reactions yet.</p>
            ) : (
              <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
                {reactorItems.map((item, index) => (
                  <button
                    key={`${item.user.id}-${index}`}
                    type="button"
                    onClick={() => onOpenProfile?.(item.user)}
                    disabled={!isValidMongoId(item.user.id)}
                    className="flex w-full items-center justify-between rounded-card border border-border px-3 py-2 text-left hover:bg-neutral-light disabled:cursor-default">
                    <div>
                      <p className="text-small font-semibold text-primary">
                        {item.user.name}
                      </p>
                      <p className="text-xs text-neutral">{item.user.role}</p>
                    </div>
                    <span className="text-lg">
                      {item.type === "love"
                        ? "❤️"
                        : item.type === "wow"
                          ? "😮"
                          : item.type === "support"
                            ? "🤝"
                            : "👍"}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
