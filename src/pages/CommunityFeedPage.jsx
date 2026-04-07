import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import PostCard from "../components/feed/PostCard";
import CreatePostModal from "../components/feed/CreatePostModal";
import EmptyState from "../components/ui/EmptyState";
import MotionReveal from "../components/ui/MotionReveal";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import {
  createPost,
  deletePost,
  fetchPosts,
  reactToPost,
  removePostReaction,
  sharePost,
} from "../services/postService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faEdit,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";

export default function FeedPage({ role }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const roleBasePath =
    role === "mentor" ? "/mentor" : role === "admin" ? "/admin" : "/student";

  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const loadPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const items = await fetchPosts({ limit: 100 });
      setPosts(items);
    } catch {
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const communityStats = useMemo(() => {
    const totalPosts = posts.length;
    const totalReactions = posts.reduce(
      (sum, post) => sum + Number(post.reactions?.like || 0),
      0,
    );
    const totalMedia = posts.filter((post) => post.mediaUrl).length;
    const uniqueAuthors = new Set(
      posts.map((post) => post.author?.name).filter(Boolean),
    ).size;

    return [
      { label: "Posts", value: totalPosts },
      { label: "Reactions", value: totalReactions },
      { label: "Photos", value: totalMedia },
      { label: "Active authors", value: uniqueAuthors },
    ];
  }, [posts]);

  const handleCreatePost = async (postData) => {
    try {
      const created = await createPost({
        content: postData.content,
        mediaUrl: postData.mediaUrl,
        mediaName: postData.mediaName,
        mediaType: postData.mediaType,
      });
      setPosts((prev) => [created, ...prev]);
      showToast("Post published successfully.", "success");
    } catch (error) {
      showToast(error?.message || "Unable to create post.", "error");
      throw error;
    }
  };

  const handleReact = async (postId, reaction) => {
    try {
      const postIndex = posts.findIndex((p) => p.id === postId);
      if (postIndex === -1) return;

      const oldPost = posts[postIndex];
      const oldReaction = oldPost.userReaction;

      // Optimistic update
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                userReaction: reaction || null,
                reactions: reaction
                  ? {
                      ...p.reactions,
                      [reaction]: (p.reactions?.[reaction] || 0) + 1,
                      ...(oldReaction
                        ? {
                            [oldReaction]: Math.max(
                              0,
                              (p.reactions?.[oldReaction] || 0) - 1,
                            ),
                          }
                        : {}),
                    }
                  : {
                      ...p.reactions,
                      [oldReaction]: Math.max(
                        0,
                        (p.reactions?.[oldReaction] || 0) - 1,
                      ),
                    },
              }
            : p,
        ),
      );

      // API call in background
      let updatedPost;
      if (!reaction) {
        const response = await removePostReaction(postId);
        updatedPost = response;
      } else {
        const response = await reactToPost(postId, reaction);
        updatedPost = response;
      }

      // Update with actual server data to ensure accuracy
      if (updatedPost && updatedPost._id) {
        const postToImport = {
          id: updatedPost._id || updatedPost.id,
          content: updatedPost.content || "",
          mediaUrl: updatedPost.mediaUrl || "",
          mediaName: updatedPost.mediaName || "",
          mediaType: updatedPost.mediaType || "",
          createdAt: updatedPost.createdAt || new Date().toISOString(),
          author: {
            id: updatedPost.author?._id || updatedPost.author?.id,
            name:
              updatedPost.author?.fullName ||
              updatedPost.author?.name ||
              "Unknown",
            role: updatedPost.author?.role || "student",
            department: updatedPost.author?.department || "",
          },
          reactions: updatedPost.reactionCounts || {},
          userReaction: updatedPost.userReaction || null,
          commentsCount: updatedPost.commentsCount || 0,
          sharedPostId: updatedPost.sharedPostId || null,
        };

        setPosts((prev) =>
          prev.map((p) => (p.id === postId ? postToImport : p)),
        );
      }
    } catch (error) {
      showToast(error?.message || "Unable to update reaction.", "error");
      // Revert on error
      loadPosts();
    }
  };

  const handleComment = async (postId) => {
    // Comment count is updated by CommentSection component
    // No full reload needed
  };

  const handleShare = async (postId) => {
    try {
      const sharedPost = await sharePost(postId, "");
      setPosts((prev) => [sharedPost, ...prev]);
      showToast("Post shared.", "success");
    } catch (error) {
      showToast(error?.message || "Could not share post.", "error");
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId);
      setPosts((prev) => prev.filter((item) => item.id !== postId));
      showToast("Post deleted.", "success");
    } catch (error) {
      showToast(error?.message || "Unable to delete post.", "error");
    }
  };

  const handleOpenProfile = (author) => {
    const memberId = author?.id || author?._id || author?.uid;
    if (!memberId) {
      showToast("Profile is unavailable for this post uploader.", "error");
      return;
    }
    navigate(`${roleBasePath}/connections/${memberId}`);
  };

  return (
    <div className="space-y-6">
      <Card className="banner-surface bg-gradient-to-r from-primary via-primary-light to-accent text-white">
        <p className="text-small font-semibold uppercase tracking-wide text-white/80">
          Community Feed
        </p>
        <h2 className="text-white">Community Hub</h2>
        <p className="mt-2 text-white/90">
          Share your thoughts, ask questions, and connect with the community.
        </p>
      </Card>

      <MotionReveal delay={50} y={14}>
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {communityStats.map((stat) => (
            <Card
              key={stat.label}
              className="card-hover-strong border-0 bg-gradient-to-br from-white to-slate-50 p-5">
              <p className="text-small text-neutral">{stat.label}</p>
              <p className="mt-2 text-h3 text-primary">{stat.value}</p>
            </Card>
          ))}
        </section>
      </MotionReveal>

      <MotionReveal delay={130} y={16}>
        <div className="max-w-2xl mx-auto w-full">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/20 font-semibold text-primary">
                {(user?.displayName || user?.email)?.charAt(0).toUpperCase()}
              </div>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex-1 rounded-full border border-border bg-neutral-light px-4 py-2 text-left text-neutral transition-colors hover:bg-neutral-light/80">
                What&apos;s on your mind,{" "}
                {user?.displayName?.split(" ")[0] || "there"}?
              </button>
            </div>

            <div className="mt-4 flex gap-2 border-t border-border pt-3">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-small font-semibold text-primary transition-colors hover:bg-primary/5">
                <FontAwesomeIcon icon={faCamera} />
                Photo
              </button>
              <Button
                size="sm"
                variant="primary"
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2">
                <FontAwesomeIcon icon={faPenToSquare} />
                Post
              </Button>
            </div>
          </Card>
        </div>
      </MotionReveal>

      <div className="max-w-2xl mx-auto w-full space-y-4">
        {isLoading ? (
          <div className="py-12 text-center">
            <p className="text-neutral">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <EmptyState
            title="No posts yet"
            description="Be the first to share something with the community!"
            action={
              <Button
                variant="primary"
                className="inline-flex items-center gap-2"
                onClick={() => setIsCreateModalOpen(true)}>
                <FontAwesomeIcon icon={faEdit} />
                Create a post
              </Button>
            }
          />
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onOpenProfile={handleOpenProfile}
              onReact={handleReact}
              onComment={handleComment}
              onShare={handleShare}
              onDelete={handleDeletePost}
            />
          ))
        )}
      </div>

      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePost}
      />
    </div>
  );
}
