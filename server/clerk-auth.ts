import { clerkClient } from "@clerk/clerk-sdk-node";

/**
 * Get user information from Clerk
 * @param userId - The Clerk user ID
 */
export async function getClerkUser(userId: string) {
  try {
    const user = await clerkClient.users.getUser(userId);
    return {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      imageUrl: user.imageUrl,
      createdAt: user.createdAt,
    };
  } catch (error) {
    console.error("[Clerk] Failed to get user:", error);
    throw error;
  }
}

/**
 * Verify Clerk session token
 * @param token - The session token
 */
export async function verifyClerkToken(token: string) {
  try {
    // This would typically be done in middleware
    // For now, we'll just validate the token format
    if (!token || !token.startsWith("eyJ")) {
      throw new Error("Invalid token format");
    }
    return true;
  } catch (error) {
    console.error("[Clerk] Token verification failed:", error);
    return false;
  }
}

/**
 * Create a new user in Clerk
 * @param email - User email
 * @param password - User password
 * @param firstName - User first name
 * @param lastName - User last name
 */
export async function createClerkUser(
  email: string,
  password: string,
  firstName?: string,
  lastName?: string
) {
  try {
    const user = await clerkClient.users.createUser({
      emailAddress: [email],
      password,
      firstName,
      lastName,
    });
    return user;
  } catch (error) {
    console.error("[Clerk] Failed to create user:", error);
    throw error;
  }
}
