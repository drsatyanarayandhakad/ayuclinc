import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminAppointments() {
  const { data: appointments, isLoading, refetch } = trpc.admin.appointments.list.useQuery();
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  
  const updateStatusMutation = trpc.admin.appointments.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Status updated successfully");
      refetch();
      setSelectedAppointment(null);
    },
    onError: (error) => {
      toast.error("Failed to update status");
    },
  });

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleStatusChange = (appointmentId: number, newStatus: string) => {
    updateStatusMutation.mutate({ id: appointmentId, status: newStatus as any });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Appointments Management</h2>
        <p className="text-gray-600">View and manage patient appointments</p>
      </div>

      {isLoading ? (
        <Card className="p-8 text-center">
          <p className="text-gray-600">Loading appointments...</p>
        </Card>
      ) : appointments && appointments.length > 0 ? (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <Card key={appointment.id} className="p-4 border-l-4 border-l-green-600">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{appointment.patientName}</h3>
                    <Badge className={getStatusColor(appointment.status || 'pending')}>
                      {(appointment.status || 'pending').toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{appointment.patientEmail}</p>
                  <p className="text-sm text-gray-600">{appointment.patientPhone}</p>
                  <p className="text-sm text-gray-700 mt-2">
                    <strong>Date:</strong> {appointment.appointmentDate ? new Date(appointment.appointmentDate).toLocaleDateString() : 'N/A'}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Time:</strong> {appointment.appointmentTime || 'N/A'}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedAppointment(appointment)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <p className="text-gray-600">No appointments yet</p>
        </Card>
      )}

      {selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">Appointment Details</h3>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Patient Name</p>
                <p className="font-semibold">{selectedAppointment.patientName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold">{selectedAppointment.patientEmail}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-semibold">{selectedAppointment.patientPhone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Appointment Date</p>
                <p className="font-semibold">
                  {selectedAppointment.appointmentDate ? new Date(selectedAppointment.appointmentDate).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Appointment Time</p>
                <p className="font-semibold">{selectedAppointment.appointmentTime || 'N/A'}</p>
              </div>
              {selectedAppointment.messageEn && (
                <div>
                  <p className="text-sm text-gray-600">Message</p>
                  <p className="font-semibold">{selectedAppointment.messageEn}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600 mb-2">Status</p>
                <Badge className={getStatusColor(selectedAppointment.status)}>
                  {selectedAppointment.status?.toUpperCase()}
                </Badge>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <div className="flex gap-2 flex-wrap">
                {["pending", "confirmed", "cancelled", "completed"].map((status) => (
                  <Button
                    key={status}
                    variant={selectedAppointment.status === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleStatusChange(selectedAppointment.id, status)}
                    disabled={updateStatusMutation.isPending}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Button>
                ))}
              </div>
              <Button variant="outline" onClick={() => setSelectedAppointment(null)} className="w-full">
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
