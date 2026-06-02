import { clerkClient, verifyToken } from "@clerk/clerk-sdk-node";
import type { Request } from "express";
import * as db from "./db";
import type { User } from "../drizzle/schema";

/**
 * Verify Clerk session token from Authorization header
 * @param token - Bearer token from Authorization header
 */
export async function verifyClerkSessionToken(token: string): Promise<any> {
  try {
    if (!token.startsWith("Bearer ")) {
      throw new Error("Invalid token format");
    }

    const sessionToken = token.replace("Bearer ", "");
    
    // Verify the token with Clerk
    const decoded = await verifyToken(sessionToken, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    return decoded;
  } catch (error) {
    console.error("[Clerk] Token verification failed:", error);
    throw error;
  }
}

/**
 * Get or create user from Clerk session
 * @param clerkUserId - Clerk user ID
 * @param email - User email
 * @param name - User name
 */
export async function getOrCreateUserFromClerk(
  clerkUserId: string,
  email?: string,
  name?: string
): Promise<User> {
  try {
    // Check if user exists in database
    let user = await db.getUserByOpenId(clerkUserId);

    if (!user) {
      // Create new user in database
      await db.upsertUser({
        openId: clerkUserId,
        email: email || null,
        name: name || null,
        loginMethod: "clerk",
        lastSignedIn: new Date(),
      });

      user = await db.getUserByOpenId(clerkUserId);
      if (!user) {
        throw new Error("Failed to create user");
      }
    } else {
      // Update last signed in
      await db.upsertUser({
        openId: clerkUserId,
        lastSignedIn: new Date(),
      });
    }

    return user;
  } catch (error) {
    console.error("[Clerk] Failed to get or create user:", error);
    throw error;
  }
}

/**
 * Authenticate request using Clerk token
 * @param req - Express request
 */
export async function authenticateClerkRequest(req: Request): Promise<User> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    // Verify the token
    const decoded = await verifyClerkSessionToken(authHeader);

    if (!decoded.sub) {
      throw new Error("Invalid token: missing subject");
    }

    // Get Clerk user details
    const clerkUser = await clerkClient.users.getUser(decoded.sub);

    // Get or create user in database
    const user = await getOrCreateUserFromClerk(
      decoded.sub,
      clerkUser.emailAddresses[0]?.emailAddress,
      `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim()
    );

    return user;
  } catch (error) {
    console.error("[Clerk Auth] Authentication failed:", error);
    throw error;
  }
}

/**
 * Check if user is admin
 * @param user - User object
 */
export function isAdmin(user: User): boolean {
  return user.role === "admin";
}
