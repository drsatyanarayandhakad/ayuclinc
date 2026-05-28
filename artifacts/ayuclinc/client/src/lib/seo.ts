/**
 * SEO Configuration for Ayurveda Clinic Website
 */

export const seoConfig = {
  siteName: "Ayurveda Wellness & Healing Clinic",
  siteUrl: "https://ayurveda-clinic.manus.space",
  description: "Experience authentic Ayurvedic healing and wellness treatments. Our clinic offers traditional therapies, consultations, and holistic health solutions.",
  descriptionHi: "प्रामाणिक आयुर्वेदिक उपचार और कल्याण अनुभव करें। हमारा क्लिनिक पारंपरिक चिकित्सा, परामर्श और समग्र स्वास्थ्य समाधान प्रदान करता है।",
  keywords: "Ayurveda, Ayurvedic treatment, wellness, healing, clinic, traditional medicine, Ayurvedic therapy",
  keywordsHi: "आयुर्वेद, आयुर्वेदिक उपचार, कल्याण, उपचार, क्लिनिक, पारंपरिक चिकित्सा, आयुर्वेदिक थेरेपी",
  author: "Ayurveda Wellness & Healing Clinic",
  twitterHandle: "@ayurveda_clinic",
  
  pages: {
    home: {
      titleEn: "Ayurveda Wellness & Healing Clinic | Ancient Wisdom, Modern Care",
      titleHi: "आयुर्वेद कल्याण और उपचार क्लिनिक | प्राचीन ज्ञान, आधुनिक देखभाल",
      descriptionEn: "Discover authentic Ayurvedic treatments and wellness services. Our experienced practitioners offer personalized healing solutions.",
      descriptionHi: "प्रामाणिक आयुर्वेदिक उपचार और कल्याण सेवाएं खोजें। हमारे अनुभवी चिकित्सक व्यक्तिगत उपचार समाधान प्रदान करते हैं।",
    },
    about: {
      titleEn: "About Us | Ayurveda Clinic",
      titleHi: "हमारे बारे में | आयुर्वेद क्लिनिक",
      descriptionEn: "Learn about our clinic's mission, values, and team of expert Ayurvedic practitioners dedicated to your wellness.",
      descriptionHi: "हमारे क्लिनिक के मिशन, मूल्यों और आपके कल्याण के लिए समर्पित विशेषज्ञ आयुर्वेदिक चिकित्सकों की टीम के बारे में जानें।",
    },
    services: {
      titleEn: "Our Services | Ayurvedic Treatments & Therapies",
      titleHi: "हमारी सेवाएं | आयुर्वेदिक उपचार और थेरेपी",
      descriptionEn: "Explore our comprehensive range of Ayurvedic treatments, therapies, and wellness programs tailored to your health needs.",
      descriptionHi: "आपकी स्वास्थ्य आवश्यकताओं के अनुसार तैयार किए गए आयुर्वेदिक उपचार, थेरेपी और कल्याण कार्यक्रमों की हमारी व्यापक श्रृंखला का अन्वेषण करें।",
    },
    gallery: {
      titleEn: "Gallery | Ayurveda Clinic",
      titleHi: "गैलरी | आयुर्वेद क्लिनिक",
      descriptionEn: "View our clinic facilities, treatment rooms, and wellness environment designed for your comfort and healing.",
      descriptionHi: "हमारी क्लिनिक सुविधाओं, उपचार कक्षों और आपके आराम और उपचार के लिए डिज़ाइन किए गए कल्याण वातावरण को देखें।",
    },
    blog: {
      titleEn: "Blog | Ayurvedic Health Tips & Wellness Articles",
      titleHi: "ब्लॉग | आयुर्वेदिक स्वास्थ्य सुझाव और कल्याण लेख",
      descriptionEn: "Read expert articles on Ayurvedic health, wellness tips, and traditional healing practices for holistic living.",
      descriptionHi: "आयुर्वेदिक स्वास्थ्य, कल्याण सुझाव और समग्र जीवन के लिए पारंपरिक उपचार प्रथाओं पर विशेषज्ञ लेख पढ़ें।",
    },
    appointment: {
      titleEn: "Book an Appointment | Ayurveda Clinic",
      titleHi: "अपॉइंटमेंट बुक करें | आयुर्वेद क्लिनिक",
      descriptionEn: "Schedule your Ayurvedic consultation or treatment session with our experienced practitioners.",
      descriptionHi: "हमारे अनुभवी चिकित्सकों के साथ अपनी आयुर्वेदिक परामर्श या उपचार सत्र की समय सारणी बनाएं।",
    },
    contact: {
      titleEn: "Contact Us | Ayurveda Clinic",
      titleHi: "हमसे संपर्क करें | आयुर्वेद क्लिनिक",
      descriptionEn: "Get in touch with us for inquiries, appointments, or wellness consultations. Visit us or call today.",
      descriptionHi: "पूछताछ, अपॉइंटमेंट या कल्याण परामर्श के लिए हमसे संपर्क करें। आज हमसे मिलें या कॉल करें।",
    },
  },
};

/**
 * Generate meta tags for a page
 */
export function generateMetaTags(page: keyof typeof seoConfig.pages, language: "en" | "hi") {
  const pageConfig = seoConfig.pages[page];
  const title = language === "en" ? pageConfig.titleEn : pageConfig.titleHi;
  const description = language === "en" ? pageConfig.descriptionEn : pageConfig.descriptionHi;

  return {
    title,
    description,
    keywords: language === "en" ? seoConfig.keywords : seoConfig.keywordsHi,
    author: seoConfig.author,
    ogTitle: title,
    ogDescription: description,
    ogType: "website",
    ogUrl: `${seoConfig.siteUrl}/${page}`,
    ogImage: `${seoConfig.siteUrl}/og-image.jpg`,
    twitterCard: "summary_large_image",
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: `${seoConfig.siteUrl}/twitter-image.jpg`,
    twitterCreator: seoConfig.twitterHandle,
  };
}

/**
 * Update document head with meta tags
 */
export function updateMetaTags(page: keyof typeof seoConfig.pages, language: "en" | "hi") {
  const meta = generateMetaTags(page, language);

  // Update title
  document.title = meta.title;

  // Update or create meta tags
  const updateMetaTag = (name: string, content: string, property?: boolean) => {
    let tag = document.querySelector(`meta[${property ? "property" : "name"}="${name}"]`);
    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute(property ? "property" : "name", name);
      document.head.appendChild(tag);
    }
    tag.setAttribute("content", content);
  };

  updateMetaTag("description", meta.description);
  updateMetaTag("keywords", meta.keywords);
  updateMetaTag("author", meta.author);
  updateMetaTag("og:title", meta.ogTitle, true);
  updateMetaTag("og:description", meta.ogDescription, true);
  updateMetaTag("og:type", meta.ogType, true);
  updateMetaTag("og:url", meta.ogUrl, true);
  updateMetaTag("og:image", meta.ogImage, true);
  updateMetaTag("twitter:card", meta.twitterCard);
  updateMetaTag("twitter:title", meta.twitterTitle);
  updateMetaTag("twitter:description", meta.twitterDescription);
  updateMetaTag("twitter:image", meta.twitterImage);
  updateMetaTag("twitter:creator", meta.twitterCreator);
}
