import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Leaf } from "lucide-react";

export default function Home() {
  const { t } = useLanguage();

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
