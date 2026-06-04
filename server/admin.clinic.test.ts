import { describe, it, expect, beforeAll } from "vitest";
import { getDb } from "./db";
import { clinicInfo } from "../drizzle/schema";

describe("Admin Clinic Info Management", () => {
  let db: any;

  beforeAll(async () => {
    db = await getDb();
  });

  it("should update clinic info with whatsapp number", async () => {
    if (!db) {
      console.warn("Database not available, skipping test");
      return;
    }

    try {
      // Update clinic info with WhatsApp number
      await db.update(clinicInfo).set({
        whatsappNumber: "916261997079",
        phone: "+91 98765 43210",
        email: "drsatyanarayandhakad@gmail.com",
        address: "123 Wellness Street",
      });

      // Verify the update
      const result = await db.select().from(clinicInfo).limit(1);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].whatsappNumber).toBe("916261997079");
    } catch (error) {
      console.error("Test error:", error);
      throw error;
    }
  });

  it("should retrieve clinic info with whatsapp number", async () => {
    if (!db) {
      console.warn("Database not available, skipping test");
      return;
    }

    try {
      const result = await db.select().from(clinicInfo).limit(1);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty("whatsappNumber");
      console.log("Clinic info:", result[0]);
    } catch (error) {
      console.error("Test error:", error);
      throw error;
    }
  });

  it("should handle clinic info update via mutation", async () => {
    if (!db) {
      console.warn("Database not available, skipping test");
      return;
    }

    try {
      const updateData = {
        whatsappNumber: "916261997079",
        nameEn: "Ayurveda Wellness & Healing Clinic",
        phone: "+91 98765 43210",
      };

      // Get existing clinic info
      const existing = await db.select().from(clinicInfo).limit(1);
      if (existing.length > 0) {
        await db.update(clinicInfo).set(updateData).where(clinicInfo.id === existing[0].id);
      }

      // Verify update
      const result = await db.select().from(clinicInfo).limit(1);
      expect(result[0].whatsappNumber).toBe("916261997079");
      expect(result[0].nameEn).toBe("Ayurveda Wellness & Healing Clinic");
    } catch (error) {
      console.error("Test error:", error);
      throw error;
    }
  });
});
