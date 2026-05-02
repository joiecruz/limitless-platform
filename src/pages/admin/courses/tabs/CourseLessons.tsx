import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Plus, ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { RichTextEditor } from "@/components/admin/blog/RichTextEditor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CourseLessonsProps {
  courseId: string;
}

interface CourseSection {
  id: string;
  title: string;
  order_index: number;
}

interface LessonFormData {
  title: string;
  description: string;
  video_url: string;
  body_content: string;
  order: number;
  duration: number;
  section_id: string | null;
}

const CourseLessons = ({ courseId }: CourseLessonsProps) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [formData, setFormData] = useState<LessonFormData>({
    title: "",
    description: "",
    video_url: "",
    body_content: "",
    order: 0,
    duration: 0,
    section_id: null,
  });
  const [activeTab, setActiveTab] = useState("basic");
  const [lessonToDelete, setLessonToDelete] = useState<any>(null);

  const { data: lessons, isLoading, refetch } = useQuery({
    queryKey: ["course-lessons", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lessons")
        .select("id, title, description, duration, order, section_id, course_id")
        .eq("course_id", courseId)
        .order("order");

      if (error) throw error;
      return data;
    },
  });

  const { data: sections = [] } = useQuery({
    queryKey: ["course-sections", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("course_sections")
        .select("id, title, description, order_index, course_id")
        .eq("course_id", courseId)
        .order("order_index");

      if (error) throw error;
      return data as CourseSection[];
    },
  });

  const getSectionTitle = (sectionId: string | null) => {
    if (!sectionId) return null;
    const section = sections.find((s) => s.id === sectionId);
    return section?.title || null;
  };

  const handleEditLesson = async (lesson: any) => {
    setSelectedLesson(lesson);
    
    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .eq("id", lesson.id)
      .single();
      
    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch lesson details",
        variant: "destructive",
      });
      return;
    }
    
    setFormData({
      title: data.title,
      description: data.description || "",
      video_url: data.video_url || "",
      body_content: data.body_content || "",
      order: data.order,
      duration: data.duration || 0,
      section_id: data.section_id || null,
    });
    
    setIsDialogOpen(true);
  };

  const handleAddLesson = () => {
    setSelectedLesson(null);
    setFormData({
      title: "",
      description: "",
      video_url: "",
      body_content: "",
      order: (lessons?.length || 0) + 1,
      duration: 0,
      section_id: null,
    });
    setActiveTab("basic");
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const dataToSave = {
        title: formData.title,
        description: formData.description,
        video_url: formData.video_url,
        body_content: formData.body_content,
        order: formData.order,
        duration: formData.duration,
        section_id: formData.section_id,
      };

      if (selectedLesson) {
        const { error } = await supabase
          .from("lessons")
          .update(dataToSave)
          .eq("id", selectedLesson.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Lesson updated successfully",
        });
      } else {
        const { error } = await supabase
          .from("lessons")
          .insert([{ ...dataToSave, course_id: courseId }]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Lesson created successfully",
        });
      }
      setIsDialogOpen(false);
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save lesson",
        variant: "destructive",
      });
    }
  };

  const handleMoveLesson = async (lessonId: string, direction: "up" | "down") => {
    if (!lessons) return;

    const sortedLessons = [...lessons].sort((a, b) => a.order - b.order);
    const currentIndex = sortedLessons.findIndex((l) => l.id === lessonId);

    if (
      (direction === "up" && currentIndex === 0) ||
      (direction === "down" && currentIndex === sortedLessons.length - 1)
    ) {
      return;
    }

    const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const currentLesson = sortedLessons[currentIndex];
    const swapLesson = sortedLessons[swapIndex];

    try {
      // Swap the order values
      await supabase
        .from("lessons")
        .update({ order: swapLesson.order })
        .eq("id", currentLesson.id);

      await supabase
        .from("lessons")
        .update({ order: currentLesson.order })
        .eq("id", swapLesson.id);

      refetch();
      toast({
        title: "Success",
        description: "Lesson order updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reorder lesson",
        variant: "destructive",
      });
    }
  };

  const handleDeleteLesson = async () => {
    if (!lessonToDelete) return;

    try {
      const { error } = await supabase
        .from("lessons")
        .delete()
        .eq("id", lessonToDelete.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Lesson deleted successfully",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete lesson",
        variant: "destructive",
      });
    } finally {
      setLessonToDelete(null);
    }
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
        <h2 className="text-xl font-semibold">Lessons</h2>
        <Button onClick={handleAddLesson}>
          <Plus className="h-4 w-4 mr-2" />
          Add Lesson
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Section</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lessons?.map((lesson) => {
            const sectionTitle = getSectionTitle(lesson.section_id);
            return (
              <TableRow key={lesson.id}>
                <TableCell>{lesson.order}</TableCell>
                <TableCell>{lesson.title}</TableCell>
                <TableCell>
                  {sectionTitle ? (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {sectionTitle}
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-xs">None</span>
                  )}
                </TableCell>
                <TableCell>{lesson.duration ? `${lesson.duration} min` : "N/A"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleMoveLesson(lesson.id, "up")}
                      disabled={lessons?.indexOf(lesson) === 0}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleMoveLesson(lesson.id, "down")}
                      disabled={lessons?.indexOf(lesson) === (lessons?.length || 0) - 1}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditLesson(lesson)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => setLessonToDelete(lesson)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedLesson ? "Edit Lesson" : "Add New Lesson"}
            </DialogTitle>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="content">Lesson Content</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Lesson title"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Lesson description"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Section (Optional)</label>
                <Select
                  value={formData.section_id || "none"}
                  onValueChange={(value) => setFormData({ ...formData, section_id: value === "none" ? null : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a section" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Section</SelectItem>
                    {sections.map((section) => (
                      <SelectItem key={section.id} value={section.id}>
                        {section.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Assign this lesson to a section/module. Create sections in the "Sections" tab first.
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Video URL</label>
                <Input
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  placeholder="Video URL"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Order</label>
                  <Input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Duration (minutes)</label>
                  <Input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="content" className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Lesson Content</label>
                <RichTextEditor
                  value={formData.body_content}
                  onChange={(value) => setFormData({ ...formData, body_content: value })}
                  blogId={selectedLesson?.id}
                  className="min-h-[400px]"
                />
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end pt-4">
            <Button onClick={handleSubmit} className="w-full">
              {selectedLesson ? "Update Lesson" : "Create Lesson"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!lessonToDelete} onOpenChange={() => setLessonToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Lesson</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{lessonToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteLesson}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CourseLessons;
