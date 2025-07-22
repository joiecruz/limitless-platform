import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Users, Camera, ClipboardCheck } from "lucide-react";

interface ReportingInstructionsProps {
  onStartReport: (type: 'hour_of_code' | 'depth_training') => void;
  onBack: () => void;
}

export function ReportingInstructions({ onStartReport, onBack }: ReportingInstructionsProps) {
  return (
    <div className="space-y-6">
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

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Select Training Type to Report:</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <Button
                onClick={() => onStartReport('hour_of_code')}
                className="h-auto p-6 justify-start"
                size="lg"
              >
                <div className="text-left">
                  <div className="flex items-center mb-2">
                    <ClipboardCheck className="h-5 w-5 mr-2" />
                    <span className="text-lg font-semibold">Hour of Code Session</span>
                  </div>
                  <p className="text-sm opacity-90">Report a completed Hour of Code training session</p>
                </div>
              </Button>

              <Button
                onClick={() => onStartReport('depth_training')}
                disabled
                variant="outline"
                className="h-auto p-6 justify-start opacity-50"
                size="lg"
              >
                <div className="text-left">
                  <div className="flex items-center mb-2">
                    <Users className="h-5 w-5 mr-2" />
                    <span className="text-lg font-semibold">12-Hour In-Depth Training</span>
                  </div>
                  <p className="text-sm opacity-70">Coming soon - currently disabled</p>
                </div>
              </Button>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={onBack}>
              ← Back to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}