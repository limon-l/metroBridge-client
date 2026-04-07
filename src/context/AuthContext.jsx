import { useEffect, useMemo, useState } from "react";
import { AuthContext } from "./authContextObject";
import {
  getCurrentUser,
  loginWithBackend,
  signupWithBackend,
} from "../services/authService";
import {
  connectMessageSocket,
  disconnectMessageSocket,
} from "../services/socketClient";

const TOKEN_KEY = "metrobridge_token";
const AUTH_CACHE_KEY = "metrobridge_auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restore = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      const cached = localStorage.getItem(AUTH_CACHE_KEY);

      if (!token) {
        setLoading(false);
        return;
      }

      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          const cachedUser = parsed?.user || null;
          if (cachedUser?.role) {
            setUser(cachedUser);
          }
        } catch {
          localStorage.removeItem(AUTH_CACHE_KEY);
        }
      }

      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        connectMessageSocket(token);
        localStorage.setItem(
          AUTH_CACHE_KEY,
          JSON.stringify({
            user: currentUser,
          }),
        );
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(AUTH_CACHE_KEY);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restore();
  }, []);

  const applyAuthState = ({ token, user: userData }) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(AUTH_CACHE_KEY, JSON.stringify({ user: userData }));
    setUser(userData);
    connectMessageSocket(token);
  };

  const signup = async (payload) => {
    const authResult = await signupWithBackend(payload);
    applyAuthState(authResult);
    return authResult.user;
  };

  const login = async ({ email, password }) => {
    const authResult = await loginWithBackend({ email, password });
    applyAuthState(authResult);
    return authResult.user;
  };

  const logout = async () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(AUTH_CACHE_KEY);
    disconnectMessageSocket();
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      role: user?.role || null,
      loading,
      signup,
      login,
      logout,
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
