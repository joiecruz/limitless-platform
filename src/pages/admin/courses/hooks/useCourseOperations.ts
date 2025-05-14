
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { courseService } from "@/api";
import { useToast } from "@/hooks/use-toast";

export const useCourseOperations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: courses, isLoading: isLoadingCourses } = useQuery({
    queryKey: ["admin-courses"],
    queryFn: async () => {
      return await courseService.getAdminCourses();
    },
  });

  const handleToggleLock = async (courseId: string, currentLockState: boolean) => {
    try {
      await courseService.toggleLock(courseId, currentLockState);
      
      await queryClient.invalidateQueries({ queryKey: ["admin-courses"] });

      toast({
        title: "Success",
        description: `Course ${currentLockState ? "unlocked" : "locked"} successfully`,
      });
    } catch (error: any) {
      console.error("Error toggling course lock:", error);
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
