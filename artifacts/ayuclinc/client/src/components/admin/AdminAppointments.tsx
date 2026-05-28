import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Phone, Mail, Calendar, Clock, User, MessageSquare } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const STATUS_COLORS: Record<string, string> = {
  pending:   "bg-yellow-100 text-yellow-800 border-yellow-200",
  confirmed: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
  completed: "bg-blue-100 text-blue-800 border-blue-200",
};

const STATUS_LABELS: Record<string, string> = {
  pending:   "Pending",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
  completed: "Completed",
};

export default function AdminAppointments() {
  const { data: appointments, isLoading, refetch } = trpc.appointments.list.useQuery();
  const updateStatus = trpc.appointments.updateStatus.useMutation();
  const [notesMap, setNotesMap] = useState<Record<number, string>>({});
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const handleStatusChange = async (
    id: number,
    status: "pending" | "confirmed" | "cancelled" | "completed"
  ) => {
    setUpdatingId(id);
    try {
      await updateStatus.mutateAsync({ id, status, notes: notesMap[id] });
      toast.success("Status updated!");
      refetch();
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Appointments</h2>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {appointments?.length || 0} total
        </span>
      </div>

      {appointments && appointments.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(["pending", "confirmed", "cancelled", "completed"] as const).map((s) => (
            <Card key={s} className={`p-4 border ${STATUS_COLORS[s]}`}>
              <p className="text-2xl font-bold">
                {appointments.filter((a) => a.status === s).length}
              </p>
              <p className="text-sm font-medium mt-1">{STATUS_LABELS[s]}</p>
            </Card>
          ))}
        </div>
      )}

      <div className="space-y-4">
        {appointments?.map((apt) => (
          <Card key={apt.id} className="p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="font-semibold text-gray-800">{apt.patientName}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_COLORS[apt.status ?? "pending"]}`}
                  >
                    {STATUS_LABELS[apt.status ?? "pending"]}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {apt.patientPhone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {apt.patientEmail}
                  </span>
                  {apt.appointmentDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(apt.appointmentDate).toLocaleDateString("en-IN")}
                    </span>
                  )}
                  {apt.appointmentTime && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {apt.appointmentTime}
                    </span>
                  )}
                </div>

                {apt.messageEn && (
                  <div className="flex items-start gap-1 text-sm text-gray-500">
                    <MessageSquare className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <span className="italic">"{apt.messageEn}"</span>
                  </div>
                )}

                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Add internal notes (optional)..."
                    value={notesMap[apt.id] ?? apt.notes ?? ""}
                    onChange={(e) =>
                      setNotesMap((m) => ({ ...m, [apt.id]: e.target.value }))
                    }
                    className="text-sm border border-gray-200 rounded px-3 py-1 w-full md:w-80 focus:outline-none focus:border-green-400"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 md:flex-col md:min-w-36">
                {(
                  ["confirmed", "completed", "cancelled", "pending"] as const
                )
                  .filter((s) => s !== apt.status)
                  .map((s) => (
                    <Button
                      key={s}
                      size="sm"
                      variant="outline"
                      disabled={updatingId === apt.id}
                      onClick={() => handleStatusChange(apt.id, s)}
                      className={`text-xs ${
                        s === "confirmed"
                          ? "border-green-300 text-green-700 hover:bg-green-50"
                          : s === "cancelled"
                          ? "border-red-300 text-red-700 hover:bg-red-50"
                          : s === "completed"
                          ? "border-blue-300 text-blue-700 hover:bg-blue-50"
                          : "border-gray-300 text-gray-700"
                      }`}
                    >
                      {updatingId === apt.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        `→ ${STATUS_LABELS[s]}`
                      )}
                    </Button>
                  ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {(!appointments || appointments.length === 0) && (
        <Card className="p-12 text-center">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No appointments yet.</p>
          <p className="text-gray-400 text-sm mt-1">
            New bookings from the website will appear here.
          </p>
        </Card>
      )}
    </div>
  );
}
