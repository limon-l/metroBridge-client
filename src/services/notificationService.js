import apiClient from "./apiClient";

const normalizeUser = (user) => ({
  id: user?._id || user?.id,
  fullName: user?.fullName || "Unknown",
  role: user?.role || "student",
});

const normalizeNotification = (notification) => ({
  id: notification?._id || notification?.id,
  recipient: notification?.recipient?._id || notification?.recipient || null,
  actor: notification?.actor ? normalizeUser(notification.actor) : null,
  type: notification?.type || "system",
  title: notification?.title || "Notification",
  message: notification?.message || "",
  entityType: notification?.entityType || null,
  entityId: notification?.entityId || null,
  isRead: Boolean(notification?.isRead),
  readAt: notification?.readAt || null,
  createdAt: notification?.createdAt || new Date().toISOString(),
});

export async function fetchNotifications(params = {}) {
  const response = await apiClient.get("/notifications", { params });
  return {
    items: (response.data?.data || []).map(normalizeNotification),
    meta: response.data?.meta || {},
  };
}

export async function markNotificationRead(notificationId) {
  const response = await apiClient.patch(
    `/notifications/${notificationId}/read`,
  );
  return normalizeNotification(response.data?.data || {});
}

export async function markAllNotificationsRead() {
  await apiClient.patch("/notifications/read-all");
}
