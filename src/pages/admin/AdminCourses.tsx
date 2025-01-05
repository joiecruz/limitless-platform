import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import { Lock, Unlock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CourseDetails from "./courses/CourseDetails";
import { LoadingPage } from "@/components/common/LoadingPage";

export default function AdminCourses() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  // Fetch courses with actual enrollment counts
  const { data: courses, isLoading: isLoadingCourses } = useQuery({
    queryKey: ["admin-courses"],
    queryFn: async () => {
      const { data: coursesData, error: coursesError } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });

      if (coursesError) throw coursesError;

      // Fetch enrollment counts for each course
      const coursesWithCounts = await Promise.all(
        coursesData.map(async (course) => {
          const { count } = await supabase
            .from("enrollments")
            .select("*", { count: "exact" })
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

      // Invalidate and refetch courses
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

  if (selectedCourseId) {
    return (
      <div className="space-y-6">
        <Button 
          variant="outline" 
          onClick={() => setSelectedCourseId(null)}
          className="mb-4"
        >
          Back to Courses
        </Button>
        <CourseDetails courseId={selectedCourseId} />
      </div>
    );
  }

  if (isLoadingCourses) {
    return <LoadingPage />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Courses</h1>
        <Button>Create Course</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Enrollments</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses?.map((course) => (
            <TableRow key={course.id}>
              <TableCell>{course.title}</TableCell>
              <TableCell>{course.description}</TableCell>
              <TableCell>{course.enrollee_count}</TableCell>
              <TableCell>
                {course.locked ? (
                  <Lock className="h-4 w-4 text-red-500" />
                ) : (
                  <Unlock className="h-4 w-4 text-green-500" />
                )}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleLock(course.id, !!course.locked)}
                  >
                    {course.locked ? "Unlock" : "Lock"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedCourseId(course.id)}
                  >
                    Manage
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}