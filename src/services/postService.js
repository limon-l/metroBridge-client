import apiClient from "./apiClient";

const normalizeAuthor = (author) => ({
  id: author?._id || author?.id,
  name: author?.fullName || author?.name || "Unknown",
  role: author?.role || "student",
  department: author?.department || "",
});

const normalizePost = (post) => ({
  id: post?._id || post?.id,
  content: post?.content || "",
  mediaUrl: post?.mediaUrl || "",
  mediaName: post?.mediaName || "",
  mediaType: post?.mediaType || "",
  createdAt: post?.createdAt || new Date().toISOString(),
  author: normalizeAuthor(post?.author),
  reactions: post?.reactionCounts || {},
  userReaction: post?.userReaction || null,
  commentsCount: post?.commentsCount || 0,
  sharedPostId: post?.sharedPostId || null,
  sharedPost: post?.sharedPostId ? normalizePost(post.sharedPostId) : null,
});

const normalizeComment = (comment) => ({
  id: comment?._id || comment?.id,
  text: comment?.content || comment?.text || "",
  createdAt: comment?.createdAt || new Date().toISOString(),
  author: normalizeAuthor(comment?.author),
});

const normalizeReactionUser = (item) => ({
  type: item?.type || "like",
  user: {
    id: item?.user?.id || item?.user?._id,
    name: item?.user?.fullName || "Unknown",
    role: item?.user?.role || "student",
    department: item?.user?.department || "",
  },
});

export async function fetchPosts(params = {}) {
  const response = await apiClient.get("/posts", { params });
  return (response.data?.data || []).map(normalizePost);
}

export async function createPost(payload) {
  const response = await apiClient.post("/posts", payload);
  return normalizePost(response.data?.data || {});
}

export async function sharePost(postId, sharedContent = "") {
  const response = await apiClient.post("/posts", {
    content: sharedContent,
    sharedPostId: postId,
  });
  return normalizePost(response.data?.data || {});
}

export async function deletePost(postId) {
  await apiClient.delete(`/posts/${postId}`);
}

export async function reactToPost(postId, type) {
  const response = await apiClient.post(`/posts/${postId}/reactions`, {
    type,
  });
  return response.data?.data || {};
}

export async function removePostReaction(postId) {
  const response = await apiClient.delete(`/posts/${postId}/reactions`);
  return response.data?.data || {};
}

export async function fetchPostReactions(postId) {
  const response = await apiClient.get(`/posts/${postId}/reactions`);
  return {
    total: Number(response.data?.data?.total || 0),
    counts: response.data?.data?.counts || {},
    items: (response.data?.data?.items || []).map(normalizeReactionUser),
  };
}

export async function fetchCommentsByPost(postId) {
  const response = await apiClient.get(`/posts/${postId}/comments`);
  return (response.data?.data || []).map(normalizeComment);
}

export async function addCommentToPost(postId, content) {
  const response = await apiClient.post(`/posts/${postId}/comments`, {
    content,
  });
  return normalizeComment(response.data?.data || {});
}
