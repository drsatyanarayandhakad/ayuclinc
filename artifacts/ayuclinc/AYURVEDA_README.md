# Ayurveda Clinic Website - Complete Documentation

## 🌿 Project Overview

This is a **full-stack Ayurveda clinic website** with a **secure admin panel**, **bilingual support** (English & Hindi), and **database-driven content management**. The site is built with React, Express, tRPC, and MySQL.

### Key Features

✅ **7 Public Pages:** Home, About, Services, Gallery, Blog, Appointment, Contact  
✅ **Bilingual Support:** English & Hindi with language switcher  
✅ **Admin Panel:** Secure role-based access for content management  
✅ **Database-Backed:** All content stored in MySQL and editable from admin panel  
✅ **Appointment Booking:** Form submissions saved to database  
✅ **Google Maps Integration:** Embedded on Contact page  
✅ **WhatsApp Button:** Floating button for patient messaging  
✅ **File Storage:** Image uploads for gallery and blog  
✅ **SEO Optimized:** Meta tags, sitemap, robots.txt  
✅ **Mobile Responsive:** Fully responsive design with smooth animations  
✅ **Ayurveda Theme:** Green, white, and earthy color palette  

---

## 🚀 Getting Started

### Prerequisites

- Node.js 22.13.0+
- pnpm package manager
- MySQL database (provided by Manus)

### Installation

```bash
cd /home/ubuntu/ayurveda-clinic-site
pnpm install
```

### Running the Project

**Development Mode:**
```bash
pnpm run dev
```

The site will be available at: `https://3000-ilaul4lfpeoiyyg8naory-88b992cd.sg1.manus.computer` (or your assigned URL)

**Production Build:**
```bash
pnpm run build
pnpm start
```

---

## 📁 Project Structure

```
ayurveda-clinic-site/
├── client/
│   ├── src/
│   │   ├── pages/                    # Public pages
│   │   │   ├── Home.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Services.tsx
│   │   │   ├── Gallery.tsx
│   │   │   ├── Blog.tsx
│   │   │   ├── BlogDetail.tsx
│   │   │   ├── Appointment.tsx
│   │   │   ├── Contact.tsx
│   │   │   └── AdminPanel.tsx        # Admin dashboard
│   │   ├── components/
│   │   │   ├── Navigation.tsx        # Top navigation with language switcher
│   │   │   ├── Footer.tsx            # Footer with clinic info
│   │   │   ├── WhatsAppButton.tsx    # Floating WhatsApp button
│   │   │   ├── LanguageSwitcher.tsx  # Language toggle
│   │   │   └── admin/                # Admin panel components
│   │   │       ├── AdminSidebar.tsx
│   │   │       ├── AdminDashboard.tsx
│   │   │       ├── AdminClinicInfo.tsx
│   │   │       ├── AdminServices.tsx
│   │   │       ├── AdminBlog.tsx
│   │   │       ├── AdminTestimonials.tsx
│   │   │       ├── AdminFAQs.tsx
│   │   │       ├── AdminGallery.tsx
│   │   │       ├── AdminAppointments.tsx
│   │   │       └── AdminTeam.tsx
│   │   ├── contexts/
│   │   │   ├── LanguageContext.tsx   # Bilingual support
│   │   │   └── ThemeContext.tsx
│   │   ├── lib/
│   │   │   └── trpc.ts              # tRPC client setup
│   │   └── index.css                # Tailwind + Ayurveda theme
│   └── index.html
├── server/
│   ├── routers.ts                   # tRPC API endpoints
│   ├── db.ts                        # Database queries
│   ├── storage.ts                   # File storage helpers
│   ├── auth.logout.test.ts          # Auth tests
│   ├── admin.services.test.ts       # Admin services tests
│   └── _core/                       # Framework core files
├── drizzle/
│   ├── schema.ts                    # Database schema
│   └── migrations/                  # Database migrations
├── shared/                          # Shared types & constants
├── package.json
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

---

## 🗄️ Database Schema

### Tables

1. **clinic_info** - Clinic details (name, phone, address, hours, etc.)
2. **services** - Ayurvedic services offered
3. **blog_posts** - Blog articles with bilingual content
4. **testimonials** - Patient testimonials
5. **faqs** - Frequently asked questions
6. **gallery_images** - Clinic photos
7. **appointments** - Appointment bookings
8. **team_members** - Staff information
9. **users** - User accounts with admin role

All tables support **bilingual content** with `*En` and `*Hi` suffixes.

---

## 🔐 Admin Panel Access

### Login

The admin panel is accessible at `/admin` and requires **admin role** authentication.

### Admin Features

| Feature | Description |
|---------|-------------|
| **Dashboard** | Overview of all content (services, blog posts, appointments, etc.) |
| **Clinic Info** | Edit clinic name, description, phone, email, address, hours |
| **Services** | Add/edit/delete Ayurvedic services with pricing and duration |
| **Blog** | Create and manage blog posts in English & Hindi |
| **Testimonials** | Manage patient testimonials |
| **FAQs** | Add frequently asked questions |
| **Gallery** | Upload and manage clinic photos |
| **Appointments** | View and manage appointment bookings |
| **Team** | Manage staff information |

### Making a User Admin

To promote a user to admin, update their `role` in the database:

```sql
UPDATE users SET role = 'admin' WHERE openId = 'user-openid';
```

---

## 🌐 Bilingual Support

The site supports **English** and **Hindi** with a language switcher in the navigation.

### Adding Translations

Edit `/client/src/contexts/LanguageContext.tsx` and add your keys to the `translations` object:

```typescript
const translations: Record<Language, Record<string, string>> = {
  en: {
    "my.key": "English text",
  },
  hi: {
    "my.key": "हिंदी पाठ",
  },
};
```

### Using Translations in Components

```typescript
import { useLanguage } from "@/contexts/LanguageContext";

export default function MyComponent() {
  const { t } = useLanguage();
  return <h1>{t("my.key")}</h1>;
}
```

---

## 📱 WhatsApp Integration

The floating WhatsApp button is configured with a default phone number. To update it:

**In any page component:**
```typescript
<WhatsAppButton phoneNumber="919876543210" message="Hello, I would like to book an appointment." />
```

The phone number should be in international format (country code + number, no + symbol).

---

## 🗺️ Google Maps Integration

Google Maps is available on the Contact page. The integration uses Manus's built-in proxy, so no API key is needed.

To use Maps in components:

```typescript
import MapView from "@/components/Map";

export default function ContactPage() {
  return (
    <MapView
      onMapReady={(map) => {
        // Initialize geocoding, directions, etc.
      }}
    />
  );
}
```

---

## 🎨 Styling & Theme

### Color Palette (Ayurveda Theme)

- **Primary Green:** `#16a34a` (rgb(22, 163, 74))
- **Light Green:** `#dcfce7` (rgb(220, 252, 231))
- **Dark Green:** `#15803d` (rgb(21, 128, 61))
- **White:** `#ffffff`
- **Gray:** `#f3f4f6` to `#1f2937`

### Tailwind CSS

The project uses **Tailwind CSS 4** with custom animations:

```css
.animate-fadeInUp      /* Fade in from bottom */
.animate-slideInLeft   /* Slide in from left */
.animate-slideInRight  /* Slide in from right */
.animate-glow          /* Green glow effect */
```

---

## 🧪 Testing

Run all tests:

```bash
pnpm test
```

Test files are located in the `server/` directory with `.test.ts` extension.

### Example Test

```typescript
import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";

describe("Services", () => {
  it("should create a service", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.services.create({
      titleEn: "Massage",
      titleHi: "मालिश",
      priceInr: "1000",
    });
    
    expect(result.titleEn).toBe("Massage");
  });
});
```

---

## 📝 API Endpoints (tRPC)

All endpoints are under `/api/trpc` and use tRPC procedures.

### Public Endpoints

- `clinic.getInfo` - Get clinic information
- `services.list` - List all services
- `blog.list` - List all blog posts
- `blog.getBySlug` - Get a specific blog post
- `testimonials.list` - List testimonials
- `faqs.list` - List FAQs
- `gallery.list` - List gallery images
- `appointments.create` - Create appointment booking

### Admin-Only Endpoints

- `clinic.updateInfo` - Update clinic info
- `services.create/update/delete` - Manage services
- `blog.create/update/delete` - Manage blog posts
- `testimonials.create/update/delete` - Manage testimonials
- `faqs.create/update/delete` - Manage FAQs
- `gallery.create/update/delete` - Manage gallery
- `appointments.list/update` - View and manage appointments
- `team.create/update/delete` - Manage team members

---

## 📦 Deployment

### Prerequisites for Deployment

1. Create a checkpoint: `webdev_save_checkpoint`
2. Click the **Publish** button in the Management UI
3. Configure custom domain if needed

### Environment Variables

All required environment variables are automatically injected:

- `DATABASE_URL` - MySQL connection string
- `JWT_SECRET` - Session signing secret
- `VITE_APP_ID` - OAuth app ID
- `OAUTH_SERVER_URL` - OAuth backend URL
- And more...

No manual `.env` file needed!

---

## 🐛 Troubleshooting

### Admin Panel Not Loading

1. Ensure you're logged in with an admin account
2. Check that your user has `role = 'admin'` in the database
3. Clear browser cache and try again

### Services Not Showing

1. Verify services are created in the admin panel
2. Check database connection is active
3. Look at browser console for errors

### WhatsApp Button Not Working

1. Verify phone number format: `919876543210` (no + symbol)
2. Ensure the number is valid and WhatsApp-enabled
3. Test on mobile device for best experience

---

## 📞 Support

For issues or questions:

1. Check the browser console for errors
2. Review the `.manus-logs/` directory for server logs
3. Verify database connection and schema
4. Test API endpoints directly using tRPC client

---

## 📄 License

This project is built on the Manus platform. All rights reserved.

---

## 🎯 Next Steps

1. **Customize Content:** Update clinic info, services, and team in admin panel
2. **Add Blog Posts:** Create wellness articles in English & Hindi
3. **Upload Gallery:** Add clinic photos
4. **Configure WhatsApp:** Update phone number
5. **Test Appointments:** Verify appointment booking works
6. **SEO:** Update meta tags and sitemap
7. **Deploy:** Publish to production

---

**Happy healing! 🌿**
