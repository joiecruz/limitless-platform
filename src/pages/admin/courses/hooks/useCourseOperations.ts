import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useCourseOperations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: courses, isLoading: isLoadingCourses } = useQuery({
    queryKey: ["admin-courses"],
    queryFn: async () => {
      const { data: coursesData, error: coursesError } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });

      if (coursesError) throw coursesError;

      // Get real-time enrollment counts for all courses
      const coursesWithCounts = await Promise.all(
        coursesData.map(async (course) => {
          const { count } = await supabase
            .from("enrollments")
            .select("*", { count: "exact", head: true })
            .eq("course_id", course.id);

          return {
            ...course,
            enrollee_count: count || 0
          };
        })
      );

      return coursesWithCounts;
    },
  });

  const handleToggleLock = async (courseId: string, currentLockState: boolean) => {
    try {
      const { error } = await supabase
        .from("courses")
        .update({ locked: !currentLockState })
        .eq("id", courseId);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["admin-courses"] });

      toast({
        title: "Success",
        description: `Course ${currentLockState ? "unlocked" : "locked"} successfully`,
      });
    } catch (error: any) {
      
      toast({
        title: "Error",
        description: error.message || "Failed to update course status",
        variant: "destructive",
      });
    }
  };

  return {
    courses,
    isLoadingCourses,
    handleToggleLock,
  };
};