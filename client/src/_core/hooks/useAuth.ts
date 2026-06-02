import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { TRPCClientError } from "@trpc/client";
import { useCallback, useEffect, useMemo } from "react";
import { setClerkToken, clearClerkToken } from "@/lib/clerk-auth";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath = getLoginUrl() } =
    options ?? {};
  const utils = trpc.useUtils();

  // Try to get Clerk auth state, but handle case where ClerkProvider is not available
  let clerkLoaded = true;
  let isSignedIn = false;
  let getToken: (() => Promise<string | null>) | null = null;

  try {
    // Safely try to use Clerk hook
    // This will fail gracefully if ClerkProvider is not available
    const useClerkAuth = require("@clerk/clerk-react").useAuth;
    if (useClerkAuth && typeof useClerkAuth === "function") {
      try {
        const clerkAuth = useClerkAuth();
        if (clerkAuth) {
          clerkLoaded = clerkAuth.isLoaded ?? true;
          isSignedIn = clerkAuth.isSignedIn ?? false;
          getToken = clerkAuth.getToken ?? null;
        }
      } catch (hookError) {
        // useAuth hook failed (likely no ClerkProvider), continue without Clerk
        console.warn("[Auth] Clerk hook not available, using Manus OAuth only");
      }
    }
  } catch (error) {
    // Clerk module not available or other error, continue without Clerk
    console.warn("[Auth] Clerk not available, using Manus OAuth only");
  }

  const meQuery = trpc.auth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      utils.auth.me.setData(undefined, null);
      clearClerkToken();
    },
  });

  // Update Clerk token when user signs in
  useEffect(() => {
    if (clerkLoaded && isSignedIn && getToken) {
      getToken()
        .then((token) => {
          if (token) {
            setClerkToken(token);
            // Refetch auth data with new token
            meQuery.refetch();
          }
        })
        .catch((error) => {
          console.warn("[Clerk] Failed to get token:", error);
        });
    }
  }, [clerkLoaded, isSignedIn, getToken]);

  const logout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error: unknown) {
      if (
        error instanceof TRPCClientError &&
        error.data?.code === "UNAUTHORIZED"
      ) {
        clearClerkToken();
        return;
      }
      throw error;
    } finally {
      utils.auth.me.setData(undefined, null);
      await utils.auth.me.invalidate();
      clearClerkToken();
    }
  }, [logoutMutation, utils]);

  const state = useMemo(() => {
    localStorage.setItem(
      "manus-runtime-user-info",
      JSON.stringify(meQuery.data)
    );
    return {
      user: meQuery.data ?? null,
      loading: meQuery.isLoading || logoutMutation.isPending || !clerkLoaded,
      error: meQuery.error ?? logoutMutation.error ?? null,
      isAuthenticated: Boolean(meQuery.data),
    };
  }, [
    meQuery.data,
    meQuery.error,
    meQuery.isLoading,
    logoutMutation.error,
    logoutMutation.isPending,
    clerkLoaded,
  ]);

  useEffect(() => {
    if (!redirectOnUnauthenticated) return;
    if (meQuery.isLoading || logoutMutation.isPending || !clerkLoaded) return;
    if (state.user) return;
    if (typeof window === "undefined") return;
    if (window.location.pathname === redirectPath) return;

    window.location.href = redirectPath;
  }, [
    redirectOnUnauthenticated,
    redirectPath,
    logoutMutation.isPending,
    meQuery.isLoading,
    state.user,
    clerkLoaded,
  ]);

  return {
    ...state,
    refresh: () => meQuery.refetch(),
    logout,
  };
}
