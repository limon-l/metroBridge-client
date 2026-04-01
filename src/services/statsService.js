import apiClient from "./apiClient";

export async function fetchOverviewStats() {
  const response = await apiClient.get("/stats/overview");
  return response.data?.data || {};
}
