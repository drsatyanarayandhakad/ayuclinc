import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Trash2, Edit2, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const emptyForm = {
  questionEn: "",
  questionHi: "",
  answerEn: "",
  answerHi: "",
  order: "0",
};

export default function AdminFAQs() {
  const { data: faqs, isLoading, refetch } = trpc.faqs.list.useQuery();
  const createMutation = trpc.faqs.create.useMutation();
  const updateMutation = trpc.faqs.update.useMutation();
  const deleteMutation = trpc.faqs.delete.useMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [formData, setFormData] = useState(emptyForm);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          ...formData,
          order: parseInt(formData.order),
        });
        toast.success("FAQ updated!");
      } else {
        await createMutation.mutateAsync({
          ...formData,
          order: parseInt(formData.order),
        });
        toast.success("FAQ created!");
      }
      resetForm();
      refetch();
    } catch {
      toast.error("Failed to save FAQ");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this FAQ?")) return;
    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("FAQ deleted!");
      refetch();
    } catch {
      toast.error("Failed to delete FAQ");
    }
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (faq: NonNullable<typeof faqs>[number]) => {
    setFormData({
      questionEn: faq.questionEn,
      questionHi: faq.questionHi,
      answerEn: faq.answerEn || "",
      answerHi: faq.answerHi || "",
      order: faq.order?.toString() || "0",
    });
    setEditingId(faq.id);
    setShowForm(true);
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
        <h2 className="text-3xl font-bold text-gray-800">FAQs</h2>
        <Button
          onClick={() => (showForm && !editingId ? resetForm() : setShowForm(true))}
          className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add FAQ
        </Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            {editingId ? "Edit FAQ" : "New FAQ"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question (English) <span className="text-red-500">*</span>
                </label>
                <Input
                  name="questionEn"
                  value={formData.questionEn}
                  onChange={handleChange}
                  required
                  placeholder="What treatments do you offer?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question (Hindi) <span className="text-red-500">*</span>
                </label>
                <Input
                  name="questionHi"
                  value={formData.questionHi}
                  onChange={handleChange}
                  required
                  placeholder="आप कौन से उपचार प्रदान करते हैं?"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Answer (English)
                </label>
                <Textarea
                  name="answerEn"
                  value={formData.answerEn}
                  onChange={handleChange}
                  placeholder="We offer a wide range of Ayurvedic treatments..."
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Answer (Hindi)
                </label>
                <Textarea
                  name="answerHi"
                  value={formData.answerHi}
                  onChange={handleChange}
                  placeholder="हम कई प्रकार के आयुर्वेदिक उपचार प्रदान करते हैं..."
                  rows={4}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-32">
                <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                <Input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>
              <div className="flex gap-3 mt-5">
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : editingId ? "Update" : "Save"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-3">
        {faqs?.map((faq, idx) => (
          <Card key={faq.id} className="overflow-hidden">
            <div
              className="p-4 flex items-start justify-between gap-4 cursor-pointer hover:bg-gray-50"
              onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
            >
              <div className="flex items-start gap-3 flex-1">
                <span className="text-xs font-bold text-gray-400 mt-1 w-5 shrink-0">
                  {idx + 1}
                </span>
                <div>
                  <p className="font-medium text-gray-800">{faq.questionEn}</p>
                  <p className="text-sm text-gray-500">{faq.questionHi}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => { e.stopPropagation(); startEdit(faq); }}
                  className="text-gray-500 hover:text-green-600"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => { e.stopPropagation(); handleDelete(faq.id); }}
                  className="text-gray-500 hover:text-red-600"
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                {expandedId === faq.id ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>

            {expandedId === faq.id && (
              <div className="px-4 pb-4 pt-0 border-t border-gray-100 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-1">Answer (EN)</p>
                    <p className="text-sm text-gray-700">{faq.answerEn || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-1">Answer (HI)</p>
                    <p className="text-sm text-gray-700">{faq.answerHi || "—"}</p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {(!faqs || faqs.length === 0) && !showForm && (
        <Card className="p-12 text-center">
          <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No FAQs yet.</p>
          <p className="text-gray-400 text-sm mt-1">Add questions your patients commonly ask.</p>
        </Card>
      )}
    </div>
  );
}
