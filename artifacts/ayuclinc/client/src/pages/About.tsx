import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Heart, Leaf, Zap } from "lucide-react";

export default function About() {
  const { t, language } = useLanguage();
  const { data: teamMembers } = trpc.team.list.useQuery();

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            {t("about.title") || "About Us"}
          </h1>
          <p className="text-xl text-gray-600">
            {language === "en"
              ? "Bringing ancient Ayurvedic wisdom to modern wellness"
              : "प्राचीन आयुर्वेदिक ज्ञान को आधुनिक कल्याण में लाना"}
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Mission */}
            <Card className="p-8 bg-gradient-to-br from-green-50 to-emerald-50">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="w-8 h-8 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  {language === "en" ? "Our Mission" : "हमारा मिशन"}
                </h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {language === "en"
                  ? "To provide authentic, personalized Ayurvedic treatments that restore balance and promote holistic wellness for every individual. We believe in treating the root cause, not just symptoms."
                  : "प्रत्येक व्यक्ति के लिए संतुलन बहाल करने और समग्र कल्याण को बढ़ावा देने वाले प्रामाणिक, व्यक्तिगत आयुर्वेदिक उपचार प्रदान करना। हम लक्षणों को नहीं, बल्कि मूल कारण को ठीक करने में विश्वास करते हैं।"}
              </p>
            </Card>

            {/* Vision */}
            <Card className="p-8 bg-gradient-to-br from-blue-50 to-cyan-50">
              <div className="flex items-center gap-3 mb-4">
                <Leaf className="w-8 h-8 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  {language === "en" ? "Our Vision" : "हमारी दृष्टि"}
                </h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {language === "en"
                  ? "To be the leading Ayurvedic wellness center, recognized for excellence in patient care, natural healing, and transforming lives through the timeless wisdom of Ayurveda."
                  : "एक अग्रणी आयुर्वेदिक कल्याण केंद्र बनना, जो रोगी देखभाल, प्राकृतिक उपचार और आयुर्वेद के कालजयी ज्ञान के माध्यम से जीवन को बदलने के लिए जाना जाता है।"}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-green-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            {language === "en" ? "Our Core Values" : "हमारे मूल मूल्य"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 text-center">
              <div className="text-5xl mb-4">🌿</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {language === "en" ? "Natural Healing" : "प्राकृतिक उपचार"}
              </h3>
              <p className="text-gray-600">
                {language === "en"
                  ? "We use only organic, natural ingredients in all our treatments"
                  : "हम अपने सभी उपचारों में केवल जैविक, प्राकृतिक सामग्री का उपयोग करते हैं"}
              </p>
            </Card>
            <Card className="p-8 text-center">
              <div className="text-5xl mb-4">👥</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {language === "en" ? "Patient-Centric" : "रोगी-केंद्रित"}
              </h3>
              <p className="text-gray-600">
                {language === "en"
                  ? "Every treatment is personalized based on individual constitution and needs"
                  : "प्रत्येक उपचार व्यक्तिगत संविधान और आवश्यकताओं के आधार पर व्यक्तिगत है"}
              </p>
            </Card>
            <Card className="p-8 text-center">
              <div className="text-5xl mb-4">✨</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {language === "en" ? "Excellence" : "उत्कृष्टता"}
              </h3>
              <p className="text-gray-600">
                {language === "en"
                  ? "We maintain the highest standards in all aspects of our practice"
                  : "हम अपने अभ्यास के सभी पहलुओं में सर्वोच्च मानकों को बनाए रखते हैं"}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            {language === "en" ? "Our Expert Team" : "हमारी विशेषज्ञ टीम"}
          </h2>
          {teamMembers && teamMembers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                <Card key={member.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-48 flex items-center justify-center">
                    <div className="text-6xl">👨‍⚕️</div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {language === "en" ? member.nameEn : member.nameHi}
                    </h3>
                    <p className="text-green-600 font-semibold mb-3">
                      {language === "en" ? member.titleEn : member.titleHi}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {language === "en" ? member.bioEn : member.bioHi}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">
                {language === "en"
                  ? "Our team information is being updated"
                  : "हमारी टीम की जानकारी अपडेट की जा रही है"}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-50 py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {language === "en" ? "Why Choose Ayurveda Wellness?" : "आयुर्वेद वेलनेस को क्यों चुनें?"}
          </h2>
          <div className="space-y-4">
            {[
              {
                en: "5000+ years of proven healing wisdom",
                hi: "5000+ वर्षों का सिद्ध उपचार ज्ञान",
              },
              {
                en: "100% natural and organic treatments",
                hi: "100% प्राकृतिक और जैविक उपचार",
              },
              {
                en: "Personalized treatment plans for each patient",
                hi: "प्रत्येक रोगी के लिए व्यक्तिगत उपचार योजना",
              },
              {
                en: "Certified and experienced practitioners",
                hi: "प्रमाणित और अनुभवी चिकित्सक",
              },
              {
                en: "Holistic approach to wellness",
                hi: "कल्याण के लिए समग्र दृष्टिकोण",
              },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <Zap className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <p className="text-gray-700 text-lg">
                  {language === "en" ? item.en : item.hi}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
