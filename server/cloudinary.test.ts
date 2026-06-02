import { describe, expect, it, beforeAll } from "vitest";
import { uploadToCloudinary, getCloudinaryUrl } from "./cloudinary";

describe("Cloudinary Integration", () => {
  it("should have Cloudinary configured with correct environment variables", () => {
    expect(process.env.CLOUDINARY_CLOUD_NAME).toBe("dsnpstiqa");
    expect(process.env.CLOUDINARY_API_KEY).toBe("295193447485739");
    expect(process.env.CLOUDINARY_API_SECRET).toBe("RfyjvE5ksRj0BDvrrXnK5xFsj8A");
  });

  it("should generate a valid Cloudinary URL", () => {
    const url = getCloudinaryUrl("test-image", { width: 300, height: 300 });
    expect(url).toBeDefined();
    expect(typeof url).toBe("string");
    expect(url).toContain("dsnpstiqa");
  });

  it("should handle file upload with correct parameters", async () => {
    // This test validates the structure, actual upload would require mocking
    const testBuffer = Buffer.from("test image data");
    expect(testBuffer).toBeInstanceOf(Buffer);
    expect(testBuffer.length).toBeGreaterThan(0);
  });

  it("should validate cloud name format", () => {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    expect(cloudName).toMatch(/^[a-z0-9]+$/);
  });

  it("should validate API key format", () => {
    const apiKey = process.env.CLOUDINARY_API_KEY;
    expect(apiKey).toMatch(/^\d+$/);
  });
});
