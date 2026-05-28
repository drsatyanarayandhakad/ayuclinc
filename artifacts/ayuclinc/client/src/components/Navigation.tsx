import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "./LanguageSwitcher";
import { Leaf, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navigation() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/", label: t("nav.home") },
    { href: "/about", label: t("nav.about") },
    { href: "/services", label: t("nav.services") },
    { href: "/gallery", label: t("nav.gallery") },
    { href: "/blog", label: t("nav.blog") },
    { href: "/appointment", label: t("nav.appointment") },
    { href: "/contact", label: t("nav.contact") },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md border-b-4 border-green-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-800 hidden sm:inline">Ayurveda</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button variant="ghost" className="text-gray-700 hover:text-green-600">
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher />

            {user?.role === "admin" && (
              <Link href="/admin">
                <Button variant="default" className="bg-green-600 hover:bg-green-700">
                  {t("nav.admin")}
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 hover:text-green-600"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
            {user?.role === "admin" && (
              <Link href="/admin">
                <Button
                  variant="default"
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => setIsOpen(false)}
                >
                  {t("nav.admin")}
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
