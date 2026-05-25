import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function BlogDetail() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-5xl font-bold text-gray-900 mb-8">Blog Post</h1>
        <p className="text-lg text-gray-600">Blog detail page coming soon</p>
      </div>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
