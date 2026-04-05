import apiClient from "./apiClient";

const normalizeConversation = (item) => ({
  id: item?._id || item?.id,
  participants: (item?.participants || []).map((participant) => ({
    id: participant?._id || participant?.id,
    name: participant?.fullName || participant?.name || "Unknown",
  })),
  lastMessage: item?.lastMessage || "",
  lastMessageTime:
    item?.lastMessageAt || item?.updatedAt || new Date().toISOString(),
  unreadCount: 0,
});

const normalizeMessage = (message) => ({
  id: message?._id || message?.id,
  senderId: message?.sender?._id || message?.senderId,
  senderName: message?.sender?.fullName || message?.senderName || "Unknown",
  text: message?.content || message?.text || "",
  mediaUrl: message?.mediaUrl || "",
  mediaType: message?.mediaType || "",
  timestamp:
    message?.createdAt || message?.timestamp || new Date().toISOString(),
});

export async function fetchConversations() {
  const response = await apiClient.get("/conversations");
  return (response.data?.data || []).map(normalizeConversation);
}

export async function fetchMessages(conversationId) {
  const response = await apiClient.get(
    `/conversations/${conversationId}/messages`,
  );
  return (response.data?.data || []).map(normalizeMessage);
}

export async function sendConversationMessage(conversationId, content) {
  const response = await apiClient.post(
    `/conversations/${conversationId}/messages`,
    content,
  );
  return normalizeMessage(response.data?.data || {});
}

export async function createConversation(participantId) {
  const response = await apiClient.post("/conversations", { participantId });
  return normalizeConversation(response.data?.data || {});
}
