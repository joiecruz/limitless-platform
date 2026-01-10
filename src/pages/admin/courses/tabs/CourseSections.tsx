import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2, Plus, Pencil, Trash2, GripVertical, ChevronUp, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CourseSectionsProps {
  courseId: string;
}

interface CourseSection {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

const CourseSections = ({ courseId }: CourseSectionsProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<CourseSection | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const { data: sections, isLoading } = useQuery({
    queryKey: ["course-sections", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("course_sections")
        .select("*")
        .eq("course_id", courseId)
        .order("order_index");

      if (error) throw error;
      return data as CourseSection[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: { title: string; description: string }) => {
      if (selectedSection) {
        const { error } = await supabase
          .from("course_sections")
          .update({
            title: data.title,
            description: data.description || null,
          })
          .eq("id", selectedSection.id);
        if (error) throw error;
      } else {
        const nextOrder = (sections?.length || 0);
        const { error } = await supabase
          .from("course_sections")
          .insert({
            course_id: courseId,
            title: data.title,
            description: data.description || null,
            order_index: nextOrder,
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-sections", courseId] });
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: selectedSection ? "Section updated" : "Section created",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save section",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (sectionId: string) => {
      const { error } = await supabase
        .from("course_sections")
        .delete()
        .eq("id", sectionId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-sections", courseId] });
      toast({
        title: "Success",
        description: "Section deleted",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete section",
        variant: "destructive",
      });
    },
  });

  const reorderMutation = useMutation({
    mutationFn: async ({ sectionId, newIndex }: { sectionId: string; newIndex: number }) => {
      const { error } = await supabase
        .from("course_sections")
        .update({ order_index: newIndex })
        .eq("id", sectionId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-sections", courseId] });
    },
  });

  const handleOpenDialog = (section?: CourseSection) => {
    if (section) {
      setSelectedSection(section);
      setFormData({
        title: section.title,
        description: section.description || "",
      });
    } else {
      setSelectedSection(null);
      setFormData({ title: "", description: "" });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }
    saveMutation.mutate(formData);
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    if (!sections) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const currentSection = sections[index];
    const targetSection = sections[targetIndex];

    // Swap order indices
    reorderMutation.mutate({ sectionId: currentSection.id, newIndex: targetSection.order_index });
    reorderMutation.mutate({ sectionId: targetSection.id, newIndex: currentSection.order_index });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Sections (Modules)</h2>
          <p className="text-sm text-muted-foreground">
            Organize your lessons into sections. Lessons can then be assigned to these sections.
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Section
        </Button>
      </div>

      {sections && sections.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Order</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sections.map((section, index) => (
              <TableRow key={section.id}>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => handleMove(index, "up")}
                      disabled={index === 0}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => handleMove(index, "down")}
                      disabled={index === sections.length - 1}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground ml-1">{index + 1}</span>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{section.title}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {section.description || "—"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenDialog(section)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => deleteMutation.mutate(section.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="border border-dashed rounded-lg p-8 text-center">
          <p className="text-muted-foreground mb-2">No sections created yet</p>
          <p className="text-sm text-muted-foreground">
            Create sections to organize your lessons into logical modules
          </p>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedSection ? "Edit Section" : "Add New Section"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Introduction, Module 1, Getting Started"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description (Optional)</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of what this section covers"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={saveMutation.isPending}>
              {saveMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {selectedSection ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseSections;
