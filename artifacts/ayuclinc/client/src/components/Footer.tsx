import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 text-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold text-green-400 mb-4">Ayurveda Clinic</h3>
            <p className="text-gray-400 text-sm">
              Providing authentic Ayurvedic treatments and wellness services for holistic health and healing.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-green-400 mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-400 hover:text-green-400 transition">
                  {t("nav.home")}
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-400 hover:text-green-400 transition">
                  {t("nav.services")}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-green-400 transition">
                  {t("nav.blog")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-green-400 transition">
                  {t("nav.contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold text-green-400 mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-gray-400">
                <Phone className="w-4 h-4" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Mail className="w-4 h-4" />
                <span>info@ayurveda.com</span>
              </li>
              <li className="flex items-start gap-2 text-gray-400">
                <MapPin className="w-4 h-4 mt-1" />
                <span>123 Wellness Street, Healing City, India</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-bold text-green-400 mb-4">{t("footer.followUs")}</h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-gray-400 hover:text-green-400 transition"
                title="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-green-400 transition"
                title="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-green-400 transition"
                title="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <p className="text-center text-gray-400 text-sm">{t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
