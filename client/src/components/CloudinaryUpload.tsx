import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";

interface CloudinaryUploadProps {
  onUploadSuccess: (url: string, publicId: string) => void;
  folder?: string;
  accept?: string;
}

export default function CloudinaryUpload({
  onUploadSuccess,
  folder = "ayurveda-clinic",
  accept = "image/*",
}: CloudinaryUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setFileName(file.name);

    try {
      // Convert file to buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Call the upload API
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          file: Array.from(new Uint8Array(buffer)),
          fileName: file.name,
          folder,
        }),
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      onUploadSuccess(data.secure_url || data.url, data.public_id);
      toast.success("File uploaded successfully!");
      setFileName("");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload file");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        disabled={isLoading}
        className="hidden"
        id="cloudinary-upload"
      />
      <label htmlFor="cloudinary-upload">
        <Button
          type="button"
          variant="outline"
          disabled={isLoading}
          onClick={() => document.getElementById("cloudinary-upload")?.click()}
          className="cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Image
            </>
          )}
        </Button>
      </label>
      {fileName && <span className="text-sm text-gray-600">{fileName}</span>}
    </div>
  );
}
