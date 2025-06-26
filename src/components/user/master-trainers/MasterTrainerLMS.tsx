import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import CourseCard from "@/components/courses/CourseCard";
import { LoadingQuotes } from "@/components/common/LoadingQuotes";
import { BookOpen } from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string;
  image_url: string;
  lesson_count: number;
  enrollee_count: number;
  locked: boolean;
  format: string;
}

interface Enrollment {
  course_id: string;
  progress: number;
}

export function MasterTrainerLMS() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch Master Trainer exclusive courses
  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ["master-trainer-courses"],
    queryFn: async () => {
      const { data: coursesData, error } = await supabase
        .from('courses')
        .select('*')
        .eq('format', 'Master Trainer'); // Filter for Master Trainer courses only

      if (error) {
        console.log("Error fetching master trainer courses:", error);
        toast({
          title: "Error",
          description: "Failed to load courses. Please try again later.",
          variant: "destructive",
        });
        return [];
      }

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

      return coursesWithCounts as Course[];
    },
  });

  // Fetch user enrollments
  const { data: enrollments } = useQuery({
    queryKey: ["master-trainer-enrollments"],
    queryFn: async () => {
      const { data: userSession } = await supabase.auth.getSession();
      if (!userSession?.session?.user?.id) return [];

      const { data, error } = await supabase
        .from('enrollments')
        .select('course_id, progress')
        .eq('user_id', userSession.session.user.id);

      if (error) {
        console.log("Error fetching enrollments:", error);
        toast({
          title: "Error",
          description: "Failed to load course progress. Please try again later.",
          variant: "destructive",
        });
        return [];
      }

      return data as Enrollment[];
    },
  });

  // Enrollment mutation
  const enrollMutation = useMutation({
    mutationFn: async (courseId: string) => {
      const { data: userSession } = await supabase.auth.getSession();
      if (!userSession?.session?.user?.id) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from('enrollments')
        .insert([
          {
            course_id: courseId,
            user_id: userSession.session.user.id,
            progress: 0
          }
        ])
        .select()
        .single();

      if (error) {
        console.log("Enrollment error:", error);
        throw error;
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["master-trainer-enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["course-counts", data.course_id] });
      queryClient.invalidateQueries({ queryKey: ["master-trainer-courses"] });
    },
    onError: (error) => {
      console.log("Enrollment mutation error:", error);
      toast({
        title: "Error",
        description: "Failed to enroll in the course. Please try again later.",
        variant: "destructive",
      });
    },
  });

  if (coursesLoading) {
    return <LoadingQuotes />;
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">
          Master Trainer Learning Modules
        </h2>
        <p className="text-muted-foreground mt-1">
          Access exclusive courses designed specifically for AI Ready Master Trainers
        </p>
      </div>

      {courses && courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {courses.map((course) => {
            const enrollment = enrollments?.find((e) => e.course_id === course.id);

            return (
              <CourseCard
                key={course.id}
                course={course}
                enrollment={enrollment}
                onEnroll={() => enrollMutation.mutate(course.id)}
                isEnrolling={enrollMutation.isPending}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No courses available yet</h3>
          <p className="text-muted-foreground">
            Master Trainer courses will be available here soon. Check back later!
          </p>
        </div>
      )}
    </div>
  );
}
