import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  clinicInfo,
  services,
  blogPosts,
  testimonials,
  faqs,
  galleryImages,
  appointments,
  teamMembers,
  type ClinicInfo,
  type Service,
  type BlogPost,
  type Testimonial,
  type FAQ,
  type GalleryImage,
  type Appointment,
  type TeamMember,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============== CLINIC INFO ==============
export async function getClinicInfo(): Promise<ClinicInfo | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(clinicInfo).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function upsertClinicInfo(data: Partial<ClinicInfo>): Promise<ClinicInfo> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await getClinicInfo();

  if (existing) {
    await db.update(clinicInfo).set(data).where(eq(clinicInfo.id, existing.id));
    return { ...existing, ...data } as ClinicInfo;
  } else {
    const result = await db
      .insert(clinicInfo)
      .values(data as any)
      .then(async () => {
        const res = await db.select().from(clinicInfo).limit(1);
        return res[0];
      });
    return result as ClinicInfo;
  }
}

// ============== SERVICES ==============
export async function getServices(): Promise<Service[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(services).where(eq(services.isActive, true)).orderBy(services.order);
}

export async function getServiceById(id: number): Promise<Service | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(services).where(eq(services.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createService(data: Partial<Service>): Promise<Service> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .insert(services)
    .values(data as any)
    .then(async () => {
      const res = await db.select().from(services).orderBy(desc(services.id)).limit(1);
      return res[0];
    });
  return result as Service;
}

export async function updateService(id: number, data: Partial<Service>): Promise<Service> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(services).set(data).where(eq(services.id, id));
  const result = await getServiceById(id);
  return result as Service;
}

export async function deleteService(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(services).set({ isActive: false }).where(eq(services.id, id));
}

// ============== BLOG POSTS ==============
export async function getBlogPosts(): Promise<BlogPost[]> {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.isPublished, true))
    .orderBy(desc(blogPosts.publishedAt));
}

export async function getBlogPostBySlug(slug: string, language: "en" | "hi"): Promise<BlogPost | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const slugField = language === "en" ? blogPosts.slugEn : blogPosts.slugHi;
  const result = await db
    .select()
    .from(blogPosts)
    .where(and(eq(slugField, slug), eq(blogPosts.isPublished, true)))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createBlogPost(data: Partial<BlogPost>): Promise<BlogPost> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .insert(blogPosts)
    .values(data as any)
    .then(async () => {
      const res = await db.select().from(blogPosts).orderBy(desc(blogPosts.id)).limit(1);
      return res[0];
    });
  return result as BlogPost;
}

export async function updateBlogPost(id: number, data: Partial<BlogPost>): Promise<BlogPost> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(blogPosts).set(data).where(eq(blogPosts.id, id));
  const result = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
  return result[0] as BlogPost;
}

export async function deleteBlogPost(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(blogPosts).set({ isPublished: false }).where(eq(blogPosts.id, id));
}

// ============== TESTIMONIALS ==============
export async function getTestimonials(): Promise<Testimonial[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(testimonials).where(eq(testimonials.isApproved, true)).orderBy(desc(testimonials.createdAt));
}

export async function createTestimonial(data: Partial<Testimonial>): Promise<Testimonial> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .insert(testimonials)
    .values(data as any)
    .then(async () => {
      const res = await db.select().from(testimonials).orderBy(desc(testimonials.id)).limit(1);
      return res[0];
    });
  return result as Testimonial;
}

export async function updateTestimonial(id: number, data: Partial<Testimonial>): Promise<Testimonial> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(testimonials).set(data).where(eq(testimonials.id, id));
  const result = await db.select().from(testimonials).where(eq(testimonials.id, id)).limit(1);
  return result[0] as Testimonial;
}

export async function deleteTestimonial(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(testimonials).where(eq(testimonials.id, id));
}

// ============== FAQs ==============
export async function getFAQs(): Promise<FAQ[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(faqs).where(eq(faqs.isActive, true)).orderBy(faqs.order);
}

export async function createFAQ(data: Partial<FAQ>): Promise<FAQ> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .insert(faqs)
    .values(data as any)
    .then(async () => {
      const res = await db.select().from(faqs).orderBy(desc(faqs.id)).limit(1);
      return res[0];
    });
  return result as FAQ;
}

export async function updateFAQ(id: number, data: Partial<FAQ>): Promise<FAQ> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(faqs).set(data).where(eq(faqs.id, id));
  const result = await db.select().from(faqs).where(eq(faqs.id, id)).limit(1);
  return result[0] as FAQ;
}

export async function deleteFAQ(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(faqs).set({ isActive: false }).where(eq(faqs.id, id));
}

// ============== GALLERY ==============
export async function getGalleryImages(): Promise<GalleryImage[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(galleryImages).where(eq(galleryImages.isActive, true)).orderBy(galleryImages.order);
}

export async function createGalleryImage(data: Partial<GalleryImage>): Promise<GalleryImage> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .insert(galleryImages)
    .values(data as any)
    .then(async () => {
      const res = await db.select().from(galleryImages).orderBy(desc(galleryImages.id)).limit(1);
      return res[0];
    });
  return result as GalleryImage;
}

export async function updateGalleryImage(id: number, data: Partial<GalleryImage>): Promise<GalleryImage> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(galleryImages).set(data).where(eq(galleryImages.id, id));
  const result = await db.select().from(galleryImages).where(eq(galleryImages.id, id)).limit(1);
  return result[0] as GalleryImage;
}

export async function deleteGalleryImage(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(galleryImages).set({ isActive: false }).where(eq(galleryImages.id, id));
}

// ============== APPOINTMENTS ==============
export async function getAppointments(): Promise<Appointment[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(appointments).orderBy(desc(appointments.createdAt));
}

export async function createAppointment(data: Partial<Appointment>): Promise<Appointment> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .insert(appointments)
    .values(data as any)
    .then(async () => {
      const res = await db.select().from(appointments).orderBy(desc(appointments.id)).limit(1);
      return res[0];
    });
  return result as Appointment;
}

export async function updateAppointment(id: number, data: Partial<Appointment>): Promise<Appointment> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(appointments).set(data).where(eq(appointments.id, id));
  const result = await db.select().from(appointments).where(eq(appointments.id, id)).limit(1);
  return result[0] as Appointment;
}

// ============== TEAM MEMBERS ==============
export async function getTeamMembers(): Promise<TeamMember[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(teamMembers).where(eq(teamMembers.isActive, true)).orderBy(teamMembers.order);
}

export async function createTeamMember(data: Partial<TeamMember>): Promise<TeamMember> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .insert(teamMembers)
    .values(data as any)
    .then(async () => {
      const res = await db.select().from(teamMembers).orderBy(desc(teamMembers.id)).limit(1);
      return res[0];
    });
  return result as TeamMember;
}

export async function updateTeamMember(id: number, data: Partial<TeamMember>): Promise<TeamMember> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(teamMembers).set(data).where(eq(teamMembers.id, id));
  const result = await db.select().from(teamMembers).where(eq(teamMembers.id, id)).limit(1);
  return result[0] as TeamMember;
}

export async function deleteTeamMember(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(teamMembers).set({ isActive: false }).where(eq(teamMembers.id, id));
}
