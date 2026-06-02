import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";

interface ClerkContextType {
  isLoaded: boolean;
  isSignedIn: boolean;
  user: any;
  sessionId: string | null;
  getToken: () => Promise<string | null>;
}

const ClerkContext = createContext<ClerkContextType | undefined>(undefined);

export function ClerkProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, sessionId, getToken } = useAuth();
  const { user } = useUser();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (isSignedIn && sessionId) {
      getToken().then(setToken);
    }
  }, [isSignedIn, sessionId, getToken]);

  return (
    <ClerkContext.Provider
      value={{
        isLoaded: isLoaded ?? false,
        isSignedIn: isSignedIn ?? false,
        user,
        sessionId: sessionId ?? null,
        getToken,
      }}
    >
      {children}
    </ClerkContext.Provider>
  );
}

export function useClerkContext() {
  const context = useContext(ClerkContext);
  if (!context) {
    throw new Error("useClerkContext must be used within ClerkProvider");
  }
  return context;
}
