import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function AdminClinicInfo() {
  const { t } = useLanguage();
  const { data: clinicInfo, isLoading } = trpc.clinic.getInfo.useQuery();
  const updateMutation = trpc.clinic.updateInfo.useMutation();

  const [formData, setFormData] = useState({
    nameEn: "",
    nameHi: "",
    descriptionEn: "",
    descriptionHi: "",
    phone: "",
    email: "",
    address: "",
    latitude: "",
    longitude: "",
    openingHoursEn: "",
    openingHoursHi: "",
    logoUrl: "",
    bannerImageUrl: "",
  });

  useEffect(() => {
    if (clinicInfo) {
      setFormData({
        nameEn: clinicInfo.nameEn || "",
        nameHi: clinicInfo.nameHi || "",
        descriptionEn: clinicInfo.descriptionEn || "",
        descriptionHi: clinicInfo.descriptionHi || "",
        phone: clinicInfo.phone || "",
        email: clinicInfo.email || "",
        address: clinicInfo.address || "",
        latitude: clinicInfo.latitude?.toString() || "",
        longitude: clinicInfo.longitude?.toString() || "",
        openingHoursEn: clinicInfo.openingHoursEn || "",
        openingHoursHi: clinicInfo.openingHoursHi || "",
        logoUrl: clinicInfo.logoUrl || "",
        bannerImageUrl: clinicInfo.bannerImageUrl || "",
      });
    }
  }, [clinicInfo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMutation.mutateAsync(formData);
      toast.success("Clinic information updated successfully!");
    } catch (error) {
      toast.error("Failed to update clinic information");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">{t("admin.clinicInfo")}</h2>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* English Section */}
          <div className="border-b pb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">English Content</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Clinic Name (EN)</label>
                <Input
                  type="text"
                  name="nameEn"
                  value={formData.nameEn}
                  onChange={handleChange}
                  placeholder="Clinic Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description (EN)</label>
              <Textarea
                name="descriptionEn"
                value={formData.descriptionEn}
                onChange={handleChange}
                placeholder="Clinic description"
                rows={4}
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Opening Hours (EN)</label>
              <Textarea
                name="openingHoursEn"
                value={formData.openingHoursEn}
                onChange={handleChange}
                placeholder="Mon-Fri: 9AM-6PM&#10;Sat: 10AM-4PM&#10;Sun: Closed"
                rows={3}
              />
            </div>
          </div>

          {/* Hindi Section */}
          <div className="border-b pb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Hindi Content</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Clinic Name (HI)</label>
              <Input
                type="text"
                name="nameHi"
                value={formData.nameHi}
                onChange={handleChange}
                placeholder="क्लिनिक का नाम"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description (HI)</label>
              <Textarea
                name="descriptionHi"
                value={formData.descriptionHi}
                onChange={handleChange}
                placeholder="क्लिनिक का विवरण"
                rows={4}
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Opening Hours (HI)</label>
              <Textarea
                name="openingHoursHi"
                value={formData.openingHoursHi}
                onChange={handleChange}
                placeholder="सोमवार-शुक्रवार: 9AM-6PM"
                rows={3}
              />
            </div>
          </div>

          {/* Contact & Location */}
          <div className="border-b pb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Contact & Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="info@clinic.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <Input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Wellness Street"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                <Input
                  type="text"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  placeholder="28.6139"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                <Input
                  type="text"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  placeholder="77.2090"
                />
              </div>
            </div>
          </div>

          {/* Media URLs */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Media</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
                <Input
                  type="url"
                  name="logoUrl"
                  value={formData.logoUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/logo.png"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Banner Image URL</label>
                <Input
                  type="url"
                  name="bannerImageUrl"
                  value={formData.bannerImageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/banner.jpg"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                t("admin.save")
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
