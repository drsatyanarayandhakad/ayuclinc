import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit2, Trash2, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function AdminBlog() {
  const { t } = useLanguage();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const publishMutation = trpc.admin.blog.update.useMutation();

  const [formData, setFormData] = useState({
    titleEn: "",
    titleHi: "",
    slugEn: "",
    slugHi: "",
    contentEn: "",
    contentHi: "",
    excerptEn: "",
    excerptHi: "",
    featuredImageUrl: "",
    authorName: "",
    isPublished: true,
  });

  const { data: blogPosts, refetch } = trpc.admin.blog.list.useQuery();
  const createMutation = trpc.admin.blog.create.useMutation();
  const updateMutation = trpc.admin.blog.update.useMutation();
  const deleteMutation = trpc.admin.blog.delete.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.titleEn || !formData.titleHi || !formData.contentEn || !formData.contentHi) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          ...formData,
        });
        toast.success("Blog post updated successfully");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("Blog post created successfully");
      }

      setFormData({
        titleEn: "",
        titleHi: "",
        slugEn: "",
        slugHi: "",
        contentEn: "",
        contentHi: "",
        excerptEn: "",
        excerptHi: "",
        featuredImageUrl: "",
        authorName: "",
        isPublished: true,
      });
      setEditingId(null);
      setShowForm(false);
      refetch();
    } catch (error) {
      toast.error("Failed to save blog post");
    }
  };

  const handleEdit = (post: any) => {
    setFormData({
      titleEn: post.titleEn,
      titleHi: post.titleHi,
      slugEn: post.slugEn,
      slugHi: post.slugHi,
      contentEn: post.contentEn,
      contentHi: post.contentHi,
      excerptEn: post.excerptEn || "",
      excerptHi: post.excerptHi || "",
      featuredImageUrl: post.featuredImageUrl || "",
      authorName: post.authorName || "",
      isPublished: post.isPublished ?? true,
    });
    setEditingId(post.id);
    setShowForm(true);
  };

  const handleTogglePublish = async (post: any) => {
    try {
      await publishMutation.mutateAsync({ id: post.id, isPublished: !post.isPublished });
      toast.success(post.isPublished ? "Blog hidden from site" : "Blog published on site!");
      refetch();
    } catch {
      toast.error("Failed to update publish status");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      try {
        await deleteMutation.mutateAsync({ id });
        toast.success("Blog post deleted successfully");
        refetch();
      } catch (error) {
        toast.error("Failed to delete blog post");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">{t("admin.blog")}</h2>
        <Button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({
              titleEn: "",
              titleHi: "",
              slugEn: "",
              slugHi: "",
              contentEn: "",
              contentHi: "",
              excerptEn: "",
              excerptHi: "",
              featuredImageUrl: "",
              authorName: "",
              isPublished: true,
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
                  Title (English)
                </label>
                <Input
                  value={formData.titleEn}
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                  placeholder="Enter title in English"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title (Hindi)
                </label>
                <Input
                  value={formData.titleHi}
                  onChange={(e) => setFormData({ ...formData, titleHi: e.target.value })}
                  placeholder="शीर्षक दर्ज करें"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug (English)
                </label>
                <Input
                  value={formData.slugEn}
                  onChange={(e) => setFormData({ ...formData, slugEn: e.target.value })}
                  placeholder="slug-in-english"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug (Hindi)
                </label>
                <Input
                  value={formData.slugHi}
                  onChange={(e) => setFormData({ ...formData, slugHi: e.target.value })}
                  placeholder="slug-hindi-mein"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Excerpt (English)
                </label>
                <Textarea
                  value={formData.excerptEn}
                  onChange={(e) => setFormData({ ...formData, excerptEn: e.target.value })}
                  placeholder="Brief summary in English"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Excerpt (Hindi)
                </label>
                <Textarea
                  value={formData.excerptHi}
                  onChange={(e) => setFormData({ ...formData, excerptHi: e.target.value })}
                  placeholder="संक्षिप्त सारांश"
                  rows={2}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content (English)
                </label>
                <Textarea
                  value={formData.contentEn}
                  onChange={(e) => setFormData({ ...formData, contentEn: e.target.value })}
                  placeholder="Full content in English"
                  rows={6}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content (Hindi)
                </label>
                <Textarea
                  value={formData.contentHi}
                  onChange={(e) => setFormData({ ...formData, contentHi: e.target.value })}
                  placeholder="पूरी सामग्री"
                  rows={6}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Author Name</label>
                <Input
                  value={formData.authorName}
                  onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                  placeholder="Dr. Sharma"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image URL</label>
                <Input
                  type="url"
                  value={formData.featuredImageUrl}
                  onChange={(e) => setFormData({ ...formData, featuredImageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="w-4 h-4 accent-green-600"
                />
                <span className="text-sm font-medium text-gray-700">Publish immediately (visible on site)</span>
              </label>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : editingId ? "Update Post" : "Create Post"}
              </Button>
              <Button
                type="button"
                onClick={() => { setShowForm(false); setEditingId(null); }}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid gap-4">
        {blogPosts && blogPosts.length > 0 ? (
          blogPosts.map((post) => (
            <Card key={post.id} className={`p-4 ${!post.isPublished ? "border-yellow-200 bg-yellow-50/30" : ""}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-gray-800">{post.titleEn}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${post.isPublished ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {post.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{post.titleHi}</p>
                  <p className="text-xs text-gray-500 mt-1">{post.excerptEn}</p>
                  {post.authorName && <p className="text-xs text-gray-400 mt-1">by {post.authorName}</p>}
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    onClick={() => handleTogglePublish(post)}
                    size="sm"
                    variant="outline"
                    disabled={publishMutation.isPending}
                    title={post.isPublished ? "Hide from site" : "Publish on site"}
                    className={post.isPublished ? "text-yellow-600 border-yellow-200" : "text-green-600 border-green-200"}
                  >
                    {post.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    onClick={() => handleEdit(post)}
                    size="sm"
                    variant="outline"
                    className="text-blue-600"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(post.id)}
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
            <p className="text-gray-500 text-lg">No blog posts yet. Create your first one!</p>
          </Card>
        )}
      </div>
    </div>
  );
}
