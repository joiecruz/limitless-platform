import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, BookOpen } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Course {
  id: string;
  title: string;
  description: string;
  image_url: string;
  lesson_count: number;
  enrollee_count: number;
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
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Courses</h1>
        <p className="text-muted-foreground">Explore our available courses and track your progress</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses?.map((course) => {
          const enrollment = enrollments?.find((e) => e.course_id === course.id);
          
          return (
            <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video relative">
                <img
                  src={course.image_url || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d'}
                  alt={course.title}
                  className="object-cover w-full h-full"
                />
              </div>
              <CardHeader>
                <CardTitle>{course.title}</CardTitle>
                <CardDescription>{course.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {enrollment ? (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{enrollment.progress}%</span>
                      </div>
                      <Progress value={enrollment.progress} className="h-2" />
                    </div>
                    <Link 
                      to={`/courses/${course.id}/lessons`}
                      className="block w-full"
                    >
                      <Button className="w-full">Continue Learning</Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{course.lesson_count || 0} lessons</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{course.enrollee_count || 0} enrolled</span>
                      </div>
                    </div>
                    <Button 
                      className="w-full"
                      onClick={() => enrollMutation.mutate(course.id)}
                      disabled={enrollMutation.isPending}
                    >
                      {enrollMutation.isPending ? "Enrolling..." : "Enroll Now"}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Courses;