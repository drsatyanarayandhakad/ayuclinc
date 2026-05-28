import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "hi";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionary
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.about": "About",
    "nav.services": "Services",
    "nav.gallery": "Gallery",
    "nav.blog": "Blog",
    "nav.appointment": "Appointment",
    "nav.contact": "Contact",
    "nav.admin": "Admin",

    // Home page
    "home.hero.title": "Ayurveda Wellness & Healing",
    "home.hero.subtitle": "Ancient Wisdom, Modern Care",
    "home.hero.cta": "Book Appointment",
    "home.services.title": "Our Services",
    "home.testimonials.title": "Patient Testimonials",
    "home.cta.title": "Ready to Start Your Wellness Journey?",
    "home.cta.button": "Schedule Now",

    // About page
    "about.title": "About Our Clinic",
    "about.mission": "Our Mission",
    "about.vision": "Our Vision",
    "about.team": "Our Team",

    // Services page
    "services.title": "Ayurvedic Services",
    "services.description": "Comprehensive healing services tailored to your needs",

    // Gallery page
    "gallery.title": "Gallery",

    // Blog page
    "blog.title": "Wellness Blog",
    "blog.readMore": "Read More",

    // Appointment page
    "appointment.title": "Book an Appointment",
    "appointment.name": "Full Name",
    "appointment.email": "Email Address",
    "appointment.phone": "Phone Number",
    "appointment.service": "Select Service",
    "appointment.date": "Preferred Date",
    "appointment.time": "Preferred Time",
    "appointment.message": "Message",
    "appointment.submit": "Book Appointment",
    "appointment.success": "Appointment booked successfully!",

    // Contact page
    "contact.title": "Contact Us",
    "contact.phone": "Phone",
    "contact.email": "Email",
    "contact.address": "Address",
    "contact.hours": "Opening Hours",
    "contact.form.title": "Send us a Message",
    "contact.form.name": "Name",
    "contact.form.email": "Email",
    "contact.form.message": "Message",
    "contact.form.submit": "Send",

    // Admin
    "admin.title": "Admin Panel",
    "admin.login": "Admin Login",
    "admin.logout": "Logout",
    "admin.dashboard": "Dashboard",
    "admin.clinicInfo": "Clinic Information",
    "admin.services": "Services",
    "admin.blog": "Blog Posts",
    "admin.testimonials": "Testimonials",
    "admin.faqs": "FAQs",
    "admin.gallery": "Gallery",
    "admin.appointments": "Appointments",
    "admin.team": "Team Members",
    "admin.add": "Add New",
    "admin.edit": "Edit",
    "admin.delete": "Delete",
    "admin.save": "Save",
    "admin.cancel": "Cancel",

    // Footer
    "footer.copyright": "© 2026 Ayurveda Wellness Clinic. All rights reserved.",
    "footer.followUs": "Follow Us",
  },
  hi: {
    // Navigation
    "nav.home": "होम",
    "nav.about": "परिचय",
    "nav.services": "सेवाएँ",
    "nav.gallery": "गैलरी",
    "nav.blog": "ब्लॉग",
    "nav.appointment": "अपॉइंटमेंट",
    "nav.contact": "संपर्क",
    "nav.admin": "एडमिन",

    // Home page
    "home.hero.title": "आयुर्वेद कल्याण और उपचार",
    "home.hero.subtitle": "प्राचीन ज्ञान, आधुनिक देखभाल",
    "home.hero.cta": "अपॉइंटमेंट बुक करें",
    "home.services.title": "हमारी सेवाएँ",
    "home.testimonials.title": "रोगी प्रशंसापत्र",
    "home.cta.title": "अपनी कल्याण यात्रा शुरू करने के लिए तैयार हैं?",
    "home.cta.button": "अभी शेड्यूल करें",

    // About page
    "about.title": "हमारे क्लिनिक के बारे में",
    "about.mission": "हमारा मिशन",
    "about.vision": "हमारी दृष्टि",
    "about.team": "हमारी टीम",

    // Services page
    "services.title": "आयुर्वेदिक सेवाएँ",
    "services.description": "आपकी आवश्यकताओं के अनुरूप व्यापक उपचार सेवाएँ",

    // Gallery page
    "gallery.title": "गैलरी",

    // Blog page
    "blog.title": "कल्याण ब्लॉग",
    "blog.readMore": "और पढ़ें",

    // Appointment page
    "appointment.title": "अपॉइंटमेंट बुक करें",
    "appointment.name": "पूरा नाम",
    "appointment.email": "ईमेल पता",
    "appointment.phone": "फोन नंबर",
    "appointment.service": "सेवा चुनें",
    "appointment.date": "पसंदीदा तारीख",
    "appointment.time": "पसंदीदा समय",
    "appointment.message": "संदेश",
    "appointment.submit": "अपॉइंटमेंट बुक करें",
    "appointment.success": "अपॉइंटमेंट सफलतापूर्वक बुक हो गई!",

    // Contact page
    "contact.title": "हमसे संपर्क करें",
    "contact.phone": "फोन",
    "contact.email": "ईमेल",
    "contact.address": "पता",
    "contact.hours": "खुलने का समय",
    "contact.form.title": "हमें एक संदेश भेजें",
    "contact.form.name": "नाम",
    "contact.form.email": "ईमेल",
    "contact.form.message": "संदेश",
    "contact.form.submit": "भेजें",

    // Admin
    "admin.title": "एडमिन पैनल",
    "admin.login": "एडमिन लॉगिन",
    "admin.logout": "लॉगआउट",
    "admin.dashboard": "डैशबोर्ड",
    "admin.clinicInfo": "क्लिनिक की जानकारी",
    "admin.services": "सेवाएँ",
    "admin.blog": "ब्लॉग पोस्ट्स",
    "admin.testimonials": "प्रशंसापत्र",
    "admin.faqs": "अक्सर पूछे जाने वाले प्रश्न",
    "admin.gallery": "गैलरी",
    "admin.appointments": "अपॉइंटमेंट्स",
    "admin.team": "टीम सदस्य",
    "admin.add": "नया जोड़ें",
    "admin.edit": "संपादित करें",
    "admin.delete": "हटाएँ",
    "admin.save": "सहेजें",
    "admin.cancel": "रद्द करें",

    // Footer
    "footer.copyright": "© 2026 आयुर्वेद कल्याण क्लिनिक। सर्वाधिकार सुरक्षित।",
    "footer.followUs": "हमें फॉलो करें",
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  // Load language preference from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("language") as Language | null;
    if (saved && (saved === "en" || saved === "hi")) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
