import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
}

export default function WhatsAppButton({
  phoneNumber: propPhone,
  message: propMessage,
}: WhatsAppButtonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { data: clinicInfo } = trpc.clinic.getInfo.useQuery();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!isVisible) return null;

  const phoneNumber = clinicInfo?.whatsappNumber || propPhone || "919876543210";
  const message =
    clinicInfo?.whatsappMessage ||
    propMessage ||
    "Hello, I would like to book an appointment.";

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  const isDefaultNumber = phoneNumber === "919876543210" && !clinicInfo?.whatsappNumber;
  if (!phoneNumber || isDefaultNumber) {
    return null;
  }

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 animate-bounce"
      title="Chat on WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
    </a>
  );
}
