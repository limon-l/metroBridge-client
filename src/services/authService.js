import apiClient from "./apiClient";

const normalizeUser = (raw) => ({
  id: raw?.id || raw?._id,
  uid: raw?.id || raw?._id,
  fullName: raw?.fullName || "",
  displayName: raw?.fullName || "",
  email: raw?.email || "",
  role: raw?.role || "student",
  department: raw?.department || "",
});

export async function loginWithBackend(payload) {
  const response = await apiClient.post("/auth/login", payload);
  return {
    token: response.data?.data?.token,
    user: normalizeUser(response.data?.data?.user || {}),
  };
}

export async function signupWithBackend(payload) {
  const response = await apiClient.post("/auth/register", payload);
  return {
    token: response.data?.data?.token,
    user: normalizeUser(response.data?.data?.user || {}),
  };
}

export async function getCurrentUser() {
  const response = await apiClient.get("/auth/me");
  return normalizeUser(response.data?.data || {});
}

export async function requestPasswordReset(email) {
  const response = await apiClient.post("/auth/forgot-password", { email });
  return response.data?.data || {};
}

export async function submitPasswordReset(token, password) {
  const response = await apiClient.post("/auth/reset-password", {
    token,
    password,
  });
  return response.data;
}
