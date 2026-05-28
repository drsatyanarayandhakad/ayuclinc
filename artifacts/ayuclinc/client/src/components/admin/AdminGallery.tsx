import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Trash2, Edit2, Images } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const emptyForm = {
  titleEn: "",
  titleHi: "",
  imageUrl: "",
  thumbnailUrl: "",
  categoryEn: "",
  categoryHi: "",
  order: "0",
};

export default function AdminGallery() {
  const { data: images, isLoading, refetch } = trpc.gallery.list.useQuery();
  const createMutation = trpc.gallery.create.useMutation();
  const updateMutation = trpc.gallery.update.useMutation();
  const deleteMutation = trpc.gallery.delete.useMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState(emptyForm);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, ...formData, order: parseInt(formData.order) });
        toast.success("Image updated!");
      } else {
        await createMutation.mutateAsync({ ...formData, order: parseInt(formData.order) });
        toast.success("Image added to gallery!");
      }
      resetForm();
      refetch();
    } catch {
      toast.error("Failed to save image");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Remove this image from gallery?")) return;
    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("Image removed!");
      refetch();
    } catch {
      toast.error("Failed to remove image");
    }
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (img: NonNullable<typeof images>[number]) => {
    setFormData({
      titleEn: img.titleEn || "",
      titleHi: img.titleHi || "",
      imageUrl: img.imageUrl,
      thumbnailUrl: img.thumbnailUrl || "",
      categoryEn: img.categoryEn || "",
      categoryHi: img.categoryHi || "",
      order: img.order?.toString() || "0",
    });
    setEditingId(img.id);
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
        <h2 className="text-3xl font-bold text-gray-800">Gallery</h2>
        <Button
          onClick={() => (showForm && !editingId ? resetForm() : setShowForm(true))}
          className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Image
        </Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            {editingId ? "Edit Image" : "Add New Image"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL *</label>
              <Input type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} required placeholder="https://example.com/clinic-photo.jpg" />
            </div>

            {formData.imageUrl && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Preview:</p>
                <img src={formData.imageUrl} alt="preview" className="h-32 w-auto object-cover rounded-lg border" onError={(e) => (e.currentTarget.style.display = "none")} />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title (EN)</label>
                <Input name="titleEn" value={formData.titleEn} onChange={handleChange} placeholder="Reception Area" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title (HI)</label>
                <Input name="titleHi" value={formData.titleHi} onChange={handleChange} placeholder="रिसेप्शन क्षेत्र" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category (EN)</label>
                <Input name="categoryEn" value={formData.categoryEn} onChange={handleChange} placeholder="Clinic, Treatment, Team..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category (HI)</label>
                <Input name="categoryHi" value={formData.categoryHi} onChange={handleChange} placeholder="क्लिनिक, उपचार, टीम..." />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL (optional)</label>
                <Input type="url" name="thumbnailUrl" value={formData.thumbnailUrl} onChange={handleChange} placeholder="https://example.com/thumb.jpg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                <Input type="number" name="order" value={formData.order} onChange={handleChange} placeholder="0" />
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : editingId ? "Update" : "Save"}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images?.map((img) => (
          <Card key={img.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
            <div className="relative aspect-square">
              <img
                src={img.thumbnailUrl || img.imageUrl}
                alt={img.titleEn || "Gallery"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/300x300/e8f5e9/4caf50?text=Image";
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <Button size="sm" variant="secondary" onClick={() => startEdit(img)} className="text-xs">
                  <Edit2 className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(img.id)} disabled={deleteMutation.isPending} className="text-xs">
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <div className="p-2">
              {img.titleEn && <p className="text-xs font-medium text-gray-700 truncate">{img.titleEn}</p>}
              {img.categoryEn && <p className="text-xs text-gray-400 truncate">{img.categoryEn}</p>}
            </div>
          </Card>
        ))}
      </div>

      {(!images || images.length === 0) && !showForm && (
        <Card className="p-12 text-center">
          <Images className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Gallery is empty.</p>
          <p className="text-gray-400 text-sm mt-1">Add clinic photos to showcase your facility.</p>
        </Card>
      )}
    </div>
  );
}
