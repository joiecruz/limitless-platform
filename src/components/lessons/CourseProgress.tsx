import React from "react";
import { Progress } from "@/components/ui/progress";

interface CourseProgressProps {
  progress: number;
}

const CourseProgress: React.FC<CourseProgressProps> = ({ progress }) => {
  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold">Course progress</h2>
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{progress || 0}% completed</span>
        </div>
        <Progress value={progress || 0} className="h-2" />
      </div>
    </div>
  );
};

export default CourseProgress;