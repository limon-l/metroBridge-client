import { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import PostCard from "../components/feed/PostCard";
import CreatePostModal from "../components/feed/CreatePostModal";
import EmptyState from "../components/ui/EmptyState";
import { useAuth } from "../hooks/useAuth";

export default function FeedPage({ role }) {
  const [posts, setPosts] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Load posts from localStorage (mock data for now)
  useEffect(() => {
    const savedPosts = localStorage.getItem("posts");
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }
    setIsLoading(false);
  }, []);

  // Save posts to localStorage
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

    const updatedPosts = [newPost, ...posts];
    savePosts(updatedPosts);
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

    // Save to localStorage
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

    // Save to localStorage
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

    // Create a shared/reposted version
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

    const updatedPosts = [sharedPost, ...posts];
    savePosts(updatedPosts);
  };

  const handleDeletePost = async (postId) => {
    const updatedPosts = posts.filter((p) => p.id !== postId);
    savePosts(updatedPosts);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-primary to-primary-light text-white">
        <p className="text-small font-semibold uppercase tracking-wide text-white/80">
          Community Feed
        </p>
        <h2 className="text-white">Community Hub</h2>
        <p className="mt-2 text-white/90">
          Share your thoughts, ask questions, and connect with the community.
        </p>
      </Card>

      {/* Create Post Section */}
      <div className="max-w-2xl mx-auto w-full">
        <Card className="p-4">
          <div className="flex gap-3 items-center">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center font-semibold text-primary flex-shrink-0">
              {(user?.displayName || user?.email)?.charAt(0).toUpperCase()}
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex-1 px-4 py-2 rounded-full border border-border bg-neutral-light hover:bg-neutral-light/80 text-neutral transition-colors text-left">
              What's on your mind, {user?.displayName?.split(" ")[0] || "there"}
              ?
            </button>
          </div>

          <div className="mt-4 flex gap-2 border-t border-border pt-3">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 py-2 text-primary hover:bg-primary/5 rounded-lg transition-colors text-small font-semibold">
              <span>📷</span>
              Photo
            </button>
            <Button
              size="sm"
              variant="primary"
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2">
              <span>✏️</span>
              Post
            </Button>
          </div>
        </Card>
      </div>

      {/* Posts Feed */}
      <div className="max-w-2xl mx-auto w-full space-y-4">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-neutral">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <EmptyState
            icon="📝"
            title="No posts yet"
            description="Be the first to share something with the community!"
            action={
              <Button
                variant="primary"
                onClick={() => setIsCreateModalOpen(true)}>
                Create a post
              </Button>
            }
          />
        ) : (
          posts.map((post) => (
            <div key={post.id}>
              {/* Repost indicator */}
              {post.sharedPost && (
                <div className="flex items-center gap-2 text-small text-neutral mb-2 ml-4">
                  <span>🔄</span>
                  <span>
                    {post.author?.name} shared {post.sharedPost.author?.name}'s
                    post
                  </span>
                </div>
              )}

              <PostCard
                post={post.sharedPost || post}
                onReact={handleReact}
                onComment={handleComment}
                onShare={handleShare}
                onDelete={handleDeletePost}
              />
            </div>
          ))
        )}
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePost}
      />
    </div>
  );
}
