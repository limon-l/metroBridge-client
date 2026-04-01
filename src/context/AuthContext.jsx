import { useEffect, useMemo, useState } from "react";
import { AuthContext } from "./authContextObject";
import {
  getCurrentUser,
  loginWithBackend,
  signupWithBackend,
} from "../services/authService";

const TOKEN_KEY = "metrobridge_token";
const AUTH_CACHE_KEY = "metrobridge_auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("student");
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
          setUser(parsed.user || null);
          setRole(parsed.role || "student");
        } catch {
          localStorage.removeItem(AUTH_CACHE_KEY);
        }
      }

      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        setRole(currentUser.role || "student");
        localStorage.setItem(
          AUTH_CACHE_KEY,
          JSON.stringify({
            user: currentUser,
            role: currentUser.role || "student",
          }),
        );
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(AUTH_CACHE_KEY);
        setUser(null);
        setRole("student");
      } finally {
        setLoading(false);
      }
    };

    restore();

    return () => {
      setLoading(false);
    };
  }, []);

  const applyAuthState = ({ token, user: userData }) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(
      AUTH_CACHE_KEY,
      JSON.stringify({ user: userData, role: userData.role || "student" }),
    );
    setUser(userData);
    setRole(userData.role || "student");
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
    setUser(null);
    setRole("student");
  };

  const value = useMemo(
    () => ({
      user,
      role,
      loading,
      signup,
      login,
      logout,
    }),
    [user, role, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
