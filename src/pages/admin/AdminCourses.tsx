import { useState } from "react";
import { Button } from "@/components/ui/button";
import CourseDetails from "./courses/CourseDetails";
import { LoadingPage } from "@/components/common/LoadingPage";
import { useCourseOperations } from "./courses/hooks/useCourseOperations";
import { CoursesTable } from "./courses/components/CoursesTable";
import { CreateCourseDialog } from "./courses/components/CreateCourseDialog";

export default function AdminCourses() {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const { courses, isLoadingCourses, handleToggleLock, handleDeleteCourse } = useCourseOperations();

  if (selectedCourseId) {
    return (
      <div className="space-y-6 p-6">
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
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Courses</h1>
        <CreateCourseDialog />
      </div>

      <CoursesTable
        courses={courses || []}
        onToggleLock={handleToggleLock}
        onManageCourse={setSelectedCourseId}
        onDeleteCourse={handleDeleteCourse}
      />
    </div>
  );
}