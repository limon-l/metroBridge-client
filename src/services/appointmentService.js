import apiClient from "./apiClient";

export async function fetchAppointments(params = {}) {
  const response = await apiClient.get("/appointments", { params });
  return response.data?.data || [];
}

export async function createAppointment(payload) {
  const response = await apiClient.post("/appointments", payload);
  return response.data?.data;
}

export async function updateAppointmentStatus(appointmentId, payload) {
  const response = await apiClient.patch(
    `/appointments/${appointmentId}/status`,
    payload,
  );
  return response.data?.data;
}
