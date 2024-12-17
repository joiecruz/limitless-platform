import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface CourseAboutProps {
  course: {
    id: string;
    title: string;
    description: string | null;
    image_url: string | null;
    lesson_count: number | null;
    enrollee_count: number | null;
    created_at: string;
    locked: boolean;
  };
}

const CourseAbout = ({ course }: CourseAboutProps) => {
  const [title, setTitle] = useState(course.title);
  const [description, setDescription] = useState(course.description || "");
  const [imageUrl, setImageUrl] = useState(course.image_url || "");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("courses")
        .update({ title, description, image_url: imageUrl })
        .eq("id", course.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Course details updated successfully",
      });
    } catch (error) {
      console.error("Error updating course:", error);
      toast({
        title: "Error",
        description: "Failed to update course details",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Title</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Course title"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Course description"
          rows={5}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Image URL</label>
        <Input
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Course image URL"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">Created At</label>
          <div className="text-sm text-muted-foreground">
            {new Date(course.created_at).toLocaleDateString()}
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Status</label>
          <div className="text-sm text-muted-foreground">
            {course.locked ? "Locked" : "Active"}
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Total Lessons</label>
          <div className="text-sm text-muted-foreground">
            {course.lesson_count || 0}
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Total Enrollments</label>
          <div className="text-sm text-muted-foreground">
            {course.enrollee_count || 0}
          </div>
        </div>
      </div>

      <Button onClick={handleSave} disabled={isSaving}>
        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save Changes
      </Button>
    </div>
  );
};

export default CourseAbout;