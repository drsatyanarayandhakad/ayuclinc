import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  getClinicInfo,
  upsertClinicInfo,
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getBlogPosts,
  getBlogPostBySlug,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  getGalleryImages,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  getAppointments,
  createAppointment,
  updateAppointment,
  getTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from "./db";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.user?.role !== "admin") {
    throw new Error("Unauthorized: Admin access required");
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ============== CLINIC INFO ==============
  clinic: router({
    getInfo: publicProcedure.query(async () => {
      return getClinicInfo();
    }),
    updateInfo: adminProcedure
      .input(
        z.object({
          nameEn: z.string().optional(),
          nameHi: z.string().optional(),
          descriptionEn: z.string().optional(),
          descriptionHi: z.string().optional(),
          phone: z.string().optional(),
          email: z.string().optional(),
          address: z.string().optional(),
          latitude: z.string().optional(),
          longitude: z.string().optional(),
          openingHoursEn: z.string().optional(),
          openingHoursHi: z.string().optional(),
          logoUrl: z.string().optional(),
          bannerImageUrl: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return upsertClinicInfo(input as any);
      }),
  }),

  // ============== SERVICES ==============
  services: router({
    list: publicProcedure.query(async () => {
      return getServices();
    }),
    getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return getServiceById(input.id);
    }),
    create: adminProcedure
      .input(
        z.object({
          titleEn: z.string(),
          titleHi: z.string(),
          descriptionEn: z.string().optional(),
          descriptionHi: z.string().optional(),
          durationMinutes: z.number().optional(),
          priceInr: z.string().optional(),
          iconUrl: z.string().optional(),
          imageUrl: z.string().optional(),
          order: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return createService(input as any);
      }),
    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          titleEn: z.string().optional(),
          titleHi: z.string().optional(),
          descriptionEn: z.string().optional(),
          descriptionHi: z.string().optional(),
          durationMinutes: z.number().optional(),
          priceInr: z.string().optional(),
          iconUrl: z.string().optional(),
          imageUrl: z.string().optional(),
          order: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return updateService(id, data as any);
      }),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await deleteService(input.id);
      return { success: true };
    }),
  }),

  // ============== BLOG POSTS ==============
  blog: router({
    list: publicProcedure.query(async () => {
      return getBlogPosts();
    }),
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string(), language: z.enum(["en", "hi"]) }))
      .query(async ({ input }) => {
        return getBlogPostBySlug(input.slug, input.language);
      }),
    create: adminProcedure
      .input(
        z.object({
          titleEn: z.string(),
          titleHi: z.string(),
          slugEn: z.string(),
          slugHi: z.string(),
          contentEn: z.string().optional(),
          contentHi: z.string().optional(),
          excerptEn: z.string().optional(),
          excerptHi: z.string().optional(),
          authorName: z.string().optional(),
          featuredImageUrl: z.string().optional(),
          isPublished: z.boolean().optional(),
          publishedAt: z.date().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return createBlogPost(input as any);
      }),
    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          titleEn: z.string().optional(),
          titleHi: z.string().optional(),
          slugEn: z.string().optional(),
          slugHi: z.string().optional(),
          contentEn: z.string().optional(),
          contentHi: z.string().optional(),
          excerptEn: z.string().optional(),
          excerptHi: z.string().optional(),
          authorName: z.string().optional(),
          featuredImageUrl: z.string().optional(),
          isPublished: z.boolean().optional(),
          publishedAt: z.date().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return updateBlogPost(id, data as any);
      }),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await deleteBlogPost(input.id);
      return { success: true };
    }),
  }),

  // ============== TESTIMONIALS ==============
  testimonials: router({
    list: publicProcedure.query(async () => {
      return getTestimonials();
    }),
    create: publicProcedure
      .input(
        z.object({
          patientNameEn: z.string(),
          patientNameHi: z.string(),
          testimonialEn: z.string().optional(),
          testimonialHi: z.string().optional(),
          rating: z.number().optional(),
          imageUrl: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return createTestimonial({ ...input, isApproved: false });
      }),
    approve: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return updateTestimonial(input.id, { isApproved: true });
      }),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await deleteTestimonial(input.id);
      return { success: true };
    }),
  }),

  // ============== FAQs ==============
  faqs: router({
    list: publicProcedure.query(async () => {
      return getFAQs();
    }),
    create: adminProcedure
      .input(
        z.object({
          questionEn: z.string(),
          questionHi: z.string(),
          answerEn: z.string().optional(),
          answerHi: z.string().optional(),
          order: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return createFAQ(input as any);
      }),
    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          questionEn: z.string().optional(),
          questionHi: z.string().optional(),
          answerEn: z.string().optional(),
          answerHi: z.string().optional(),
          order: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return updateFAQ(id, data as any);
      }),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await deleteFAQ(input.id);
      return { success: true };
    }),
  }),

  // ============== GALLERY ==============
  gallery: router({
    list: publicProcedure.query(async () => {
      return getGalleryImages();
    }),
    create: adminProcedure
      .input(
        z.object({
          titleEn: z.string().optional(),
          titleHi: z.string().optional(),
          imageUrl: z.string(),
          thumbnailUrl: z.string().optional(),
          categoryEn: z.string().optional(),
          categoryHi: z.string().optional(),
          order: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return createGalleryImage(input as any);
      }),
    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          titleEn: z.string().optional(),
          titleHi: z.string().optional(),
          imageUrl: z.string().optional(),
          thumbnailUrl: z.string().optional(),
          categoryEn: z.string().optional(),
          categoryHi: z.string().optional(),
          order: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return updateGalleryImage(id, data as any);
      }),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await deleteGalleryImage(input.id);
      return { success: true };
    }),
  }),

  // ============== APPOINTMENTS ==============
  appointments: router({
    list: adminProcedure.query(async () => {
      return getAppointments();
    }),
    create: publicProcedure
      .input(
        z.object({
          patientName: z.string(),
          patientEmail: z.string().email(),
          patientPhone: z.string(),
          serviceId: z.number().optional(),
          appointmentDate: z.date().optional(),
          appointmentTime: z.string().optional(),
          messageEn: z.string().optional(),
          messageHi: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return createAppointment({ ...input, status: "pending" });
      }),
    updateStatus: adminProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum(["pending", "confirmed", "cancelled", "completed"]),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return updateAppointment(id, data as any);
      }),
  }),

  // ============== TEAM MEMBERS ==============
  team: router({
    list: publicProcedure.query(async () => {
      return getTeamMembers();
    }),
    create: adminProcedure
      .input(
        z.object({
          nameEn: z.string(),
          nameHi: z.string(),
          titleEn: z.string().optional(),
          titleHi: z.string().optional(),
          bioEn: z.string().optional(),
          bioHi: z.string().optional(),
          imageUrl: z.string().optional(),
          order: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return createTeamMember(input as any);
      }),
    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          nameEn: z.string().optional(),
          nameHi: z.string().optional(),
          titleEn: z.string().optional(),
          titleHi: z.string().optional(),
          bioEn: z.string().optional(),
          bioHi: z.string().optional(),
          imageUrl: z.string().optional(),
          order: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return updateTeamMember(id, data as any);
      }),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await deleteTeamMember(input.id);
      return { success: true };
    }),
  }),
});

export type AppRouter = typeof appRouter;
