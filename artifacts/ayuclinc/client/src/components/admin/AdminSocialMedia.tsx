import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save, Facebook, Instagram, Youtube, MessageCircle, Twitter } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function AdminSocialMedia() {
  const { data: info, isLoading } = trpc.clinic.getInfo.useQuery();
  const updateMutation = trpc.clinic.updateInfo.useMutation();

  const [formData, setFormData] = useState({
    facebookUrl: "",
    instagramUrl: "",
    twitterUrl: "",
    youtubeUrl: "",
    whatsappNumber: "",
    whatsappMessage: "",
  });

  useEffect(() => {
    if (info) {
      setFormData({
        facebookUrl: info.facebookUrl || "",
        instagramUrl: info.instagramUrl || "",
        twitterUrl: info.twitterUrl || "",
        youtubeUrl: info.youtubeUrl || "",
        whatsappNumber: info.whatsappNumber || "",
        whatsappMessage: info.whatsappMessage || "",
      });
    }
  }, [info]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMutation.mutateAsync(formData);
      toast.success("Social media links saved!");
    } catch {
      toast.error("Failed to save links");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  const fields = [
    {
      name: "facebookUrl",
      label: "Facebook",
      icon: Facebook,
      color: "text-blue-600",
      placeholder: "https://facebook.com/yourpage",
    },
    {
      name: "instagramUrl",
      label: "Instagram",
      icon: Instagram,
      color: "text-pink-600",
      placeholder: "https://instagram.com/yourhandle",
    },
    {
      name: "twitterUrl",
      label: "Twitter / X",
      icon: Twitter,
      color: "text-sky-500",
      placeholder: "https://twitter.com/yourhandle",
    },
    {
      name: "youtubeUrl",
      label: "YouTube",
      icon: Youtube,
      color: "text-red-600",
      placeholder: "https://youtube.com/@yourchannel",
    },
    {
      name: "whatsappNumber",
      label: "WhatsApp Number",
      icon: MessageCircle,
      color: "text-green-600",
      placeholder: "919876543210  (country code + number)",
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Social Media</h2>

      <Card className="p-6">
        <p className="text-sm text-gray-500 mb-6">
          Enter your social media profile links. These will appear in the website footer. Leave blank to hide.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {fields.map(({ name, label, icon: Icon, color, placeholder }) => (
            <div key={name} className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg bg-gray-50 border flex items-center justify-center shrink-0 ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <Input
                  name={name}
                  value={formData[name as keyof typeof formData]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  type={name === "whatsappNumber" ? "tel" : "url"}
                />
              </div>
            </div>
          ))}

          {/* WhatsApp Auto-Reply Message */}
          <div className="mt-2 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-white border flex items-center justify-center shrink-0 text-green-600">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-800 mb-1">
                  WhatsApp Auto-Reply Message
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  This message will be pre-filled automatically when a visitor clicks the WhatsApp button on your website.
                </p>
                <Textarea
                  name="whatsappMessage"
                  value={formData.whatsappMessage}
                  onChange={handleChange}
                  placeholder="Hello, I would like to book an appointment at AyuClinic."
                  rows={3}
                  className="text-sm"
                />
                {formData.whatsappMessage && formData.whatsappNumber && (
                  <a
                    href={`https://wa.me/${formData.whatsappNumber}?text=${encodeURIComponent(formData.whatsappMessage)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 mt-2 text-xs text-green-600 hover:underline"
                  >
                    <MessageCircle className="w-3 h-3" /> Preview WhatsApp link
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 gap-2"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Links
            </Button>
          </div>
        </form>
      </Card>

      {/* Preview */}
      {(formData.facebookUrl || formData.instagramUrl || formData.twitterUrl || formData.youtubeUrl || formData.whatsappNumber) && (
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-3">Active Links Preview</h3>
          <div className="flex flex-wrap gap-3">
            {formData.facebookUrl && (
              <a href={formData.facebookUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                <Facebook className="w-4 h-4" /> Facebook
              </a>
            )}
            {formData.instagramUrl && (
              <a href={formData.instagramUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-pink-600 hover:underline">
                <Instagram className="w-4 h-4" /> Instagram
              </a>
            )}
            {formData.twitterUrl && (
              <a href={formData.twitterUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-sky-500 hover:underline">
                <Twitter className="w-4 h-4" /> Twitter/X
              </a>
            )}
            {formData.youtubeUrl && (
              <a href={formData.youtubeUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-red-600 hover:underline">
                <Youtube className="w-4 h-4" /> YouTube
              </a>
            )}
            {formData.whatsappNumber && (
              <a href={`https://wa.me/${formData.whatsappNumber}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-green-600 hover:underline">
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
