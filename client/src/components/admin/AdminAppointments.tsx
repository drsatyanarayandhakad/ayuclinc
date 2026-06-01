import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export default function AdminAppointments() {
  const { data: appointments, isLoading } = trpc.admin.appointments.list.useQuery();
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Appointments</h2>
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
                  <h3 className="font-semibold text-gray-900">{appointment.patientName}</h3>
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
                  <p className="text-sm text-gray-600">Message (EN)</p>
                  <p className="font-semibold">{selectedAppointment.messageEn}</p>
                </div>
              )}
              {selectedAppointment.notes && (
                <div>
                  <p className="text-sm text-gray-600">Notes</p>
                  <p className="font-semibold">{selectedAppointment.notes}</p>
                </div>
              )}
            </div>
            <div className="mt-6 flex gap-3">
              <Button variant="outline" onClick={() => setSelectedAppointment(null)}>
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
