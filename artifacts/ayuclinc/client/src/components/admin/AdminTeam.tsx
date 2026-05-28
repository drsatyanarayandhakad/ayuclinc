import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Trash2, Edit2, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const emptyForm = {
  nameEn: "",
  nameHi: "",
  titleEn: "",
  titleHi: "",
  bioEn: "",
  bioHi: "",
  imageUrl: "",
  order: "0",
};

export default function AdminTeam() {
  const { data: members, isLoading, refetch } = trpc.team.list.useQuery();
  const createMutation = trpc.team.create.useMutation();
  const updateMutation = trpc.team.update.useMutation();
  const deleteMutation = trpc.team.delete.useMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState(emptyForm);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, ...formData, order: parseInt(formData.order) });
        toast.success("Team member updated!");
      } else {
        await createMutation.mutateAsync({ ...formData, order: parseInt(formData.order) });
        toast.success("Team member added!");
      }
      resetForm();
      refetch();
    } catch {
      toast.error("Failed to save team member");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this team member?")) return;
    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("Deleted!");
      refetch();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (m: NonNullable<typeof members>[number]) => {
    setFormData({
      nameEn: m.nameEn,
      nameHi: m.nameHi,
      titleEn: m.titleEn || "",
      titleHi: m.titleHi || "",
      bioEn: m.bioEn || "",
      bioHi: m.bioHi || "",
      imageUrl: m.imageUrl || "",
      order: m.order?.toString() || "0",
    });
    setEditingId(m.id);
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
        <h2 className="text-3xl font-bold text-gray-800">Team Members</h2>
        <Button
          onClick={() => (showForm && !editingId ? resetForm() : setShowForm(true))}
          className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Member
        </Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            {editingId ? "Edit Member" : "New Team Member"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name (EN) *</label>
                <Input name="nameEn" value={formData.nameEn} onChange={handleChange} required placeholder="Dr. Sharma" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name (HI) *</label>
                <Input name="nameHi" value={formData.nameHi} onChange={handleChange} required placeholder="डॉ. शर्मा" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Designation (EN)</label>
                <Input name="titleEn" value={formData.titleEn} onChange={handleChange} placeholder="Chief Ayurveda Physician" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Designation (HI)</label>
                <Input name="titleHi" value={formData.titleHi} onChange={handleChange} placeholder="मुख्य आयुर्वेद चिकित्सक" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio (EN)</label>
                <Textarea name="bioEn" value={formData.bioEn} onChange={handleChange} rows={3} placeholder="15+ years experience in Panchakarma..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio (HI)</label>
                <Textarea name="bioHi" value={formData.bioHi} onChange={handleChange} rows={3} placeholder="पंचकर्म में 15+ वर्षों का अनुभव..." />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Photo URL</label>
                <Input type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="https://example.com/photo.jpg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                <Input type="number" name="order" value={formData.order} onChange={handleChange} placeholder="0" />
              </div>
            </div>

            {formData.imageUrl && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Preview:</p>
                <img src={formData.imageUrl} alt="preview" className="w-20 h-20 object-cover rounded-full border" />
              </div>
            )}

            <div className="flex gap-3">
              <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : editingId ? "Update" : "Save"}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members?.map((m) => (
          <Card key={m.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              {m.imageUrl ? (
                <img src={m.imageUrl} alt={m.nameEn} className="w-16 h-16 object-cover rounded-full border-2 border-green-100 shrink-0" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <Users className="w-7 h-7 text-green-600" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-800 truncate">{m.nameEn}</h3>
                <p className="text-sm text-green-600 font-medium truncate">{m.titleEn}</p>
                <p className="text-xs text-gray-500 mt-0.5 truncate">{m.nameHi}</p>
                {m.bioEn && <p className="text-xs text-gray-500 mt-2 line-clamp-2">{m.bioEn}</p>}
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button size="sm" variant="outline" onClick={() => startEdit(m)} className="flex-1 gap-1 text-xs">
                <Edit2 className="w-3 h-3" /> Edit
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleDelete(m.id)} className="flex-1 gap-1 text-xs" disabled={deleteMutation.isPending}>
                <Trash2 className="w-3 h-3" /> Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {(!members || members.length === 0) && !showForm && (
        <Card className="p-12 text-center">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No team members yet.</p>
          <p className="text-gray-400 text-sm mt-1">Add your doctors and staff here.</p>
        </Card>
      )}
    </div>
  );
}
