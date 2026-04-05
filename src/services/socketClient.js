import { io } from "socket.io-client";

let socket = null;
let currentToken = null;

const getSocketOrigin = () => {
  const apiBase =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  try {
    return new URL(apiBase).origin;
  } catch {
    return apiBase.replace(/\/api\/?$/, "");
  }
};

export function connectMessageSocket(token) {
  if (!token) {
    return null;
  }

  if (socket && currentToken === token) {
    return socket;
  }

  if (socket) {
    socket.disconnect();
  }

  currentToken = token;
  socket = io(getSocketOrigin(), {
    auth: { token },
    transports: ["websocket", "polling"],
    withCredentials: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });

  return socket;
}

export function getMessageSocket() {
  return socket;
}

export function disconnectMessageSocket() {
  if (socket) {
    socket.disconnect();
  }

  socket = null;
  currentToken = null;
}
