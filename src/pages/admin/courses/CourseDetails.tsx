
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import CourseAbout from "./tabs/CourseAbout";
import CourseLessons from "./tabs/CourseLessons";
import CourseUsers from "./tabs/CourseUsers";
import CourseWorkspaces from "./tabs/CourseWorkspaces";

interface CourseDetailsProps {
  courseId: string;
}

const CourseDetails = ({ courseId }: CourseDetailsProps) => {
  const { data: course, isLoading } = useQuery({
    queryKey: ["admin-course", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("id", courseId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{course.title}</h1>
      </div>

      <Tabs defaultValue="about" className="w-full">
        <TabsList>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="lessons">Lessons</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="workspaces">Workspaces</TabsTrigger>
        </TabsList>

        <TabsContent value="about">
          <CourseAbout course={course} />
        </TabsContent>
        
        <TabsContent value="lessons">
          <CourseLessons courseId={courseId} />
        </TabsContent>
        
        <TabsContent value="users">
          <CourseUsers courseId={courseId} />
        </TabsContent>
        
        <TabsContent value="workspaces">
          <CourseWorkspaces courseId={courseId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CourseDetails;
