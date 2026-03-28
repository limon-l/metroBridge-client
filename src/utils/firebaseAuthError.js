const AUTH_ERROR_MESSAGES = {
  "auth/email-already-in-use":
    "This email is already registered. Please login instead.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/weak-password": "Password must be at least 6 characters.",
  "auth/invalid-credential": "Invalid email or password.",
  "auth/user-not-found": "No account found with this email.",
  "auth/wrong-password": "Invalid email or password.",
  "auth/too-many-requests": "Too many attempts. Please try again later.",
  "auth/network-request-failed":
    "Network error. Check your internet connection and try again.",
  "auth/operation-not-allowed":
    "Email/Password sign-in is disabled in Firebase. Enable it from Firebase Console > Authentication > Sign-in method.",
  "auth/configuration-not-found":
    "Firebase auth configuration is missing. Verify your .env Firebase values.",
  "auth/api-key-not-valid":
    "Firebase API key is invalid. Check VITE_FIREBASE_API_KEY in .env.",
};

export function getFirebaseAuthErrorMessage(error, fallbackMessage) {
  const errorCode = error?.code;
  if (errorCode && AUTH_ERROR_MESSAGES[errorCode]) {
    return AUTH_ERROR_MESSAGES[errorCode];
  }

  return fallbackMessage;
}
