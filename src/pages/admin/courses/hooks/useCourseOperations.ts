
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useCourseOperations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: courses, isLoading: isLoadingCourses, refetch } = useQuery({
    queryKey: ["admin-courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching courses:", error);
        throw error;
      }

      return data;
    },
  });

  const toggleLockMutation = useMutation({
    mutationFn: async ({ courseId, locked }: { courseId: string; locked: boolean }) => {
      const { error } = await supabase
        .from("courses")
        .update({ locked })
        .eq("id", courseId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
      toast({
        title: "Course updated",
        description: "Course lock status has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating course",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleToggleLock = (courseId: string, currentLocked: boolean) => {
    toggleLockMutation.mutate({ courseId, locked: !currentLocked });
  };

  return {
    courses,
    isLoadingCourses,
    handleToggleLock,
    refetch,
  };
};
