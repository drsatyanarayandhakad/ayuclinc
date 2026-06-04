import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function AdminFAQs() {
  const { t } = useLanguage();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    questionEn: "",
    questionHi: "",
    answerEn: "",
    answerHi: "",
    order: "0",
  });

  const { data: faqs, refetch } = trpc.admin.faqs.list.useQuery();
  const createMutation = trpc.admin.faqs.create.useMutation();
  const updateMutation = trpc.admin.faqs.update.useMutation();
  const deleteMutation = trpc.admin.faqs.delete.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.questionEn || !formData.answerEn) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          questionEn: formData.questionEn,
          questionHi: formData.questionHi || undefined,
          answerEn: formData.answerEn,
          answerHi: formData.answerHi || undefined,
          order: parseInt(formData.order) || 0,
        });
        toast.success("FAQ updated successfully");
      } else {
        await createMutation.mutateAsync({
          questionEn: formData.questionEn,
          questionHi: formData.questionHi || undefined,
          answerEn: formData.answerEn,
          answerHi: formData.answerHi || undefined,
          order: parseInt(formData.order) || 0,
        });
        toast.success("FAQ created successfully");
      }

      setFormData({
        questionEn: "",
        questionHi: "",
        answerEn: "",
        answerHi: "",
        order: "0",
      });
      setEditingId(null);
      setShowForm(false);
      refetch();
    } catch (error) {
      toast.error("Failed to save FAQ");
    }
  };

  const handleEdit = (faq: any) => {
    setFormData({
      questionEn: faq.questionEn,
      questionHi: faq.questionHi || "",
      answerEn: faq.answerEn,
      answerHi: faq.answerHi || "",
      order: faq.order?.toString() || "0",
    });
    setEditingId(faq.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this FAQ?")) {
      try {
        await deleteMutation.mutateAsync({ id });
        toast.success("FAQ deleted successfully");
        refetch();
      } catch (error) {
        toast.error("Failed to delete FAQ");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">{t("admin.faqs")}</h2>
        <Button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({
              questionEn: "",
              questionHi: "",
              answerEn: "",
              answerHi: "",
              order: "0",
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
                  Question (English) *
                </label>
                <Input
                  value={formData.questionEn}
                  onChange={(e) => setFormData({ ...formData, questionEn: e.target.value })}
                  placeholder="Enter question in English"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question (Hindi)
                </label>
                <Input
                  value={formData.questionHi}
                  onChange={(e) => setFormData({ ...formData, questionHi: e.target.value })}
                  placeholder="प्रश्न हिंदी में दर्ज करें"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Answer (English) *
                </label>
                <Textarea
                  value={formData.answerEn}
                  onChange={(e) => setFormData({ ...formData, answerEn: e.target.value })}
                  placeholder="Full answer in English"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Answer (Hindi)
                </label>
                <Textarea
                  value={formData.answerHi}
                  onChange={(e) => setFormData({ ...formData, answerHi: e.target.value })}
                  placeholder="पूरा उत्तर हिंदी में"
                  rows={4}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order (Display Sequence)
              </label>
              <Input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                placeholder="0"
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                {editingId ? "Update FAQ" : "Create FAQ"}
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
        {faqs && faqs.length > 0 ? (
          faqs.map((faq) => (
            <Card key={faq.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{faq.questionEn}</h3>
                  <p className="text-sm text-gray-600 mt-1">{faq.questionHi}</p>
                  <p className="text-sm text-gray-700 mt-3 leading-relaxed">{faq.answerEn}</p>
                  {faq.answerHi && (
                    <p className="text-sm text-gray-700 mt-2 leading-relaxed">{faq.answerHi}</p>
                  )}
                  {faq.order !== undefined && faq.order !== null && (
                    <p className="text-xs text-gray-500 mt-2">Order: {faq.order}</p>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(faq)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(faq.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-8 text-center">
            <p className="text-gray-500">No FAQs yet. Create one to get started!</p>
          </Card>
        )}
      </div>
    </div>
  );
}
