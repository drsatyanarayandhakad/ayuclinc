import { useAuth, useUser, useSignIn, useSignUp } from "@clerk/clerk-react";

/**
 * Hook to get Clerk authentication state and methods
 */
export function useClerkAuthentication() {
  const { isLoaded, isSignedIn, sessionId, getToken } = useAuth();
  const { user } = useUser();
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();

  return {
    isLoaded,
    isSignedIn,
    user,
    sessionId,
    getToken,
    signIn,
    signUp,
  };
}

/**
 * Get Clerk token for API requests
 */
export async function getClerkToken(): Promise<string | null> {
  try {
    const token = localStorage.getItem("clerk-token");
    return token;
  } catch (error) {
    console.error("[Clerk] Failed to get token:", error);
    return null;
  }
}

/**
 * Store Clerk token in localStorage
 */
export function setClerkToken(token: string): void {
  try {
    localStorage.setItem("clerk-token", token);
  } catch (error) {
    console.error("[Clerk] Failed to store token:", error);
  }
}

/**
 * Clear Clerk token from localStorage
 */
export function clearClerkToken(): void {
  try {
    localStorage.removeItem("clerk-token");
  } catch (error) {
    console.error("[Clerk] Failed to clear token:", error);
  }
}
