import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import CourseCard from "@/components/courses/CourseCard";
import { LoadingQuotes } from "@/components/common/LoadingQuotes";

interface Course {
  id: string;
  title: string;
  description: string;
  image_url: string;
  lesson_count: number;
  enrollee_count: number;
  locked: boolean;
}

interface Enrollment {
  course_id: string;
  progress: number;
}

const Courses = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*');
      
      if (error) {
        console.error('Error fetching courses:', error);
        toast({
          title: "Error",
          description: "Failed to load courses. Please try again later.",
          variant: "destructive",
        });
        return [];
      }
      
      return data as Course[];
    },
  });

  const { data: enrollments } = useQuery({
    queryKey: ["enrollments"],
    queryFn: async () => {
      const { data: userSession } = await supabase.auth.getSession();
      if (!userSession?.session?.user?.id) return [];

      const { data, error } = await supabase
        .from('enrollments')
        .select('course_id, progress')
        .eq('user_id', userSession.session.user.id);
      
      if (error) {
        console.error('Error fetching enrollments:', error);
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
        console.error('Error enrolling in course:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      toast({
        title: "Success",
        description: "Successfully enrolled in the course!",
      });
    },
    onError: (error) => {
      console.error('Error enrolling in course:', error);
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
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Courses
        </h1>
        <p className="text-muted-foreground mt-1">
          Explore our available courses and track your progress
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses?.map((course) => {
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
    </div>
  );
};

export default Courses;