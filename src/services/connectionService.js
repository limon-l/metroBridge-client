import apiClient from "./apiClient";

export async function fetchMemberDirectory(filters = {}) {
  const response = await apiClient.get("/connections/members", {
    params: filters,
  });
  return response.data?.data || [];
}

export async function sendConnectionRequest(recipientId) {
  const response = await apiClient.post("/connections/requests", {
    recipientId,
  });
  return response.data?.data;
}

export async function fetchConnectionRequests(filters = {}) {
  const response = await apiClient.get("/connections/requests", {
    params: filters,
  });
  return response.data?.data || [];
}

export async function respondConnectionRequest(requestId, action) {
  const response = await apiClient.patch(
    `/connections/requests/${requestId}/respond`,
    { action },
  );
  return response.data?.data;
}

export async function cancelConnectionRequest(requestId) {
  const response = await apiClient.delete(`/connections/requests/${requestId}`);
  return response.data?.data;
}

export async function fetchMemberProfile(memberId) {
  const response = await apiClient.get(
    `/connections/members/${memberId}/profile`,
  );
  return response.data?.data;
}

export async function disconnectMember(memberId) {
  const response = await apiClient.delete(
    `/connections/members/${memberId}/connection`,
  );
  return response.data;
}

export async function reportMember(memberId, reason) {
  const response = await apiClient.post(
    `/connections/members/${memberId}/report`,
    {
      reason,
    },
  );
  return response.data;
}

export async function fetchModerationReports(filters = {}) {
  const response = await apiClient.get("/connections/reports", {
    params: filters,
  });
  return {
    reports: response.data?.data || [],
    meta: response.data?.meta || {},
  };
}

export async function reviewModerationReport(reportId, payload) {
  const response = await apiClient.patch(
    `/connections/reports/${reportId}/review`,
    payload,
  );
  return response.data?.data;
}
