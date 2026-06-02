import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import CloudinaryUpload from "@/components/CloudinaryUpload";

export default function AdminGallery() {
  const { t } = useLanguage();
  const [titleEn, setTitleEn] = useState("");
  const [titleHi, setTitleHi] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const { data: images = [], isLoading, refetch } = trpc.admin.gallery.list.useQuery();
  const createMutation = trpc.admin.gallery.create.useMutation();
  const deleteMutation = trpc.admin.gallery.delete.useMutation();

  const handleUploadSuccess = (url: string) => {
    setImageUrl(url);
    toast.success("Image uploaded successfully!");
  };

  const handleAddImage = async () => {
    if (!titleEn || !imageUrl) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsAdding(true);
    try {
      await createMutation.mutateAsync({
        titleEn,
        titleHi: titleHi || titleEn,
        imageUrl,
      });
      setTitleEn("");
      setTitleHi("");
      setImageUrl("");
      await refetch();
      toast.success("Image added successfully!");
    } catch (error) {
      toast.error("Failed to add image");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      await deleteMutation.mutateAsync({ id });
      await refetch();
      toast.success("Image deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete image");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">{t("admin.gallery")}</h2>

      {/* Add New Image */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Title (English)</label>
            <Input
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              placeholder="Enter image title"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Title (Hindi)</label>
            <Input
              value={titleHi}
              onChange={(e) => setTitleHi(e.target.value)}
              placeholder="Enter image title in Hindi"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Upload Image</label>
            <CloudinaryUpload onUploadSuccess={handleUploadSuccess} folder="gallery" />
          </div>

          {imageUrl && (
            <div className="space-y-2">
              <label className="block text-sm font-medium">Preview</label>
              <img src={imageUrl} alt="Preview" className="max-h-48 rounded-lg" />
            </div>
          )}

          <Button onClick={handleAddImage} disabled={isAdding} className="w-full">
            {isAdding ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add Image
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Gallery List */}
      <Card>
        <CardHeader>
          <CardTitle>Gallery Images</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-green-600" />
            </div>
          ) : images.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No images yet</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => (
                <div key={image.id} className="relative group">
                  {image.imageUrl ? (
                    <>
                      <img
                        src={image.imageUrl}
                        alt={image.titleEn || "Gallery image"}
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(image.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500">No image</span>
                    </div>
                  )}
                  <p className="text-sm font-medium mt-2 truncate">{image.titleEn || "Untitled"}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
