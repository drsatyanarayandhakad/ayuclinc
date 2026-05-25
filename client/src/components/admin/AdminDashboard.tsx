import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function AdminDashboard() {
  const { t } = useLanguage();
  const { data: services, isLoading: servicesLoading } = trpc.services.list.useQuery();
  const { data: appointments, isLoading: appointmentsLoading } = trpc.appointments.list.useQuery();
  const { data: blogPosts, isLoading: blogLoading } = trpc.blog.list.useQuery();
  const { data: testimonials, isLoading: testimonialsLoading } = trpc.testimonials.list.useQuery();

  const isLoading = servicesLoading || appointmentsLoading || blogLoading || testimonialsLoading;

  // Chart data
  const chartData = [
    { name: "Services", value: services?.length || 0 },
    { name: "Blog Posts", value: blogPosts?.length || 0 },
    { name: "Testimonials", value: testimonials?.length || 0 },
    { name: "Appointments", value: appointments?.length || 0 },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">{t("admin.dashboard")}</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Services</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{services?.length || 0}</p>
            </div>
            <div className="text-4xl text-blue-200">📋</div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Blog Posts</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{blogPosts?.length || 0}</p>
            </div>
            <div className="text-4xl text-green-200">📝</div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Testimonials</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">{testimonials?.length || 0}</p>
            </div>
            <div className="text-4xl text-purple-200">⭐</div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Appointments</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">{appointments?.length || 0}</p>
            </div>
            <div className="text-4xl text-orange-200">📅</div>
          </div>
        </Card>
      </div>

      {/* Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Content Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#16a34a" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Appointments</h3>
          <div className="space-y-3">
            {appointments?.slice(0, 5).map((apt) => (
              <div key={apt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{apt.patientName}</p>
                  <p className="text-sm text-gray-600">{apt.patientEmail}</p>
                </div>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    apt.status === "confirmed"
                      ? "bg-green-100 text-green-800"
                      : apt.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {apt.status}
                </span>
              </div>
            ))}
            {(!appointments || appointments.length === 0) && (
              <p className="text-gray-500 text-sm">No appointments yet</p>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="font-medium text-blue-900">Add New Service</p>
              <p className="text-sm text-blue-700 mt-1">Create a new service offering</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="font-medium text-green-900">Write Blog Post</p>
              <p className="text-sm text-green-700 mt-1">Share wellness tips with patients</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <p className="font-medium text-purple-900">Upload Gallery Images</p>
              <p className="text-sm text-purple-700 mt-1">Add photos of your clinic</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
