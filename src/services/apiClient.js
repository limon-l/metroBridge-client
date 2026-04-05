import axios from "axios";

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL;
const defaultBaseUrl = import.meta.env.PROD
  ? "https://metrobridge-server.onrender.com/api"
  : "http://localhost:5000/api";

const resolvedBaseUrl = String(configuredBaseUrl || defaultBaseUrl).replace(
  /\/$/,
  "",
);

const apiClient = axios.create({
  baseURL: resolvedBaseUrl,
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("metrobridge_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Unexpected API error";

    return Promise.reject(new Error(message));
  },
);

export default apiClient;
