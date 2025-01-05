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

interface Course {
  id: string;
  title: string;
  description: string;
  enrollee_count: number;
  locked: boolean;
}

interface CoursesTableProps {
  courses: Course[];
  onToggleLock: (courseId: string, currentLockState: boolean) => Promise<void>;
  onManageCourse: (courseId: string) => void;
}

export function CoursesTable({ courses, onToggleLock, onManageCourse }: CoursesTableProps) {
  return (
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
                  onClick={() => onToggleLock(course.id, !!course.locked)}
                >
                  {course.locked ? "Unlock" : "Lock"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onManageCourse(course.id)}
                >
                  Manage
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}