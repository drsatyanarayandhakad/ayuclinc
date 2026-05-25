import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, IndianRupee, Leaf } from "lucide-react";
import { useLocation } from "wouter";

export default function Services() {
  const { t, language } = useLanguage();
  const [, navigate] = useLocation();
  const { data: services, isLoading } = trpc.services.list.useQuery();

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            {t("services.title") || "Our Services"}
          </h1>
          <p className="text-xl text-gray-600">
            {language === "en"
              ? "Comprehensive Ayurvedic treatments for holistic wellness"
              : "समग्र कल्याण के लिए व्यापक आयुर्वेदिक उपचार"}
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">
                {language === "en" ? "Loading services..." : "सेवाएं लोड हो रही हैं..."}
              </p>
            </div>
          ) : services && services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <Card
                  key={service.id}
                  className="overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
                >
                  {/* Service Header */}
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-white">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold">
                          {language === "en" ? service.titleEn : service.titleHi}
                        </h3>
                      </div>
                      <Leaf className="w-6 h-6 flex-shrink-0" />
                    </div>
                  </div>

                  {/* Service Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Description */}
                    <p className="text-gray-600 mb-4 flex-1">
                      {language === "en" ? service.descriptionEn : service.descriptionHi}
                    </p>

                    {/* Service Details */}
                    <div className="space-y-3 mb-6 border-t pt-4">
                      {service.durationMinutes && (
                        <div className="flex items-center gap-3 text-sm">
                          <Clock className="w-5 h-5 text-green-600" />
                          <span className="text-gray-700">
                            {service.durationMinutes} {language === "en" ? "minutes" : "मिनट"}
                          </span>
                        </div>
                      )}
                      {service.priceInr && (
                        <div className="flex items-center gap-3 text-sm">
                          <IndianRupee className="w-5 h-5 text-green-600" />
                          <span className="text-gray-700 font-semibold">
                            ₹{service.priceInr}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* CTA Button */}
                    <Button
                      onClick={() => navigate("/appointment")}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
                    >
                      {t("services.book") || "Book Now"}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                {language === "en"
                  ? "No services available at the moment. Please check back soon."
                  : "इस समय कोई सेवा उपलब्ध नहीं है। कृपया जल्द ही वापस जांचें।"}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Our Services */}
      <section className="bg-green-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            {language === "en" ? "Why Choose Our Services?" : "हमारी सेवाओं को क्यों चुनें?"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 text-center">
              <div className="text-5xl mb-4">🌿</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {language === "en" ? "100% Natural" : "100% प्राकृतिक"}
              </h3>
              <p className="text-gray-600">
                {language === "en"
                  ? "All treatments use natural herbs and oils sourced from organic farms"
                  : "सभी उपचार जैविक खेतों से प्राप्त प्राकृतिक जड़ी-बूटियों और तेलों का उपयोग करते हैं"}
              </p>
            </Card>
            <Card className="p-8 text-center">
              <div className="text-5xl mb-4">👨‍⚕️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {language === "en" ? "Expert Practitioners" : "विशेषज्ञ चिकित्सक"}
              </h3>
              <p className="text-gray-600">
                {language === "en"
                  ? "Our doctors are certified and have 10+ years of experience"
                  : "हमारे डॉक्टर प्रमाणित हैं और 10+ वर्षों का अनुभव रखते हैं"}
              </p>
            </Card>
            <Card className="p-8 text-center">
              <div className="text-5xl mb-4">✨</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {language === "en" ? "Personalized Care" : "व्यक्तिगत देखभाल"}
              </h3>
              <p className="text-gray-600">
                {language === "en"
                  ? "Each treatment is customized based on your unique constitution"
                  : "प्रत्येक उपचार आपकी अद्वितीय प्रकृति के आधार पर अनुकूलित है"}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            {language === "en"
              ? "Ready to Begin Your Healing Journey?"
              : "अपनी उपचार यात्रा शुरू करने के लिए तैयार हैं?"}
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            {language === "en"
              ? "Book your first appointment today and experience the benefits of Ayurveda"
              : "आज ही अपनी पहली अपॉइंटमेंट बुक करें और आयुर्वेद के लाभों का अनुभव करें"}
          </p>
          <Button
            onClick={() => navigate("/appointment")}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold"
          >
            {t("services.bookNow") || "Book Appointment"}
          </Button>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
