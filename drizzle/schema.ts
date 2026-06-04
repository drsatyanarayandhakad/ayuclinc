import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  boolean,
  decimal,
  json,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extended with admin role support for clinic staff.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Clinic information - stores general clinic details
 * Editable from admin panel
 */
export const clinicInfo = mysqlTable("clinic_info", {
  id: int("id").autoincrement().primaryKey(),
  nameEn: varchar("name_en", { length: 255 }).notNull(),
  nameHi: varchar("name_hi", { length: 255 }).notNull(),
  descriptionEn: text("description_en"),
  descriptionHi: text("description_hi"),
  phone: varchar("phone", { length: 20 }),
  whatsappNumber: varchar("whatsapp_number", { length: 20 }),
  email: varchar("email", { length: 320 }),
  address: text("address"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  openingHoursEn: text("opening_hours_en"),
  openingHoursHi: text("opening_hours_hi"),
  logoUrl: varchar("logo_url", { length: 500 }),
  bannerImageUrl: varchar("banner_image_url", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ClinicInfo = typeof clinicInfo.$inferSelect;
export type InsertClinicInfo = typeof clinicInfo.$inferInsert;

/**
 * Services offered by the clinic
 * Each service has bilingual content
 */
export const services = mysqlTable("services", {
  id: int("id").autoincrement().primaryKey(),
  titleEn: varchar("title_en", { length: 255 }).notNull(),
  titleHi: varchar("title_hi", { length: 255 }).notNull(),
  descriptionEn: text("description_en"),
  descriptionHi: text("description_hi"),
  durationMinutes: int("duration_minutes"),
  priceInr: decimal("price_inr", { precision: 10, scale: 2 }),
  iconUrl: varchar("icon_url", { length: 500 }),
  imageUrl: varchar("image_url", { length: 500 }),
  order: int("order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Service = typeof services.$inferSelect;
export type InsertService = typeof services.$inferInsert;

/**
 * Blog posts with bilingual support
 */
export const blogPosts = mysqlTable("blog_posts", {
  id: int("id").autoincrement().primaryKey(),
  titleEn: varchar("title_en", { length: 255 }).notNull(),
  titleHi: varchar("title_hi", { length: 255 }).notNull(),
  slugEn: varchar("slug_en", { length: 255 }).notNull().unique(),
  slugHi: varchar("slug_hi", { length: 255 }).notNull().unique(),
  contentEn: text("content_en"),
  contentHi: text("content_hi"),
  excerptEn: text("excerpt_en"),
  excerptHi: text("excerpt_hi"),
  authorName: varchar("author_name", { length: 255 }),
  featuredImageUrl: varchar("featured_image_url", { length: 500 }),
  isPublished: boolean("is_published").default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

/**
 * Testimonials from patients
 * Bilingual support for patient names and testimonials
 */
export const testimonials = mysqlTable("testimonials", {
  id: int("id").autoincrement().primaryKey(),
  patientNameEn: varchar("patient_name_en", { length: 255 }).notNull(),
  patientNameHi: varchar("patient_name_hi", { length: 255 }).notNull(),
  testimonialEn: text("testimonial_en"),
  testimonialHi: text("testimonial_hi"),
  rating: int("rating").default(5),
  imageUrl: varchar("image_url", { length: 500 }),
  isApproved: boolean("is_approved").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = typeof testimonials.$inferInsert;

/**
 * FAQs with bilingual support
 */
export const faqs = mysqlTable("faqs", {
  id: int("id").autoincrement().primaryKey(),
  questionEn: varchar("question_en", { length: 500 }).notNull(),
  questionHi: varchar("question_hi", { length: 500 }).notNull(),
  answerEn: text("answer_en"),
  answerHi: text("answer_hi"),
  order: int("order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FAQ = typeof faqs.$inferSelect;
export type InsertFAQ = typeof faqs.$inferInsert;

/**
 * Gallery images
 * Stores image URLs and metadata
 */
export const galleryImages = mysqlTable("gallery_images", {
  id: int("id").autoincrement().primaryKey(),
  titleEn: varchar("title_en", { length: 255 }),
  titleHi: varchar("title_hi", { length: 255 }),
  imageUrl: varchar("image_url", { length: 500 }).notNull(),
  thumbnailUrl: varchar("thumbnail_url", { length: 500 }),
  categoryEn: varchar("category_en", { length: 100 }),
  categoryHi: varchar("category_hi", { length: 100 }),
  order: int("order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type GalleryImage = typeof galleryImages.$inferSelect;
export type InsertGalleryImage = typeof galleryImages.$inferInsert;

/**
 * Appointment bookings
 * Stores patient appointment requests
 */
export const appointments = mysqlTable("appointments", {
  id: int("id").autoincrement().primaryKey(),
  patientName: varchar("patient_name", { length: 255 }).notNull(),
  patientEmail: varchar("patient_email", { length: 320 }).notNull(),
  patientPhone: varchar("patient_phone", { length: 20 }).notNull(),
  serviceId: int("service_id"),
  appointmentDate: timestamp("appointment_date"),
  appointmentTime: varchar("appointment_time", { length: 10 }),
  messageEn: text("message_en"),
  messageHi: text("message_hi"),
  status: mysqlEnum("status", ["pending", "confirmed", "cancelled", "completed"]).default("pending"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = typeof appointments.$inferInsert;

/**
 * Team members
 * Stores information about clinic staff
 */
export const teamMembers = mysqlTable("team_members", {
  id: int("id").autoincrement().primaryKey(),
  nameEn: varchar("name_en", { length: 255 }).notNull(),
  nameHi: varchar("name_hi", { length: 255 }).notNull(),
  titleEn: varchar("title_en", { length: 255 }),
  titleHi: varchar("title_hi", { length: 255 }),
  bioEn: text("bio_en"),
  bioHi: text("bio_hi"),
  imageUrl: varchar("image_url", { length: 500 }),
  order: int("order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = typeof teamMembers.$inferInsert;
