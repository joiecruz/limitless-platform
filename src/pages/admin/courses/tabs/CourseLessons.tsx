
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
import { Loader2, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { RichTextEditor } from "@/components/admin/blog/RichTextEditor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CourseLessonsProps {
  courseId: string;
}

interface LessonFormData {
  title: string;
  description: string;
  video_url: string;
  body_content: string;
  order: number;
  duration: number;
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
  });
  const [activeTab, setActiveTab] = useState("basic");

  const { data: lessons, isLoading, refetch } = useQuery({
    queryKey: ["course-lessons", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lessons")
        .select("*")
        .eq("course_id", courseId)
        .order("order");

      if (error) throw error;
      return data;
    },
  });

  const handleEditLesson = async (lesson: any) => {
    setSelectedLesson(lesson);
    
    // Fetch the full lesson data including body_content
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
    });
    setActiveTab("basic");
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (selectedLesson) {
        const { error } = await supabase
          .from("lessons")
          .update(formData)
          .eq("id", selectedLesson.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Lesson updated successfully",
        });
      } else {
        const { error } = await supabase
          .from("lessons")
          .insert([{ ...formData, course_id: courseId }]);

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
            <TableHead>Duration</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lessons?.map((lesson) => (
            <TableRow key={lesson.id}>
              <TableCell>{lesson.order}</TableCell>
              <TableCell>{lesson.title}</TableCell>
              <TableCell>{lesson.duration || "N/A"}</TableCell>
              <TableCell>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleEditLesson(lesson)}
                >
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
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
    </div>
  );
};

export default CourseLessons;
