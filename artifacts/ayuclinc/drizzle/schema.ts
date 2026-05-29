import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
  boolean,
  decimal,
  serial,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["user", "admin"]);
export const statusEnum = pgEnum("appointment_status", ["pending", "confirmed", "cancelled", "completed"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const clinicInfo = pgTable("clinic_info", {
  id: serial("id").primaryKey(),
  nameEn: varchar("name_en", { length: 255 }).notNull(),
  nameHi: varchar("name_hi", { length: 255 }).notNull(),
  descriptionEn: text("description_en"),
  descriptionHi: text("description_hi"),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 320 }),
  address: text("address"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  openingHoursEn: text("opening_hours_en"),
  openingHoursHi: text("opening_hours_hi"),
  logoUrl: varchar("logo_url", { length: 500 }),
  bannerImageUrl: varchar("banner_image_url", { length: 500 }),
  facebookUrl: varchar("facebook_url", { length: 500 }),
  instagramUrl: varchar("instagram_url", { length: 500 }),
  twitterUrl: varchar("twitter_url", { length: 500 }),
  youtubeUrl: varchar("youtube_url", { length: 500 }),
  whatsappNumber: varchar("whatsapp_number", { length: 20 }),
  whatsappMessage: text("whatsapp_message"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type ClinicInfo = typeof clinicInfo.$inferSelect;
export type InsertClinicInfo = typeof clinicInfo.$inferInsert;

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  titleEn: varchar("title_en", { length: 255 }).notNull(),
  titleHi: varchar("title_hi", { length: 255 }).notNull(),
  descriptionEn: text("description_en"),
  descriptionHi: text("description_hi"),
  durationMinutes: integer("duration_minutes"),
  priceInr: decimal("price_inr", { precision: 10, scale: 2 }),
  iconUrl: varchar("icon_url", { length: 500 }),
  imageUrl: varchar("image_url", { length: 500 }),
  order: integer("order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Service = typeof services.$inferSelect;
export type InsertService = typeof services.$inferInsert;

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
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
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  patientNameEn: varchar("patient_name_en", { length: 255 }).notNull(),
  patientNameHi: varchar("patient_name_hi", { length: 255 }).notNull(),
  testimonialEn: text("testimonial_en"),
  testimonialHi: text("testimonial_hi"),
  rating: integer("rating").default(5),
  imageUrl: varchar("image_url", { length: 500 }),
  isApproved: boolean("is_approved").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = typeof testimonials.$inferInsert;

export const faqs = pgTable("faqs", {
  id: serial("id").primaryKey(),
  questionEn: varchar("question_en", { length: 500 }).notNull(),
  questionHi: varchar("question_hi", { length: 500 }).notNull(),
  answerEn: text("answer_en"),
  answerHi: text("answer_hi"),
  order: integer("order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type FAQ = typeof faqs.$inferSelect;
export type InsertFAQ = typeof faqs.$inferInsert;

export const galleryImages = pgTable("gallery_images", {
  id: serial("id").primaryKey(),
  titleEn: varchar("title_en", { length: 255 }),
  titleHi: varchar("title_hi", { length: 255 }),
  imageUrl: varchar("image_url", { length: 500 }).notNull(),
  thumbnailUrl: varchar("thumbnail_url", { length: 500 }),
  categoryEn: varchar("category_en", { length: 100 }),
  categoryHi: varchar("category_hi", { length: 100 }),
  order: integer("order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type GalleryImage = typeof galleryImages.$inferSelect;
export type InsertGalleryImage = typeof galleryImages.$inferInsert;

export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  patientName: varchar("patient_name", { length: 255 }).notNull(),
  patientEmail: varchar("patient_email", { length: 320 }).notNull(),
  patientPhone: varchar("patient_phone", { length: 20 }).notNull(),
  serviceId: integer("service_id"),
  appointmentDate: timestamp("appointment_date"),
  appointmentTime: varchar("appointment_time", { length: 10 }),
  messageEn: text("message_en"),
  messageHi: text("message_hi"),
  status: statusEnum("status").default("pending"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = typeof appointments.$inferInsert;

export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  nameEn: varchar("name_en", { length: 255 }).notNull(),
  nameHi: varchar("name_hi", { length: 255 }).notNull(),
  titleEn: varchar("title_en", { length: 255 }),
  titleHi: varchar("title_hi", { length: 255 }),
  bioEn: text("bio_en"),
  bioHi: text("bio_hi"),
  imageUrl: varchar("image_url", { length: 500 }),
  order: integer("order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = typeof teamMembers.$inferInsert;

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  language: varchar("language", { length: 10 }).default("en"),
  isActive: boolean("is_active").default(true),
  subscribedAt: timestamp("subscribedAt").defaultNow().notNull(),
});

export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  subject: varchar("subject", { length: 500 }),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ContactMessage = typeof contactMessages.$inferSelect;
