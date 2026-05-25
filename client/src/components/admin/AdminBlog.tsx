import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function AdminBlog() {
  const { t } = useLanguage();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">{t("admin.blog")}</h2>
        <Button className="bg-green-600 hover:bg-green-700 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          {t("admin.add")}
        </Button>
      </div>

      <Card className="p-12 text-center">
        <p className="text-gray-500 text-lg">Blog management coming soon</p>
      </Card>
    </div>
  );
}
