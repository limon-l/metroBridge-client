import axios from "axios";

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL;
const defaultBaseUrl = import.meta.env.PROD
  ? "https://metrobridge-server.onrender.com/api"
  : "http://localhost:5000/api";

const resolvedBaseUrl = String(configuredBaseUrl || defaultBaseUrl).replace(
  /\/$/,
  "",
);

const DEFAULT_TIMEOUT_MS = 20000;
const AUTH_TIMEOUT_MS = 30000;
const MAX_RETRIES = 2;
const RETRYABLE_STATUSES = new Set([408, 425, 429, 500, 502, 503, 504]);
const AUTH_PATH_PATTERN = /\/auth\/(login|register|forgot-password|reset-password)$/;

const sleep = (delayMs) => new Promise((resolve) => setTimeout(resolve, delayMs));

const isRetryableError = (error, config) => {
  const method = String(config?.method || "get").toLowerCase();
  const url = String(config?.url || "");
  const isSafeMethod = ["get", "head", "options"].includes(method);
  const isAuthMutation = method === "post" && AUTH_PATH_PATTERN.test(url);

  if (!isSafeMethod && !isAuthMutation) {
    return false;
  }

  if (error?.code === "ECONNABORTED" || error?.code === "ERR_NETWORK") {
    return true;
  }

  const status = error?.response?.status;
  return Boolean(status && RETRYABLE_STATUSES.has(status));
};

const apiClient = axios.create({
  baseURL: resolvedBaseUrl,
  timeout: DEFAULT_TIMEOUT_MS,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("metrobridge_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const method = String(config.method || "get").toLowerCase();
  const url = String(config.url || "");
  const isAuthRequest = method === "post" && AUTH_PATH_PATTERN.test(url);
  config.timeout = isAuthRequest
    ? AUTH_TIMEOUT_MS
    : config.timeout || DEFAULT_TIMEOUT_MS;

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error?.config;
    const retryCount = config?.__retryCount || 0;

    if (config && retryCount < MAX_RETRIES && isRetryableError(error, config)) {
      config.__retryCount = retryCount + 1;

      const delayMs = 500 * 2 ** retryCount;
      await sleep(delayMs);
      return apiClient.request(config);
    }

    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Unexpected API error";

    return Promise.reject(new Error(message));
  },
);

export default apiClient;
