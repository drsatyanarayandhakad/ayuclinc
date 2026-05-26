import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { MapView } from "@/components/Map";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Contact() {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }
    toast.success("Message sent successfully! We will contact you soon.");
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  const clinicInfo = {
    address: language === "en" 
      ? "123 Wellness Street, Ayurveda City, State 12345"
      : "123 वेलनेस स्ट्रीट, आयुर्वेद सिटी, स्टेट 12345",
    phone: "+91 98765 43210",
    email: "info@ayurveda-clinic.com",
    hours: language === "en"
      ? "Monday - Saturday: 9:00 AM - 6:00 PM\nSunday: 10:00 AM - 4:00 PM"
      : "सोमवार - शनिवार: 9:00 AM - 6:00 PM\nरविवार: 10:00 AM - 4:00 PM",
    latitude: "28.6139",
    longitude: "77.2090",
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            {t("contact.title") || "Get in Touch"}
          </h1>
          <p className="text-xl text-gray-600">
            {language === "en"
              ? "Have questions? We're here to help. Contact us anytime."
              : "कोई सवाल है? हम मदद के लिए यहाँ हैं। कभी भी हमसे संपर्क करें।"}
          </p>
        </div>
      </section>

      {/* Contact Information & Map */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Contact Info Cards */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                {language === "en" ? "Contact Information" : "संपर्क जानकारी"}
              </h2>

              {/* Address */}
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex gap-4">
                  <MapPin className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {language === "en" ? "Address" : "पता"}
                    </h3>
                    <p className="text-gray-600">{clinicInfo.address}</p>
                  </div>
                </div>
              </Card>

              {/* Phone */}
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex gap-4">
                  <Phone className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {language === "en" ? "Phone" : "फोन"}
                    </h3>
                    <a href="tel:+919876543210" className="text-green-600 hover:text-green-700 font-semibold">
                      {clinicInfo.phone}
                    </a>
                  </div>
                </div>
              </Card>

              {/* Email */}
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex gap-4">
                  <Mail className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {language === "en" ? "Email" : "ईमेल"}
                    </h3>
                    <a href="mailto:info@ayurveda-clinic.com" className="text-green-600 hover:text-green-700 font-semibold">
                      {clinicInfo.email}
                    </a>
                  </div>
                </div>
              </Card>

              {/* Hours */}
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex gap-4">
                  <Clock className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {language === "en" ? "Hours" : "घंटे"}
                    </h3>
                    <p className="text-gray-600 whitespace-pre-line text-sm">{clinicInfo.hours}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Contact Form */}
            <Card className="p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {language === "en" ? "Send us a Message" : "हमें एक संदेश भेजें"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("contact.name") || "Name"} *
                  </label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={language === "en" ? "Your Name" : "आपका नाम"}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("contact.email") || "Email"} *
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={language === "en" ? "your@email.com" : "आपका@ईमेल.com"}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("contact.phone") || "Phone"}
                  </label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={language === "en" ? "+91 98765 43210" : "+91 98765 43210"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("contact.subject") || "Subject"}
                  </label>
                  <Input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder={language === "en" ? "Subject" : "विषय"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("contact.message") || "Message"} *
                  </label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={language === "en" ? "Your message..." : "आपका संदेश..."}
                    rows={5}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 font-semibold"
                >
                  {t("contact.submit") || "Send Message"}
                </Button>
              </form>
            </Card>
          </div>

          {/* Map Section */}
          <div className="bg-gray-100 rounded-lg overflow-hidden shadow-lg h-96">
            <MapView
              onMapReady={(map: any) => {
                if (map) {
                  const clinicLocation = {
                    lat: parseFloat(clinicInfo.latitude),
                    lng: parseFloat(clinicInfo.longitude),
                  };
                  map.setCenter(clinicLocation);
                  map.setZoom(15);
                  new (window as any).google.maps.Marker({
                    position: clinicLocation,
                    map: map,
                    title: language === "en" ? "Ayurveda Clinic" : "आयुर्वेद क्लिनिक",
                  });
                }
              }}
            />
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
