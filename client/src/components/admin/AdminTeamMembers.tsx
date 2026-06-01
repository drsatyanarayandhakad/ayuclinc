import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, Edit2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminTeamMembers() {
  const { data: teamMembers, isLoading, refetch } = trpc.admin.team.list.useQuery();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nameEn: "",
    nameHi: "",
    titleEn: "",
    titleHi: "",
    bioEn: "",
    bioHi: "",
    imageUrl: "",
  });

  const createMutation = trpc.admin.team.create.useMutation({
    onSuccess: () => {
      toast.success("Team member added successfully");
      setFormData({ nameEn: "", nameHi: "", titleEn: "", titleHi: "", bioEn: "", bioHi: "", imageUrl: "" });
      setIsAdding(false);
      refetch();
    },
    onError: () => toast.error("Failed to add team member"),
  });

  const updateMutation = trpc.admin.team.update.useMutation({
    onSuccess: () => {
      toast.success("Team member updated successfully");
      setFormData({ nameEn: "", nameHi: "", titleEn: "", titleHi: "", bioEn: "", bioHi: "", imageUrl: "" });
      setEditingId(null);
      refetch();
    },
    onError: () => toast.error("Failed to update team member"),
  });

  const deleteMutation = trpc.admin.team.delete.useMutation({
    onSuccess: () => {
      toast.success("Team member deleted successfully");
      refetch();
    },
    onError: () => toast.error("Failed to delete team member"),
  });

  const handleSubmit = () => {
    if (!formData.nameEn.trim()) {
      toast.error("Name (EN) is required");
      return;
    }

    if (editingId) {
      updateMutation.mutate({ id: editingId, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (member: { id: number; nameEn?: string | null; nameHi?: string | null; titleEn?: string | null; titleHi?: string | null; bioEn?: string | null; bioHi?: string | null; imageUrl?: string | null }) => {
    setFormData({
      nameEn: member.nameEn || "",
      nameHi: member.nameHi || "",
      titleEn: member.titleEn || "",
      titleHi: member.titleHi || "",
      bioEn: member.bioEn || "",
      bioHi: member.bioHi || "",
      imageUrl: member.imageUrl || "",
    });
    setEditingId(member.id);
    setIsAdding(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Team Members</h2>
          <p className="text-gray-600">Manage clinic staff and team</p>
        </div>
        <Button
          onClick={() => {
            setIsAdding(!isAdding);
            setEditingId(null);
            setFormData({ nameEn: "", nameHi: "", titleEn: "", titleHi: "", bioEn: "", bioHi: "", imageUrl: "" });
          }}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Member
        </Button>
      </div>

      {isAdding && (
        <Card className="p-6 bg-green-50 border-green-200">
          <h3 className="text-lg font-semibold mb-4">{editingId ? "Edit Team Member" : "Add New Team Member"}</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name (English)</label>
                <Input
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  placeholder="Enter name in English"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name (Hindi)</label>
                <Input
                  value={formData.nameHi}
                  onChange={(e) => setFormData({ ...formData, nameHi: e.target.value })}
                  placeholder="नाम हिंदी में दर्ज करें"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title (English)</label>
                <Input
                  value={formData.titleEn}
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                  placeholder="e.g., Lead Ayurveda Practitioner"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title (Hindi)</label>
                <Input
                  value={formData.titleHi}
                  onChange={(e) => setFormData({ ...formData, titleHi: e.target.value })}
                  placeholder="e.g., मुख्य आयुर्वेद चिकित्सक"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio (English)</label>
              <Textarea
                value={formData.bioEn}
                onChange={(e) => setFormData({ ...formData, bioEn: e.target.value })}
                placeholder="Enter bio in English"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio (Hindi)</label>
              <Textarea
                value={formData.bioHi}
                onChange={(e) => setFormData({ ...formData, bioHi: e.target.value })}
                placeholder="हिंदी में बायो दर्ज करें"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
              <Input
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSubmit}
                disabled={createMutation.isPending || updateMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                {editingId ? "Update" : "Add"} Member
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAdding(false);
                  setEditingId(null);
                  setFormData({ nameEn: "", nameHi: "", titleEn: "", titleHi: "", bioEn: "", bioHi: "", imageUrl: "" });
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {isLoading ? (
        <Card className="p-8 text-center">
          <p className="text-gray-600">Loading team members...</p>
        </Card>
      ) : teamMembers && teamMembers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teamMembers.map((member) => (
            <Card key={member.id} className="p-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-gray-900">{member.nameEn}</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(member)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteMutation.mutate({ id: member.id })}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-600">{member.titleEn}</p>
              {member.bioEn && <p className="text-sm text-gray-700 mt-2">{member.bioEn}</p>}
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <p className="text-gray-600">No team members yet. Add one to get started!</p>
        </Card>
      )}
    </div>
  );
}
