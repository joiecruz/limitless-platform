import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, BookOpen } from "lucide-react";

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
  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      // Temporary mock data until we implement the database
      const mockCourses: Course[] = [
        {
          id: "1",
          title: "Introduction to Web Development",
          description: "Learn the fundamentals of web development with HTML, CSS, and JavaScript.",
          image_url: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
          lesson_count: 12,
          enrollee_count: 156,
        },
        {
          id: "2",
          title: "Advanced React Patterns",
          description: "Master advanced React patterns and build scalable applications.",
          image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
          lesson_count: 8,
          enrollee_count: 89,
        },
      ];
      return mockCourses;
    },
  });

  const { data: enrollments } = useQuery({
    queryKey: ["enrollments"],
    queryFn: async () => {
      // Temporary mock data until we implement the database
      const mockEnrollments: Enrollment[] = [
        {
          course_id: "1",
          progress: 45,
        },
      ];
      return mockEnrollments;
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
                  src={course.image_url}
                  alt={course.title}
                  className="object-cover w-full h-full"
                />
              </div>
              <CardHeader>
                <CardTitle>{course.title}</CardTitle>
                <CardDescription>{course.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {enrollment ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{enrollment.progress}%</span>
                    </div>
                    <Progress value={enrollment.progress} className="h-2" />
                  </div>
                ) : (
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{course.lesson_count} lessons</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{course.enrollee_count} enrolled</span>
                    </div>
                  </div>
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