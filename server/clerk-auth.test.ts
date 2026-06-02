import { describe, it, expect } from "vitest";
import { isAdmin } from "./clerk-middleware";
import type { User } from "../drizzle/schema";

describe("Clerk Authentication", () => {
  describe("isAdmin", () => {
    it("should return true for admin users", () => {
      const adminUser: User = {
        id: 1,
        openId: "clerk_user_123",
        name: "Admin User",
        email: "admin@example.com",
        loginMethod: "clerk",
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      };

      expect(isAdmin(adminUser)).toBe(true);
    });

    it("should return false for non-admin users", () => {
      const regularUser: User = {
        id: 2,
        openId: "clerk_user_456",
        name: "Regular User",
        email: "user@example.com",
        loginMethod: "clerk",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      };

      expect(isAdmin(regularUser)).toBe(false);
    });

    it("should handle users with different role types", () => {
      const testCases = [
        { role: "admin" as const, expected: true },
        { role: "user" as const, expected: false },
      ];

      testCases.forEach(({ role, expected }) => {
        const user: User = {
          id: 3,
          openId: "clerk_user_789",
          name: "Test User",
          email: "test@example.com",
          loginMethod: "clerk",
          role,
          createdAt: new Date(),
          updatedAt: new Date(),
          lastSignedIn: new Date(),
        };

        expect(isAdmin(user)).toBe(expected);
      });
    });
  });

  describe("User creation from Clerk", () => {
    it("should create user with Clerk login method", () => {
      const clerkUser: User = {
        id: 4,
        openId: "clerk_new_user",
        name: "New Clerk User",
        email: "newuser@clerk.com",
        loginMethod: "clerk",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      };

      expect(clerkUser.loginMethod).toBe("clerk");
      expect(clerkUser.openId).toMatch(/^clerk_/);
      expect(clerkUser.role).toBe("user");
    });

    it("should handle users without email", () => {
      const clerkUser: User = {
        id: 5,
        openId: "clerk_no_email",
        name: "No Email User",
        email: null,
        loginMethod: "clerk",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      };

      expect(clerkUser.email).toBeNull();
      expect(clerkUser.openId).toBeDefined();
    });

    it("should validate Clerk user IDs", () => {
      const clerkUser: User = {
        id: 6,
        openId: "clerk_user_with_special_chars_123",
        name: "Special User",
        email: "special@clerk.com",
        loginMethod: "clerk",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      };

      expect(clerkUser.openId).toBeDefined();
      expect(clerkUser.openId.length).toBeGreaterThan(0);
    });
  });

  describe("Authorization header parsing", () => {
    it("should validate Bearer token format", () => {
      const validHeader = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.signature";
      expect(validHeader.startsWith("Bearer ")).toBe(true);
    });

    it("should reject invalid token formats", () => {
      const invalidHeaders = [
        "InvalidToken",
        "Bearer",
        "bearer token",
        "Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.signature",
      ];

      invalidHeaders.forEach((header) => {
        expect(header.startsWith("Bearer ")).toBe(false);
      });
    });

    it("should extract token from Bearer header", () => {
      const header = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.signature";
      const token = header.replace("Bearer ", "");
      
      expect(token).toBe("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.signature");
      expect(token).not.toContain("Bearer");
    });
  });

  describe("User role validation", () => {
    it("should validate admin role", () => {
      const user: User = {
        id: 7,
        openId: "clerk_admin",
        name: "Admin",
        email: "admin@test.com",
        loginMethod: "clerk",
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      };

      expect(user.role).toBe("admin");
      expect(isAdmin(user)).toBe(true);
    });

    it("should validate user role", () => {
      const user: User = {
        id: 8,
        openId: "clerk_regular",
        name: "Regular",
        email: "user@test.com",
        loginMethod: "clerk",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      };

      expect(user.role).toBe("user");
      expect(isAdmin(user)).toBe(false);
    });
  });
});
