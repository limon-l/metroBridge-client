import apiClient from "./apiClient";

export async function fetchPendingUsers(role) {
  const response = await apiClient.get("/users/pending", {
    params: role ? { role } : {},
  });
  return response.data?.data || [];
}

export async function reviewUser(userId, action, note = "") {
  const response = await apiClient.patch(`/users/${userId}/review`, {
    action,
    note,
  });
  return response.data?.data;
}

export async function fetchUserDetails(userId) {
  const response = await apiClient.get(`/users/${userId}`);
  return response.data?.data;
}

export async function fetchApprovedUsers(filters = {}) {
  const response = await apiClient.get("/users/approved", {
    params: filters,
  });
  return response.data?.data || [];
}
