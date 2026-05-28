import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
}

export default function WhatsAppButton({
  phoneNumber = "919876543210", // Default number - should be replaced with clinic's number
  message = "Hello, I would like to book an appointment.",
}: WhatsAppButtonProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show button after component mounts to avoid hydration issues
    setIsVisible(true);
  }, []);

  if (!isVisible) return null;

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

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
