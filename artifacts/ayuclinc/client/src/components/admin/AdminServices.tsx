import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Trash2, Edit2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminServices() {
  const { t } = useLanguage();
  const { data: services, isLoading, refetch } = trpc.services.list.useQuery();
  const createMutation = trpc.services.create.useMutation();
  const updateMutation = trpc.services.update.useMutation();
  const deleteMutation = trpc.services.delete.useMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    titleEn: "",
    titleHi: "",
    descriptionEn: "",
    descriptionHi: "",
    durationMinutes: "",
    priceInr: "",
    iconUrl: "",
    imageUrl: "",
    order: "0",
  });

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
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          ...formData,
          durationMinutes: formData.durationMinutes ? parseInt(formData.durationMinutes) : undefined,
          order: parseInt(formData.order),
        });
        toast.success("Service updated successfully!");
      } else {
        await createMutation.mutateAsync({
          ...formData,
          durationMinutes: formData.durationMinutes ? parseInt(formData.durationMinutes) : undefined,
          order: parseInt(formData.order),
        });
        toast.success("Service created successfully!");
      }
      resetForm();
      refetch();
    } catch (error) {
      toast.error("Failed to save service");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this service?")) {
      try {
        await deleteMutation.mutateAsync({ id });
        toast.success("Service deleted successfully!");
        refetch();
      } catch (error) {
        toast.error("Failed to delete service");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      titleEn: "",
      titleHi: "",
      descriptionEn: "",
      descriptionHi: "",
      durationMinutes: "",
      priceInr: "",
      iconUrl: "",
      imageUrl: "",
      order: "0",
    });
    setEditingId(null);
    setShowForm(false);
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
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">{t("admin.services")}</h2>
        <Button
          onClick={() => {
            if (showForm) resetForm();
            else setShowForm(true);
          }}
          className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {t("admin.add")}
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title (EN)</label>
                <Input
                  name="titleEn"
                  value={formData.titleEn}
                  onChange={handleChange}
                  required
                  placeholder="Service title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title (HI)</label>
                <Input
                  name="titleHi"
                  value={formData.titleHi}
                  onChange={handleChange}
                  required
                  placeholder="सेवा का शीर्षक"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description (EN)</label>
                <Textarea
                  name="descriptionEn"
                  value={formData.descriptionEn}
                  onChange={handleChange}
                  placeholder="Service description"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description (HI)</label>
                <Textarea
                  name="descriptionHi"
                  value={formData.descriptionHi}
                  onChange={handleChange}
                  placeholder="सेवा का विवरण"
                  rows={3}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (mins)</label>
                <Input
                  type="number"
                  name="durationMinutes"
                  value={formData.durationMinutes}
                  onChange={handleChange}
                  placeholder="60"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                <Input
                  type="text"
                  name="priceInr"
                  value={formData.priceInr}
                  onChange={handleChange}
                  placeholder="1000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                <Input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Icon URL</label>
                <Input
                  type="url"
                  name="iconUrl"
                  value={formData.iconUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/icon.png"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <Input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  t("admin.save")
                )}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                {t("admin.cancel")}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Services List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services?.map((service) => (
          <Card key={service.id} className="p-6 hover:shadow-lg transition-shadow">
            {service.imageUrl && (
              <img src={service.imageUrl} alt={service.titleEn} className="w-full h-40 object-cover rounded-lg mb-4" />
            )}
            <h3 className="text-lg font-bold text-gray-800">{service.titleEn}</h3>
            <p className="text-sm text-gray-600 mt-2">{service.descriptionEn}</p>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-gray-600">{service.durationMinutes} mins</span>
              <span className="font-bold text-green-600">₹{service.priceInr}</span>
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setFormData({
                    titleEn: service.titleEn,
                    titleHi: service.titleHi,
                    descriptionEn: service.descriptionEn || "",
                    descriptionHi: service.descriptionHi || "",
                    durationMinutes: service.durationMinutes?.toString() || "",
                    priceInr: service.priceInr?.toString() || "",
                    iconUrl: service.iconUrl || "",
                    imageUrl: service.imageUrl || "",
                    order: service.order?.toString() || "0",
                  });
                  setEditingId(service.id);
                  setShowForm(true);
                }}
                className="flex-1 flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                {t("admin.edit")}
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(service.id)}
                className="flex-1 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                {t("admin.delete")}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {(!services || services.length === 0) && !showForm && (
        <Card className="p-12 text-center">
          <p className="text-gray-500 text-lg">No services yet. Create one to get started!</p>
        </Card>
      )}
    </div>
  );
}
