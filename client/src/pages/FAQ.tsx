import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function FAQ() {
  const { t, language } = useLanguage();
  const { data: faqs, isLoading } = trpc.faqs.list.useQuery();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            {language === "en" ? "Frequently Asked Questions" : "अक्सर पूछे जाने वाले प्रश्न"}
          </h1>
          <p className="text-xl text-gray-600">
            {language === "en"
              ? "Find answers to common questions about our Ayurvedic treatments and services"
              : "हमारे आयुर्वेदिक उपचार और सेवाओं के बारे में सामान्य प्रश्नों के उत्तर खोजें"}
          </p>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">{language === "en" ? "Loading FAQs..." : "FAQs लोड हो रहे हैं..."}</p>
            </div>
          ) : faqs && faqs.length > 0 ? (
            <div className="space-y-4">
              {faqs.map((faq) => (
                <Card key={faq.id} className="overflow-hidden border-green-200 hover:shadow-md transition-shadow">
                  <button
                    onClick={() => toggleExpand(faq.id)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-green-50 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 text-left">
                      {language === "en" ? faq.questionEn : faq.questionHi || faq.questionEn}
                    </h3>
                    <ChevronDown
                      className={`w-5 h-5 text-green-600 transition-transform ${
                        expandedId === faq.id ? "transform rotate-180" : ""
                      }`}
                    />
                  </button>

                  {expandedId === faq.id && (
                    <div className="px-6 py-4 bg-green-50 border-t border-green-200">
                      <p className="text-gray-700 leading-relaxed">
                        {language === "en" ? faq.answerEn : faq.answerHi || faq.answerEn}
                      </p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-gray-600">
                {language === "en" ? "No FAQs available yet" : "अभी कोई FAQ उपलब्ध नहीं है"}
              </p>
            </Card>
          )}
        </div>
      </section>

      <WhatsAppButton />
      <Footer />
    </div>
  );
}
