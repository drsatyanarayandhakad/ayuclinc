import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { ChevronDown, ChevronUp, Loader2, HelpCircle } from "lucide-react";

export default function FAQPage() {
  const { language } = useLanguage();
  const { data: faqs, isLoading } = trpc.faqs.list.useQuery();
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-50 py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <HelpCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {language === "en" ? "Frequently Asked Questions" : "अक्सर पूछे जाने वाले प्रश्न"}
          </h1>
          <p className="text-lg text-gray-600">
            {language === "en"
              ? "Find answers to common questions about our Ayurvedic treatments"
              : "हमारे आयुर्वेदिक उपचारों के बारे में सामान्य प्रश्नों के उत्तर खोजें"}
          </p>
        </div>
      </section>

      {/* FAQ List */}
      <section className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            </div>
          ) : !faqs || faqs.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              {language === "en"
                ? "No FAQs available yet."
                : "अभी कोई FAQ उपलब्ध नहीं है।"}
            </div>
          ) : (
            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const question = language === "hi" && faq.questionHi ? faq.questionHi : faq.questionEn;
                const answer = language === "hi" && faq.answerHi ? faq.answerHi : faq.answerEn;
                const isOpen = openId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="border border-gray-200 rounded-xl overflow-hidden hover:border-green-300 transition-colors"
                  >
                    <button
                      className="w-full flex items-start justify-between gap-4 px-6 py-5 text-left bg-white hover:bg-green-50 transition-colors"
                      onClick={() => setOpenId(isOpen ? null : faq.id)}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-sm font-bold text-green-600 mt-0.5 shrink-0">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <span className="font-semibold text-gray-800 text-base">{question}</span>
                      </div>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                      )}
                    </button>
                    {isOpen && answer && (
                      <div className="px-6 pb-5 pt-0 bg-green-50 border-t border-green-100">
                        <p className="text-gray-700 leading-relaxed pl-7">{answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
