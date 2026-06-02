import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";
import { authenticateClerkRequest } from "../clerk-middleware";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    // Try Clerk authentication first (if Authorization header is present)
    const authHeader = opts.req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        user = await authenticateClerkRequest(opts.req);
      } catch (clerkError) {
        console.warn("[Auth] Clerk authentication failed, trying Manus OAuth:", clerkError);
        // Fall through to Manus OAuth
      }
    }

    // Fall back to Manus OAuth if Clerk didn't work
    if (!user) {
      user = await sdk.authenticateRequest(opts.req);
    }
  } catch (error) {
    // Authentication is optional for public procedures.
    console.warn("[Auth] Both authentication methods failed:", error);
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
