import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Trophy } from "lucide-react";

interface SuccessPageProps {
  sessionType: 'hour_of_code' | 'depth_training';
  participantCount: number;
  onBackToDashboard: () => void;
}

export function SuccessPage({ sessionType, participantCount, onBackToDashboard }: SuccessPageProps) {
  const sessionName = sessionType === 'hour_of_code' ? 'Hour of Code' : '12-Hour In-Depth Training';
  
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="max-w-md mx-auto text-center">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <Trophy className="h-8 w-8 text-yellow-500 absolute -top-2 -right-2" />
            </div>
          </div>
          <CardTitle className="text-2xl text-green-600">
            🎉 Congratulations!
          </CardTitle>
          <CardDescription className="text-base">
            Your {sessionName} session report has been successfully submitted!
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">Report Summary:</h4>
            <p className="text-sm text-green-700">
              You've successfully trained <strong>{participantCount} participants</strong> and made a meaningful impact in digital literacy education!
            </p>
          </div>
          
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>✅ Your report is now under review</p>
            <p>✅ Progress metrics have been updated</p>
            <p>✅ Files have been uploaded successfully</p>
          </div>
          
          <Button 
            onClick={onBackToDashboard}
            className="w-full"
            size="lg"
          >
            Return to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}