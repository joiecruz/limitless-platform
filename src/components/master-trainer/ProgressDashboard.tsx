import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useMasterTrainerTargets } from "@/hooks/useMasterTrainerTargets";
import { ClipboardList, Users } from "lucide-react";

interface ProgressDashboardProps {
  onStartReport: (type: 'hour_of_code' | 'depth_training') => void;
}

export function ProgressDashboard({ onStartReport }: ProgressDashboardProps) {
  const { targets, isLoading } = useMasterTrainerTargets();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!targets) {
    return null;
  }

  const hourOfCodeProgress = Math.min((targets.hour_of_code_current / targets.hour_of_code_target) * 100, 100);
  const depthTrainingProgress = Math.min((targets.depth_training_current / targets.depth_training_target) * 100, 100);

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ClipboardList className="h-5 w-5" />
              <span>Hour of Code Campaign</span>
            </CardTitle>
            <CardDescription>
              Target learners reached: {targets.hour_of_code_current.toLocaleString()} / {targets.hour_of_code_target.toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={hourOfCodeProgress} className="w-full" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{hourOfCodeProgress.toFixed(1)}% Complete</span>
              <span>{(targets.hour_of_code_target - targets.hour_of_code_current).toLocaleString()} remaining</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>12-Hour In-Depth Training</span>
            </CardTitle>
            <CardDescription>
              Target learners reached: {targets.depth_training_current.toLocaleString()} / {targets.depth_training_target.toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={depthTrainingProgress} className="w-full" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{depthTrainingProgress.toFixed(1)}% Complete</span>
              <span>{(targets.depth_training_target - targets.depth_training_current).toLocaleString()} remaining</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Submission Section */}
      <Card>
        <CardHeader>
          <CardTitle>📝 Submit Training Report</CardTitle>
          <CardDescription>
            Report your training sessions to track progress towards your targets
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Button
              onClick={() => onStartReport('hour_of_code')}
              className="h-auto p-4 justify-start"
            >
              <div className="text-left">
                <div className="flex items-center mb-1">
                  <ClipboardList className="h-4 w-4 mr-2" />
                  <span className="font-medium">Hour of Code Session</span>
                </div>
                <p className="text-xs opacity-80">Report a completed Hour of Code session</p>
              </div>
            </Button>

            <Button
              onClick={() => onStartReport('depth_training')}
              disabled
              variant="outline"
              className="h-auto p-4 justify-start opacity-50"
            >
              <div className="text-left">
                <div className="flex items-center mb-1">
                  <Users className="h-4 w-4 mr-2" />
                  <span className="font-medium">12-Hour Training Session</span>
                </div>
                <p className="text-xs opacity-80">Coming soon - currently disabled</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}