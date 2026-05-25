import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminClinicInfo from "@/components/admin/AdminClinicInfo";
import AdminServices from "@/components/admin/AdminServices";
import AdminBlog from "@/components/admin/AdminBlog";
import AdminTestimonials from "@/components/admin/AdminTestimonials";
import AdminFAQs from "@/components/admin/AdminFAQs";
import AdminGallery from "@/components/admin/AdminGallery";
import AdminAppointments from "@/components/admin/AdminAppointments";
import AdminTeam from "@/components/admin/AdminTeam";
import AdminSidebar from "@/components/admin/AdminSidebar";

type AdminSection = "dashboard" | "clinic" | "services" | "blog" | "testimonials" | "faqs" | "gallery" | "appointments" | "team";

export default function AdminPanel() {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const [activeSection, setActiveSection] = useState<AdminSection>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Redirect to home if not admin
  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      setLocation("/");
    }
  }, [user, loading, setLocation]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">{t("admin.title")}</h1>
          <div className="text-sm text-gray-600">
            Welcome, <span className="font-semibold">{user.name || "Admin"}</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {activeSection === "dashboard" && <AdminDashboard />}
            {activeSection === "clinic" && <AdminClinicInfo />}
            {activeSection === "services" && <AdminServices />}
            {activeSection === "blog" && <AdminBlog />}
            {activeSection === "testimonials" && <AdminTestimonials />}
            {activeSection === "faqs" && <AdminFAQs />}
            {activeSection === "gallery" && <AdminGallery />}
            {activeSection === "appointments" && <AdminAppointments />}
            {activeSection === "team" && <AdminTeam />}
          </div>
        </div>
      </div>
    </div>
  );
}
