import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2, Calendar, Clock, User, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Appointment() {
  const { t, language } = useLanguage();
  const { data: services } = trpc.services.list.useQuery();
  const createMutation = trpc.appointments.create.useMutation();

  const [formData, setFormData] = useState({
    patientName: "",
    patientEmail: "",
    patientPhone: "",
    serviceId: "",
    preferredDate: "",
    preferredTime: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.patientName || !formData.patientEmail || !formData.patientPhone || !formData.preferredDate) {
      toast.error(t("appointment.error") || "Please fill in all required fields");
      return;
    }

    try {
      await createMutation.mutateAsync({
        patientName: formData.patientName,
        patientEmail: formData.patientEmail,
        patientPhone: formData.patientPhone,
        serviceId: formData.serviceId ? parseInt(formData.serviceId) : undefined,
        appointmentDate: new Date(formData.preferredDate),
        appointmentTime: formData.preferredTime || undefined,
        messageEn: language === "en" ? formData.message : undefined,
        messageHi: language === "hi" ? formData.message : undefined,
      });

      toast.success(t("appointment.success") || "Appointment booked successfully!");
      setFormData({
        patientName: "",
        patientEmail: "",
        patientPhone: "",
        serviceId: "",
        preferredDate: "",
        preferredTime: "",
        message: "",
      });
    } catch (error) {
      toast.error("Failed to book appointment. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">{t("appointment.title") || "Book Your Appointment"}</h1>
          <p className="text-xl text-gray-600">
            {language === "en"
              ? "Book your healing session with our experienced Ayurvedic practitioners"
              : "हमारे अनुभवी आयुर्वेदिक चिकित्सकों के साथ अपनी उपचार सेशन बुक करें"}
          </p>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 md:p-12 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <User className="w-6 h-6 text-green-600" />
                  {language === "en" ? "Your Information" : "आपकी जानकारी"}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("appointment.name") || "Full Name"} *
                    </label>
                    <Input
                      type="text"
                      name="patientName"
                      value={formData.patientName}
                      onChange={handleChange}
                      placeholder={language === "en" ? "Full Name" : "पूरा नाम"}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("appointment.email") || "Email"} *
                    </label>
                    <Input
                      type="email"
                      name="patientEmail"
                      value={formData.patientEmail}
                      onChange={handleChange}
                      placeholder={language === "en" ? "Email Address" : "ईमेल पता"}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("appointment.phone") || "Phone"} *
                    </label>
                    <Input
                      type="tel"
                      name="patientPhone"
                      value={formData.patientPhone}
                      onChange={handleChange}
                      placeholder={language === "en" ? "+91 98765 43210" : "+91 98765 43210"}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Appointment Details */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-green-600" />
                  {language === "en" ? "Appointment Details" : "अपॉइंटमेंट विवरण"}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("appointment.service") || "Service"}
                    </label>
                    <select
                      name="serviceId"
                      value={formData.serviceId}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    >
                      <option value="">
                        {language === "en" ? "Select a service" : "सेवा चुनें"}
                      </option>
                      {services?.map((service) => (
                        <option key={service.id} value={service.id}>
                          {language === "en" ? service.titleEn : service.titleHi} - ₹{service.priceInr}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("appointment.date") || "Date"} *
                    </label>
                    <Input
                      type="date"
                      name="preferredDate"
                      value={formData.preferredDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {t("appointment.time") || "Time"}
                    </label>
                    <Input
                      type="time"
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("appointment.message") || "Message"}
                </label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={
                    language === "en"
                      ? "Any special requests or health concerns?"
                      : "कोई विशेष अनुरोध या स्वास्थ्य संबंधी चिंताएं?"
                  }
                  rows={4}
                />
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-semibold flex items-center justify-center gap-2"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {language === "en" ? "Booking..." : "बुकिंग..."}
                    </>
                  ) : (
                    <>
                      <Calendar className="w-5 h-5" />
                      {t("appointment.submit") || "Book Appointment"}
                    </>
                  )}
                </Button>
              </div>

              {/* Info Message */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  {language === "en"
                    ? "We will confirm your appointment within 24 hours via email and phone."
                    : "हम 24 घंटे के भीतर ईमेल और फोन के माध्यम से आपकी अपॉइंटमेंट की पुष्टि करेंगे।"}
                </p>
              </div>
            </form>
          </Card>

          {/* Why Book With Us */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              {language === "en" ? "Why Choose Us?" : "हमें क्यों चुनें?"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">👨‍⚕️</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {language === "en" ? "Expert Practitioners" : "विशेषज्ञ चिकित्सक"}
                </h3>
                <p className="text-gray-600">
                  {language === "en"
                    ? "Certified Ayurvedic doctors with years of experience"
                    : "वर्षों के अनुभव के साथ प्रमाणित आयुर्वेदिक डॉक्टर"}
                </p>
              </Card>
              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">🌿</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {language === "en" ? "Natural Treatments" : "प्राकृतिक उपचार"}
                </h3>
                <p className="text-gray-600">
                  {language === "en"
                    ? "100% natural and organic Ayurvedic therapies"
                    : "100% प्राकृतिक और जैविक आयुर्वेदिक चिकित्सा"}
                </p>
              </Card>
              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">✨</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {language === "en" ? "Personalized Care" : "व्यक्तिगत देखभाल"}
                </h3>
                <p className="text-gray-600">
                  {language === "en"
                    ? "Customized treatment plans for your unique needs"
                    : "आपकी अनूठी आवश्यकताओं के लिए अनुकूलित उपचार योजना"}
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
