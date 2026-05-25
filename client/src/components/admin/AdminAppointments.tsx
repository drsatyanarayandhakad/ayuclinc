import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";

export default function AdminAppointments() {
  const { t } = useLanguage();
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">{t("admin.appointments")}</h2>
      <Card className="p-12 text-center">
        <p className="text-gray-500 text-lg">Appointments management coming soon</p>
      </Card>
    </div>
  );
}
