import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus, X } from "lucide-react";

interface CourseAboutProps {
  course: {
    id: string;
    title: string;
    description: string | null;
    long_description: string | null;
    image_url: string | null;
    lesson_count: number | null;
    enrollee_count: number | null;
    created_at: string;
    locked: boolean;
    format: string;
    learning_outcomes: string | null;
    price: number | null;
  };
}

const CourseAbout = ({ course }: CourseAboutProps) => {
  const [title, setTitle] = useState(course.title);
  const [description, setDescription] = useState(course.description || "");
  const [longDescription, setLongDescription] = useState(course.long_description || "");
  const [imageUrl, setImageUrl] = useState(course.image_url || "");
  const [format, setFormat] = useState(course.format || "Online");
  
  // Parse learning outcomes from string to array for UI
  const parseLearningOutcomes = (outcomes: string | null): string[] => {
    if (!outcomes) return [];
    return outcomes.split('\n').filter(outcome => outcome.trim());
  };
  
  const [learningOutcomes, setLearningOutcomes] = useState<string[]>(
    parseLearningOutcomes(course.learning_outcomes)
  );
  const [price, setPrice] = useState(course.price?.toString() || "0");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Convert learning outcomes array back to string
      const learningOutcomesString = learningOutcomes
        .filter(outcome => outcome.trim())
        .join('\n');

      const { error } = await supabase
        .from("courses")
        .update({
          title,
          description,
          long_description: longDescription,
          image_url: imageUrl,
          format,
          learning_outcomes: learningOutcomesString,
          price: parseFloat(price),
        })
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

  const addLearningOutcome = () => {
    setLearningOutcomes([...learningOutcomes, ""]);
  };

  const removeLearningOutcome = (index: number) => {
    setLearningOutcomes(learningOutcomes.filter((_, i) => i !== index));
  };

  const updateLearningOutcome = (index: number, value: string) => {
    const newOutcomes = [...learningOutcomes];
    newOutcomes[index] = value;
    setLearningOutcomes(newOutcomes);
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
        <label className="text-sm font-medium">Short Description</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief course description"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Long Description</label>
        <Textarea
          value={longDescription}
          onChange={(e) => setLongDescription(e.target.value)}
          placeholder="Detailed course description"
          rows={6}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Format</label>
        <Select value={format} onValueChange={setFormat}>
          <SelectTrigger>
            <SelectValue placeholder="Select format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Online">Online</SelectItem>
            <SelectItem value="Hybrid">Hybrid</SelectItem>
            <SelectItem value="In-Person">In-Person</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Price</label>
        <Input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Course price"
          min="0"
          step="0.01"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Learning Outcomes</label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addLearningOutcome}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Outcome
          </Button>
        </div>
        <div className="space-y-2">
          {learningOutcomes.map((outcome, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={outcome}
                onChange={(e) => updateLearningOutcome(index, e.target.value)}
                placeholder={`Learning outcome ${index + 1}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeLearningOutcome(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
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
