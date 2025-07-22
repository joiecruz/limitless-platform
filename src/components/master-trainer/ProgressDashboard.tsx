import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useMasterTrainerTargets } from "@/hooks/useMasterTrainerTargets";
import { ClipboardList, Users, FileText, Camera, ClipboardCheck } from "lucide-react";

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
      <h2 className="text-2xl font-semibold text-foreground">Your Progress</h2>
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

      {/* Before You Start Reporting Section */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Before You Start Reporting</CardTitle>
          <CardDescription>
            Please prepare the following documentation before filling out the reporting form
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center text-center p-4 border rounded-lg bg-muted/50">
              <FileText className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-semibold mb-1">Attendance Sheets</h3>
              <p className="text-sm text-muted-foreground">
                Complete attendance records with all required participant information
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4 border rounded-lg bg-muted/50">
              <Users className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-semibold mb-1">Participant Breakdown</h3>
              <p className="text-sm text-muted-foreground">
                Total number of participants and breakdown by type (Youth, Parent, Educator)
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4 border rounded-lg bg-muted/50">
              <Camera className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-semibold mb-1">Event Photos</h3>
              <p className="text-sm text-muted-foreground">
                High-quality photos documenting the training session (max 5MB each)
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <ClipboardCheck className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">Important Reminders:</h4>
                <ul className="space-y-1 text-sm text-blue-700">
                  <li>• Report each training session separately using this form</li>
                  <li>• Ensure all participant data is complete and accurate</li>
                  <li>• Photos should show participants engaged in learning activities</li>
                  <li>• Complete the form immediately after your session while details are fresh</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-6 py-8">
            <h3 className="text-xl font-semibold text-center">I want to report a:</h3>
            
            <div className="flex justify-center gap-6">
              <Button
                onClick={() => onStartReport('hour_of_code')}
                className="w-48 h-32 flex flex-col items-center justify-center gap-3 text-lg font-semibold hover:bg-yellow-400 hover:text-black transition-colors"
                size="lg"
              >
                <ClipboardCheck className="h-8 w-8" />
                <div className="text-center">
                  <div>Hour of Code</div>
                  <div>Session</div>
                </div>
              </Button>

              <Button
                onClick={() => onStartReport('depth_training')}
                disabled
                variant="outline"
                className="w-48 h-32 flex flex-col items-center justify-center gap-3 text-lg font-semibold opacity-50 hover:bg-red-400 hover:text-white transition-colors disabled:hover:bg-muted"
                size="lg"
              >
                <Users className="h-8 w-8" />
                <div className="text-center">
                  <div>12-Hour Training</div>
                  <div>Session</div>
                </div>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}