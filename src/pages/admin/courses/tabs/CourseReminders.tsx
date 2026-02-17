import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Loader2, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CourseRemindersProps {
  courseId: string;
  courseName: string;
}

export default function CourseReminders({ courseId, courseName }: CourseRemindersProps) {
  const [isSending, setIsSending] = useState(false);
  const [lastResult, setLastResult] = useState<{ sent_count: number; skipped_count: number } | null>(null);

  const handleSendReminders = async () => {
    setIsSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-course-reminders", {
        method: "POST",
      });

      if (error) throw error;

      setLastResult(data);
      if (data.sent_count > 0) {
        toast.success(`Successfully sent ${data.sent_count} reminder(s)`);
      } else {
        toast.info("No users needed reminding at this time");
      }
    } catch (err: any) {
      console.error("Error sending reminders:", err);
      toast.error("Failed to send reminders: " + err.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Course Completion Reminders
        </CardTitle>
        <CardDescription>
          Send email reminders to enrolled users who haven't completed the course.
          Automated reminders run every Monday at 9:00 AM UTC. Users won't receive
          more than one reminder per week.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={handleSendReminders}
          disabled={isSending}
          className="gap-2"
        >
          {isSending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          {isSending ? "Sending Reminders..." : "Send Reminders Now"}
        </Button>

        {lastResult && (
          <div className="rounded-md bg-muted p-4 text-sm space-y-1">
            <p><strong>Emails sent:</strong> {lastResult.sent_count}</p>
            <p><strong>Skipped:</strong> {lastResult.skipped_count}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
