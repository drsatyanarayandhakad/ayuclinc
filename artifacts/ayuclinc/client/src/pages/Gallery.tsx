import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { X } from "lucide-react";

export default function Gallery() {
  const { t, language } = useLanguage();
  const { data: galleryImages, isLoading } = trpc.gallery.list.useQuery();
  const [selectedImage, setSelectedImage] = useState<any>(null);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            {t("gallery.title") || "Gallery"}
          </h1>
          <p className="text-xl text-gray-600">
            {language === "en"
              ? "Explore our clinic and treatment spaces"
              : "हमारे क्लिनिक और उपचार स्थानों को देखें"}
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">
                {language === "en" ? "Loading gallery..." : "गैलरी लोड हो रही है..."}
              </p>
            </div>
          ) : galleryImages && galleryImages.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryImages.map((image) => (
                  <Card
                    key={image.id}
                    className="overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300 group"
                    onClick={() => setSelectedImage(image)}
                  >
                    <div className="relative overflow-hidden bg-gray-200 h-64">
                      <img
                        src={image.imageUrl || "/placeholder-gallery.jpg"}
                        alt={language === "en" ? (image.titleEn || "") : (image.titleHi || "")}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                        <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {language === "en" ? "View" : "देखें"}
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-gray-700 font-semibold">
                        {language === "en" ? image.titleEn : image.titleHi}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Lightbox Modal */}
              {selectedImage && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                  <div className="relative max-w-4xl w-full">
                    <button
                      onClick={() => setSelectedImage(null)}
                      className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
                    >
                      <X className="w-8 h-8" />
                    </button>
                    <img
                      src={selectedImage.imageUrl || "/placeholder-gallery.jpg"}
                      alt={language === "en" ? selectedImage.titleEn : selectedImage.titleHi}
                      className="w-full h-auto rounded-lg"
                    />
                    <div className="mt-4 bg-white p-4 rounded-lg">
                      <p className="text-gray-800 font-semibold">
                        {language === "en" ? selectedImage.titleEn : selectedImage.titleHi}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                {language === "en"
                  ? "Gallery images coming soon"
                  : "गैलरी की तस्वीरें जल्द ही आएंगी"}
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
