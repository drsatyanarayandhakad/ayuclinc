import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, Mail, Users } from "lucide-react";
import { toast } from "sonner";

export default function AdminNewsletter() {
  const { data: subscribers, isLoading, refetch } = trpc.newsletter.list.useQuery();
  const deleteMutation = trpc.newsletter.delete.useMutation();

  const handleDelete = async (id: number, email: string) => {
    if (!confirm(`Remove ${email} from subscribers?`)) return;
    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("Subscriber removed!");
      refetch();
    } catch {
      toast.error("Failed to remove subscriber");
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
        <h2 className="text-3xl font-bold text-gray-800">Newsletter Subscribers</h2>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {subscribers?.length || 0} subscribers
        </span>
      </div>

      {subscribers && subscribers.length > 0 ? (
        <Card className="overflow-hidden">
          <div className="divide-y divide-gray-100">
            {subscribers.map((sub, idx) => (
              <div key={sub.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 w-6">{idx + 1}</span>
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Mail className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{sub.email}</p>
                    <p className="text-xs text-gray-400">
                      {sub.language === "hi" ? "Hindi" : "English"} •{" "}
                      {new Date(sub.subscribedAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(sub.id, sub.email)}
                  disabled={deleteMutation.isPending}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <Card className="p-12 text-center">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No subscribers yet.</p>
          <p className="text-gray-400 text-sm mt-1">
            Visitors who subscribe on the blog page will appear here.
          </p>
        </Card>
      )}
    </div>
  );
}
