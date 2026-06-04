import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Leaf, Star } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";

export default function Home() {
  const { t, language } = useLanguage();
  const { data: testimonials } = trpc.testimonials.list.useQuery();

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 via-white to-emerald-50 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                {t("home.hero.title")}
              </h1>
              <p className="text-xl text-gray-600">{t("home.hero.subtitle")}</p>
              <Link href="/appointment">
                <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg flex items-center gap-2">
                  {t("home.hero.cta")}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="w-full h-96 bg-gradient-to-br from-green-200 to-emerald-300 rounded-2xl shadow-2xl flex items-center justify-center">
                <Leaf className="w-32 h-32 text-green-600 opacity-50" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("home.services.title")}</h2>
            <p className="text-lg text-gray-600">Comprehensive healing services for your wellness</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-8 border-2 border-green-100 rounded-xl hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Leaf className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Service {i}</h3>
                <p className="text-gray-600">Experience authentic Ayurvedic healing treatments</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {testimonials && testimonials.length > 0 && (
        <section className="py-16 md:py-24 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {language === "en" ? "What Our Patients Say" : "हमारे रोगी क्या कहते हैं"}
              </h2>
              <p className="text-lg text-gray-600">
                {language === "en"
                  ? "Real stories from people who have experienced our healing services"
                  : "उन लोगों की वास्तविक कहानियाँ जिन्होंने हमारी उपचार सेवाओं का अनुभव किया है"}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.slice(0, 3).map((testimonial) => (
                <Card key={testimonial.id} className="p-6 hover:shadow-lg transition-shadow">
                  {/* Rating Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    "{language === "en" ? testimonial.testimonialEn : testimonial.testimonialHi || testimonial.testimonialEn}"
                  </p>

                  {/* Patient Name */}
                  <div className="border-t border-gray-200 pt-4">
                    <p className="font-semibold text-gray-900">
                      {language === "en" ? testimonial.patientNameEn : testimonial.patientNameHi || testimonial.patientNameEn}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-600 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">{t("home.cta.title")}</h2>
          <Link href="/appointment">
            <Button className="bg-white text-green-600 hover:bg-gray-100 px-8 py-6 text-lg">
              {t("home.cta.button")}
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
      <WhatsAppButton phoneNumber="919876543210" />
    </div>
  );
}
