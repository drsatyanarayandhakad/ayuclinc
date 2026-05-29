import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, User, ArrowRight, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { toast } from "sonner";

export default function Blog() {
  const { t, language } = useLanguage();
  const [, navigate] = useLocation();
  const { data: blogPosts, isLoading } = trpc.blog.list.useQuery();
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const subscribeMutation = trpc.newsletter.subscribe.useMutation();

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(language === "en" ? "en-US" : "hi-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            {t("blog.title") || "Blog"}
          </h1>
          <p className="text-xl text-gray-600">
            {language === "en"
              ? "Insights, tips, and wisdom about Ayurveda and wellness"
              : "आयुर्वेद और कल्याण के बारे में अंतर्दृष्टि, सुझाव और ज्ञान"}
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">
                {language === "en" ? "Loading blog posts..." : "ब्लॉग पोस्ट लोड हो रहे हैं..."}
              </p>
            </div>
          ) : blogPosts && blogPosts.length > 0 ? (
            <div className="space-y-8">
              {blogPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-8">
                    {/* Title */}
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">
                      {language === "en" ? post.titleEn : post.titleHi}
                    </h2>

                    {/* Meta Information */}
                    <div className="flex flex-wrap gap-6 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(post.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{language === "en" ? "By Admin" : "प्रशासक द्वारा"}</span>
                      </div>
                    </div>

                    {/* Excerpt */}
                    <p className="text-gray-700 mb-6 leading-relaxed">
                      {language === "en" ? post.excerptEn : post.excerptHi}
                    </p>

                    {/* Read More Button */}
                    <Button
                      onClick={() => navigate(`/blog/${language === "en" ? post.slugEn : post.slugHi}`)}
                      className="bg-green-600 hover:bg-green-700 text-white inline-flex items-center gap-2"
                    >
                      {t("blog.readMore") || "Read More"}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                {language === "en"
                  ? "Blog posts coming soon"
                  : "ब्लॉग पोस्ट्स जल्द ही आएंगी"}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-gradient-to-r from-green-500 to-emerald-500 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            {language === "en" ? "Subscribe to Our Blog" : "हमारे ब्लॉग को सब्सक्राइब करें"}
          </h2>
          <p className="text-lg mb-8">
            {language === "en"
              ? "Get wellness tips and Ayurvedic insights delivered to your inbox"
              : "अपने इनबॉक्स में कल्याण सुझाव और आयुर्वेदिक अंतर्दृष्टि प्राप्त करें"}
          </p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              value={subscribeEmail}
              onChange={(e) => setSubscribeEmail(e.target.value)}
              placeholder={language === "en" ? "Your email..." : "आपका ईमेल..."}
              className="flex-1 px-4 py-3 rounded-lg text-gray-900"
            />
            <Button
              className="bg-white text-green-600 hover:bg-gray-100"
              disabled={subscribeMutation.isPending}
              onClick={async () => {
                if (!subscribeEmail || !subscribeEmail.includes("@")) {
                  toast.error(language === "en" ? "Enter a valid email" : "सही ईमेल दर्ज करें");
                  return;
                }
                try {
                  await subscribeMutation.mutateAsync({ email: subscribeEmail, language });
                  toast.success(language === "en" ? "Subscribed successfully!" : "सब्सक्राइब हो गए!");
                  setSubscribeEmail("");
                } catch {
                  toast.error(language === "en" ? "Already subscribed or error occurred" : "पहले से सब्सक्राइब है या त्रुटि हुई");
                }
              }}
            >
              {subscribeMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : (language === "en" ? "Subscribe" : "सब्सक्राइब करें")}
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
