import { Progress } from "@/components/ui/progress";

interface CourseProgressProps {
  progress: number;
}

const CourseProgress = ({ progress }: CourseProgressProps) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Progress</span>
        <span>{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};

export default CourseProgress;