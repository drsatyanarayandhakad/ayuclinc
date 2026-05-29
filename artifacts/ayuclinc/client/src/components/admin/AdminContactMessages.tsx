import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, Mail, Phone, MessageSquare, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function AdminContactMessages() {
  const { data: messages, isLoading, refetch } = trpc.contact.list.useQuery();
  const markReadMutation = trpc.contact.markRead.useMutation();
  const deleteMutation = trpc.contact.delete.useMutation();

  const handleMarkRead = async (id: number) => {
    try {
      await markReadMutation.mutateAsync({ id });
      refetch();
    } catch {
      toast.error("Failed to update");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this message?")) return;
    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("Message deleted!");
      refetch();
    } catch {
      toast.error("Failed to delete");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  const unread = messages?.filter((m) => !m.isRead).length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Contact Messages</h2>
        <div className="flex items-center gap-2">
          {unread > 0 && (
            <span className="bg-red-100 text-red-700 text-sm px-3 py-1 rounded-full font-medium">
              {unread} unread
            </span>
          )}
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {messages?.length || 0} total
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {messages?.map((msg) => (
          <Card
            key={msg.id}
            className={`p-5 ${!msg.isRead ? "border-l-4 border-l-green-500 bg-green-50/30" : ""}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-gray-800">{msg.name}</span>
                  {!msg.isRead && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                      New
                    </span>
                  )}
                  <span className="text-xs text-gray-400">
                    {new Date(msg.createdAt).toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {msg.email}
                  </span>
                  {msg.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {msg.phone}
                    </span>
                  )}
                </div>

                {msg.subject && (
                  <p className="text-sm font-medium text-gray-700">
                    Subject: {msg.subject}
                  </p>
                )}

                <div className="flex items-start gap-2 text-sm text-gray-700 bg-white rounded-lg p-3 border border-gray-100">
                  <MessageSquare className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                  <p>{msg.message}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2 shrink-0">
                {!msg.isRead && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleMarkRead(msg.id)}
                    disabled={markReadMutation.isPending}
                    className="gap-1 text-xs text-green-700 border-green-200 hover:bg-green-50"
                  >
                    <CheckCircle className="w-3 h-3" />
                    Mark Read
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(msg.id)}
                  disabled={deleteMutation.isPending}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 gap-1 text-xs"
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {(!messages || messages.length === 0) && (
        <Card className="p-12 text-center">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No messages yet.</p>
          <p className="text-gray-400 text-sm mt-1">
            Messages from the Contact page will appear here.
          </p>
        </Card>
      )}
    </div>
  );
}
