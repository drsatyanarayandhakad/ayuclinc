import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import {
  LayoutDashboard,
  Building2,
  Stethoscope,
  BookOpen,
  MessageSquare,
  HelpCircle,
  Images,
  Calendar,
  Users,
  Share2,
  Mail,
  Inbox,
  LogOut,
  Menu,
  X,
  Leaf,
} from "lucide-react";

type AdminSection = "dashboard" | "clinic" | "services" | "blog" | "testimonials" | "faqs" | "gallery" | "appointments" | "team" | "social" | "newsletter" | "contact";

interface AdminSidebarProps {
  activeSection: AdminSection;
  setActiveSection: (section: AdminSection) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function AdminSidebar({
  activeSection,
  setActiveSection,
  sidebarOpen,
  setSidebarOpen,
}: AdminSidebarProps) {
  const { t } = useLanguage();
  const { logout } = useAuth();
  const logoutMutation = trpc.auth.logout.useMutation();

  const menuItems = [
    { id: "dashboard" as AdminSection, label: t("admin.dashboard"), icon: LayoutDashboard },
    { id: "clinic" as AdminSection, label: t("admin.clinicInfo"), icon: Building2 },
    { id: "services" as AdminSection, label: t("admin.services"), icon: Stethoscope },
    { id: "blog" as AdminSection, label: t("admin.blog"), icon: BookOpen },
    { id: "testimonials" as AdminSection, label: t("admin.testimonials"), icon: MessageSquare },
    { id: "faqs" as AdminSection, label: t("admin.faqs"), icon: HelpCircle },
    { id: "gallery" as AdminSection, label: t("admin.gallery"), icon: Images },
    { id: "appointments" as AdminSection, label: t("admin.appointments"), icon: Calendar },
    { id: "team" as AdminSection, label: t("admin.team"), icon: Users },
    { id: "social" as AdminSection, label: "Social Media", icon: Share2 },
    { id: "newsletter" as AdminSection, label: "Newsletter", icon: Mail },
    { id: "contact" as AdminSection, label: "Contact Messages", icon: Inbox },
  ];

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    logout?.();
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 bg-white rounded-lg shadow-md"
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed md:relative md:translate-x-0 transition-transform duration-300 w-64 h-screen bg-gray-900 text-white flex flex-col z-40`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
            <Leaf className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Ayurveda</h2>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-green-600 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-800">
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="w-full flex items-center justify-center gap-2"
            disabled={logoutMutation.isPending}
          >
            <LogOut className="w-4 h-4" />
            {t("admin.logout")}
          </Button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}
