import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createAdminContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "admin-user",
      email: "admin@clinic.com",
      name: "Admin User",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("Admin Services Management", () => {
  it("should create a new service", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.services.create({
      titleEn: "Abhyanga Massage",
      titleHi: "अभ्यंग मालिश",
      descriptionEn: "Traditional oil massage therapy",
      descriptionHi: "पारंपरिक तेल मालिश चिकित्सा",
      durationMinutes: 60,
      priceInr: "1500",
      order: 1,
    });

    expect(result).toBeDefined();
    expect(result.titleEn).toBe("Abhyanga Massage");
    expect(result.titleHi).toBe("अभ्यंग मालिश");
    expect(result.durationMinutes).toBe(60);
    expect(result.priceInr).toBe("1500.00");
  });

  it("should list all services", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // Create a service first
    await caller.services.create({
      titleEn: "Panchakarma",
      titleHi: "पंचकर्म",
      descriptionEn: "Detoxification therapy",
      descriptionHi: "विषहरण चिकित्सा",
      durationMinutes: 120,
      priceInr: "3000",
      order: 2,
    });

    const services = await caller.services.list();

    expect(Array.isArray(services)).toBe(true);
    expect(services.length).toBeGreaterThan(0);
    expect(services[0]).toHaveProperty("titleEn");
    expect(services[0]).toHaveProperty("titleHi");
  });

  it("should update a service", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // Create a service first
    const created = await caller.services.create({
      titleEn: "Shirodhara",
      titleHi: "शिरोधारा",
      descriptionEn: "Oil pouring on forehead",
      descriptionHi: "माथे पर तेल डालना",
      durationMinutes: 45,
      priceInr: "2000",
      order: 3,
    });

    // Update it
    const updated = await caller.services.update({
      id: created.id,
      titleEn: "Shirodhara Premium",
      titleHi: "शिरोधारा प्रीमियम",
      descriptionEn: "Premium oil pouring therapy",
      descriptionHi: "प्रीमियम तेल डालने की चिकित्सा",
      durationMinutes: 60,
      priceInr: "2500",
      order: 3,
    });

    expect(updated.titleEn).toBe("Shirodhara Premium");
    expect(updated.priceInr).toBe("2500.00");
  });

  it("should delete a service", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // Create a service first
    const created = await caller.services.create({
      titleEn: "Nasya",
      titleHi: "नस्य",
      descriptionEn: "Nasal therapy",
      descriptionHi: "नाक की चिकित्सा",
      durationMinutes: 30,
      priceInr: "800",
      order: 4,
    });

    // Delete it
    await caller.services.delete({ id: created.id });

    // Try to list and verify it's gone
    const services = await caller.services.list();
    const found = services.find((s) => s.id === created.id);

    expect(found).toBeUndefined();
  });
});
