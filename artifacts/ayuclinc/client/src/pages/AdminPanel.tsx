import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation, Link } from "wouter";
import { useEffect, useState } from "react";
import { Loader2, LogOut, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminClinicInfo from "@/components/admin/AdminClinicInfo";
import AdminServices from "@/components/admin/AdminServices";
import AdminBlog from "@/components/admin/AdminBlog";
import AdminTestimonials from "@/components/admin/AdminTestimonials";
import AdminFAQs from "@/components/admin/AdminFAQs";
import AdminGallery from "@/components/admin/AdminGallery";
import AdminAppointments from "@/components/admin/AdminAppointments";
import AdminTeam from "@/components/admin/AdminTeam";
import AdminSocialMedia from "@/components/admin/AdminSocialMedia";
import AdminNewsletter from "@/components/admin/AdminNewsletter";
import AdminContactMessages from "@/components/admin/AdminContactMessages";
import AdminSidebar from "@/components/admin/AdminSidebar";

type AdminSection = "dashboard" | "clinic" | "services" | "blog" | "testimonials" | "faqs" | "gallery" | "appointments" | "team" | "social" | "newsletter" | "contact";

export default function AdminPanel() {
  const { user, loading, logout } = useAuth();
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const [activeSection, setActiveSection] = useState<AdminSection>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Redirect to admin login if not authenticated as admin
  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      setLocation("/admin/login");
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
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 hidden sm:inline">
              Welcome, <span className="font-semibold">{user.name || "Admin"}</span>
            </span>
            <Link href="/">
              <Button variant="outline" size="sm" className="gap-2 text-gray-600 hover:text-green-700">
                <ExternalLink className="w-4 h-4" />
                <span className="hidden sm:inline">View Site</span>
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
              onClick={async () => {
                await logout();
                window.location.href = "/admin/login";
              }}
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
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
            {activeSection === "social" && <AdminSocialMedia />}
            {activeSection === "newsletter" && <AdminNewsletter />}
            {activeSection === "contact" && <AdminContactMessages />}
          </div>
        </div>
      </div>
    </div>
  );
}
