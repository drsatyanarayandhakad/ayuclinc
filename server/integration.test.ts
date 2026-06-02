import { describe, expect, it } from "vitest";

describe("External Service Integration", () => {
  it("should have Clerk credentials configured", () => {
    const publishableKey = process.env.CLERK_PUBLISHABLE_KEY;
    const secretKey = process.env.CLERK_SECRET_KEY;

    expect(publishableKey).toBeDefined();
    expect(publishableKey).toContain("pk_test_");
    expect(secretKey).toBeDefined();
    expect(secretKey).toContain("sk_test_");
  });

  it("should have Cloudinary credentials configured", () => {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    expect(cloudName).toBeDefined();
    expect(cloudName).toBe("dsnpstiqa");
    expect(apiKey).toBeDefined();
    expect(apiKey).toBe("295193447485739");
    expect(apiSecret).toBeDefined();
    expect(apiSecret).toBe("RfyjvE5ksRj0BDvrrXnK5xFsj8A");
  });

  it("should validate Clerk publishable key format", () => {
    const key = process.env.CLERK_PUBLISHABLE_KEY;
    expect(key).toMatch(/^pk_test_/);
  });

  it("should validate Cloudinary cloud name", () => {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    expect(cloudName).toMatch(/^[a-z0-9]+$/);
  });
});
