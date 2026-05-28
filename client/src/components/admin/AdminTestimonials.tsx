import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function AdminTestimonials() {
  const { t } = useLanguage();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    patientNameEn: "",
    patientNameHi: "",
    testimonialEn: "",
    testimonialHi: "",
    rating: "5",
  });

  const { data: testimonials, refetch } = trpc.admin.testimonials.list.useQuery();
  const createMutation = trpc.admin.testimonials.create.useMutation();
  const updateMutation = trpc.admin.testimonials.update.useMutation();
  const deleteMutation = trpc.admin.testimonials.delete.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.patientNameEn || !formData.testimonialEn) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          ...formData,
          rating: parseInt(formData.rating),
        });
        toast.success("Testimonial updated successfully");
      } else {
        await createMutation.mutateAsync({
          ...formData,
          rating: parseInt(formData.rating),
        });
        toast.success("Testimonial created successfully");
      }

      setFormData({
        patientNameEn: "",
        patientNameHi: "",
        testimonialEn: "",
        testimonialHi: "",
        rating: "5",
      });
      setEditingId(null);
      setShowForm(false);
      refetch();
    } catch (error) {
      toast.error("Failed to save testimonial");
    }
  };

  const handleEdit = (testimonial: any) => {
    setFormData({
      patientNameEn: testimonial.patientNameEn,
      patientNameHi: testimonial.patientNameHi || "",
      testimonialEn: testimonial.testimonialEn || "",
      testimonialHi: testimonial.testimonialHi || "",
      rating: testimonial.rating?.toString() || "5",
    });
    setEditingId(testimonial.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this testimonial?")) {
      try {
        await deleteMutation.mutateAsync({ id });
        toast.success("Testimonial deleted successfully");
        refetch();
      } catch (error) {
        toast.error("Failed to delete testimonial");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">{t("admin.testimonials")}</h2>
        <Button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({
              patientNameEn: "",
              patientNameHi: "",
              testimonialEn: "",
              testimonialHi: "",
              rating: "5",
            });
          }}
          className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {t("admin.add")}
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 bg-green-50 border-green-200">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patient Name (English)
                </label>
                <Input
                  value={formData.patientNameEn}
                  onChange={(e) => setFormData({ ...formData, patientNameEn: e.target.value })}
                  placeholder="Patient name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patient Name (Hindi)
                </label>
                <Input
                  value={formData.patientNameHi}
                  onChange={(e) => setFormData({ ...formData, patientNameHi: e.target.value })}
                  placeholder="रोगी का नाम"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Testimonial (English)
                </label>
                <Textarea
                  value={formData.testimonialEn}
                  onChange={(e) => setFormData({ ...formData, testimonialEn: e.target.value })}
                  placeholder="Share your experience"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Testimonial (Hindi)
                </label>
                <Textarea
                  value={formData.testimonialHi}
                  onChange={(e) => setFormData({ ...formData, testimonialHi: e.target.value })}
                  placeholder="अपना अनुभव साझा करें"
                  rows={4}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <select
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                {editingId ? "Update" : "Create"}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid gap-4">
        {testimonials && testimonials.length > 0 ? (
          testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{testimonial.patientNameEn}</h3>
                  <p className="text-sm text-gray-700 mt-2">"{testimonial.testimonialEn}"</p>
                  <div className="text-yellow-500 text-sm mt-2">{"⭐".repeat(testimonial.rating || 5)}</div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEdit(testimonial)}
                    size="sm"
                    variant="outline"
                    className="text-blue-600"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(testimonial.id)}
                    size="sm"
                    variant="outline"
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-12 text-center">
            <p className="text-gray-500 text-lg">No testimonials yet. Add your first one!</p>
          </Card>
        )}
      </div>
    </div>
  );
}
