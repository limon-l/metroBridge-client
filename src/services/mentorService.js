import apiClient from "./apiClient";

export async function fetchMentors() {
  const response = await apiClient.get("/mentors");
  return response.data;
}
