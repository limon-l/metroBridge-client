import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import PostCard from "../components/feed/PostCard";
import CreatePostModal from "../components/feed/CreatePostModal";
import EmptyState from "../components/ui/EmptyState";
import MotionReveal from "../components/ui/MotionReveal";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faEdit,
  faPenToSquare,
  faRepeat,
} from "@fortawesome/free-solid-svg-icons";

export default function FeedPage({ role }) {
  const navigate = useNavigate();
  const [posts, setPosts] = useState(() => {
    try {
      const savedPosts = localStorage.getItem("posts");
      return savedPosts ? JSON.parse(savedPosts) : [];
    } catch {
      return [];
    }
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading] = useState(false);
  const { user } = useAuth();
  const { showToast } = useToast();
  const roleBasePath =
    role === "mentor" ? "/mentor" : role === "admin" ? "/admin" : "/student";

  const savePosts = (updatedPosts) => {
    localStorage.setItem("posts", JSON.stringify(updatedPosts));
    setPosts(updatedPosts);
  };

  const handleCreatePost = async (postData) => {
    const newPost = {
      id: Date.now().toString(),
      ...postData,
      reactions: {},
      comments: [],
      shares: [],
      userReaction: null,
    };

    savePosts([newPost, ...posts]);
  };

  const handleReact = (postId, reaction) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            userReaction: reaction,
            reactions: {
              ...post.reactions,
              [user?.uid]: reaction,
            },
          };
        }
        return post;
      }),
    );

    savePosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            userReaction: reaction,
            reactions: {
              ...post.reactions,
              [user?.uid]: reaction,
            },
          };
        }
        return post;
      }),
    );
  };

  const handleComment = async (commentData) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === commentData.postId) {
          return {
            ...post,
            comments: [
              ...(post.comments || []),
              {
                id: Date.now().toString(),
                ...commentData,
              },
            ],
          };
        }
        return post;
      }),
    );

    savePosts(
      posts.map((post) => {
        if (post.id === commentData.postId) {
          return {
            ...post,
            comments: [
              ...(post.comments || []),
              {
                id: Date.now().toString(),
                ...commentData,
              },
            ],
          };
        }
        return post;
      }),
    );
  };

  const handleShare = (postId) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    const sharedPost = {
      id: Date.now().toString(),
      content: `Shared from ${post.author?.name}`,
      sharedPost: { ...post },
      author: {
        id: user?.uid,
        name: user?.displayName || user?.email?.split("@")[0],
        avatar: user?.photoURL,
      },
      createdAt: new Date().toISOString(),
      reactions: {},
      comments: [],
      shares: [],
      userReaction: null,
    };

    savePosts([sharedPost, ...posts]);
  };

  const handleDeletePost = async (postId) => {
    savePosts(posts.filter((p) => p.id !== postId));
  };

  const resolveAuthorId = (author) => author?.id || author?._id || author?.uid;

  const isValidMongoId = (value) => /^[a-f\d]{24}$/i.test(String(value || ""));

  const communityStats = useMemo(() => {
    const totalComments = posts.reduce(
      (sum, post) => sum + Number(post.comments?.length || 0),
      0,
    );
    const totalShares = posts.reduce(
      (sum, post) => sum + Number(post.shares?.length || 0),
      0,
    );
    const uniqueAuthors = new Set(
      posts.map((post) => post.author?.name).filter(Boolean),
    ).size;

    return [
      { label: "Posts", value: posts.length },
      { label: "Comments", value: totalComments },
      { label: "Shares", value: totalShares },
      { label: "Active authors", value: uniqueAuthors },
    ];
  }, [posts]);

  const handleOpenProfile = (author) => {
    const memberId = resolveAuthorId(author);
    if (!memberId || !isValidMongoId(memberId)) {
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

      <MotionReveal delay={90} y={16}>
        <Card className="card-hover-strong border-primary/10 bg-gradient-to-r from-primary/5 via-white to-accent/5">
          <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div>
              <p className="text-small font-semibold uppercase tracking-wide text-primary">
                Community spotlight
              </p>
              <h3 className="mt-2">Keep the feed active and constructive</h3>
              <p className="mt-2 text-small text-neutral">
                Posts, reactions, and shares are surfaced in a cleaner section
                so members can see momentum at a glance.
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
              {["Ask a question", "Share a resource", "Support a peer"].map(
                (item) => (
                  <div
                    key={item}
                    className="rounded-card border border-primary/10 bg-white px-3 py-2 text-small font-semibold text-primary transition-transform duration-200 hover:-translate-y-0.5">
                    {item}
                  </div>
                ),
              )}
            </div>
          </div>
        </Card>
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
            <div key={post.id}>
              {post.sharedPost && (
                <div className="mb-2 ml-4 flex items-center gap-2 text-small text-neutral">
                  <FontAwesomeIcon icon={faRepeat} />
                  <span>
                    <button
                      type="button"
                      onClick={() => handleOpenProfile(post.author)}
                      className="font-semibold text-primary underline-offset-2 hover:underline disabled:cursor-default disabled:text-neutral"
                      disabled={!isValidMongoId(resolveAuthorId(post.author))}>
                      {post.author?.name || "Someone"}
                    </button>{" "}
                    shared{" "}
                    <button
                      type="button"
                      onClick={() => handleOpenProfile(post.sharedPost?.author)}
                      className="font-semibold text-primary underline-offset-2 hover:underline disabled:cursor-default disabled:text-neutral"
                      disabled={
                        !isValidMongoId(
                          resolveAuthorId(post.sharedPost?.author),
                        )
                      }>
                      {post.sharedPost?.author?.name || "a member"}
                    </button>{" "}
                    &apos;s post
                  </span>
                </div>
              )}

              <PostCard
                post={post.sharedPost || post}
                onOpenProfile={handleOpenProfile}
                onReact={handleReact}
                onComment={handleComment}
                onShare={handleShare}
                onDelete={handleDeletePost}
              />
            </div>
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
