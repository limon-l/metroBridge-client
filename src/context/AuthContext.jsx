import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { useEffect, useMemo, useState } from "react";
import { AuthContext } from "./authContextObject";
import { auth } from "../services/firebase";

const getEmailsFromEnv = (envValue) => {
  if (!envValue) return [];
  return envValue
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
};

const resolveRoleFromEmail = (email) => {
  if (!email) return "student";

  const emailLower = email.toLowerCase();
  const adminEmails = getEmailsFromEnv(import.meta.env.VITE_ADMIN_EMAILS);
  const mentorEmails = getEmailsFromEnv(import.meta.env.VITE_MENTOR_EMAILS);

  if (adminEmails.includes(emailLower)) return "admin";
  if (mentorEmails.includes(emailLower)) return "mentor";
  return "student";
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setRole(resolveRoleFromEmail(firebaseUser?.email));
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async ({ email, password, fullName }) => {
    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    if (fullName) {
      await updateProfile(credential.user, { displayName: fullName });
    }

    return credential.user;
  };

  const login = async ({ email, password }) => {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return credential.user;
  };

  const logout = async () => {
    await signOut(auth);
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
