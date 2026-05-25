import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4" />
      <Button
        variant={language === "en" ? "default" : "outline"}
        size="sm"
        onClick={() => setLanguage("en")}
        className="px-3"
      >
        EN
      </Button>
      <Button
        variant={language === "hi" ? "default" : "outline"}
        size="sm"
        onClick={() => setLanguage("hi")}
        className="px-3"
      >
        HI
      </Button>
    </div>
  );
}
