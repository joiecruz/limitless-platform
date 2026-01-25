import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, UserCheck, UserPlus, Users, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

const LIMITLESSBIZ_COURSE_ID = "e0ac8d90-bdba-4a50-a3bd-148c0903d43f";

export default function AdminLimitlessBizEnrollments() {
  const [emailInput, setEmailInput] = useState("");
  const [sendEmails, setSendEmails] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch pending enrollments
  const { data: enrollments, isLoading: loadingEnrollments } = useQuery({
    queryKey: ["limitlessbiz-enrollments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pending_course_enrollments")
        .select(`
          *,
          course:courses(title),
          inviter:profiles!pending_course_enrollments_invited_by_fkey(first_name, last_name)
        `)
        .eq("course_id", LIMITLESSBIZ_COURSE_ID)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Fetch course info
  const { data: course } = useQuery({
    queryKey: ["limitlessbiz-course"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("id, title")
        .eq("id", LIMITLESSBIZ_COURSE_ID)
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Bulk invite mutation
  const bulkInviteMutation = useMutation({
    mutationFn: async ({ emails, sendEmail }: { emails: string[]; sendEmail: boolean }) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const response = await supabase.functions.invoke("send-course-invite", {
        body: {
          emails,
          courseId: LIMITLESSBIZ_COURSE_ID,
          courseName: course?.title || "LimitlessBiz: AI for MSME Advancement",
          sendEmail,
        },
      });

      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["limitlessbiz-enrollments"] });
      setEmailInput("");
      toast({
        title: "Invitations Sent",
        description: `Added ${data.inserted} new invitations. ${data.emailsSent} emails sent. ${data.skippedDuplicate} duplicates skipped.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send invitations",
        variant: "destructive",
      });
    },
  });

  // Resend email mutation
  const resendEmailMutation = useMutation({
    mutationFn: async (email: string) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const response = await supabase.functions.invoke("send-course-invite", {
        body: {
          emails: [email],
          courseId: LIMITLESSBIZ_COURSE_ID,
          courseName: course?.title || "LimitlessBiz: AI for MSME Advancement",
          sendEmail: true,
        },
      });

      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Email Resent",
        description: "Invitation email has been resent successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to resend email",
        variant: "destructive",
      });
    },
  });

  const handleBulkInvite = () => {
    // Parse emails from input (handle comma, newline, and space separated)
    const emails = emailInput
      .split(/[\n,\s]+/)
      .map((e) => e.trim().toLowerCase())
      .filter((e) => e && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));

    if (emails.length === 0) {
      toast({
        title: "No Valid Emails",
        description: "Please enter valid email addresses.",
        variant: "destructive",
      });
      return;
    }

    bulkInviteMutation.mutate({ emails, sendEmail: sendEmails });
  };

  // Calculate stats
  const pendingCount = enrollments?.filter((e) => !e.processed_at).length || 0;
  const enrolledCount = enrollments?.filter((e) => e.processed_at).length || 0;
  const totalCount = enrollments?.length || 0;
  const conversionRate = totalCount > 0 ? ((enrolledCount / totalCount) * 100).toFixed(1) : "0";

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">LimitlessBiz Enrollments</h1>
        <p className="text-gray-600 mt-1">
          Manage MSME learner invitations for the LimitlessBiz: AI for MSME Advancement course
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Invited</p>
                <p className="text-2xl font-bold">{totalCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-100 rounded-full">
                <UserPlus className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending Signup</p>
                <p className="text-2xl font-bold">{pendingCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Enrolled</p>
                <p className="text-2xl font-bold">{enrolledCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <Mail className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Conversion Rate</p>
                <p className="text-2xl font-bold">{conversionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bulk Invite Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Bulk Invite MSMEs</CardTitle>
            <CardDescription>
              Paste email addresses from your Google Form registrants. One email per line or
              comma-separated.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="email1@example.com&#10;email2@example.com&#10;email3@example.com"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              rows={10}
              className="font-mono text-sm"
            />
            <div className="flex items-center space-x-2">
              <Switch
                id="send-emails"
                checked={sendEmails}
                onCheckedChange={setSendEmails}
              />
              <Label htmlFor="send-emails">Send invitation emails</Label>
            </div>
            <Button
              onClick={handleBulkInvite}
              disabled={bulkInviteMutation.isPending || !emailInput.trim()}
              className="w-full"
            >
              {bulkInviteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Invitations
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Enrollments Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Enrollment Status</CardTitle>
            <CardDescription>Track invited MSMEs and their enrollment status</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All ({totalCount})</TabsTrigger>
                <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
                <TabsTrigger value="enrolled">Enrolled ({enrolledCount})</TabsTrigger>
              </TabsList>

              {loadingEnrollments ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : (
                <>
                  <TabsContent value="all">
                    <EnrollmentTable
                      enrollments={enrollments || []}
                      onResend={(email) => resendEmailMutation.mutate(email)}
                      isResending={resendEmailMutation.isPending}
                    />
                  </TabsContent>
                  <TabsContent value="pending">
                    <EnrollmentTable
                      enrollments={enrollments?.filter((e) => !e.processed_at) || []}
                      onResend={(email) => resendEmailMutation.mutate(email)}
                      isResending={resendEmailMutation.isPending}
                    />
                  </TabsContent>
                  <TabsContent value="enrolled">
                    <EnrollmentTable
                      enrollments={enrollments?.filter((e) => e.processed_at) || []}
                      onResend={(email) => resendEmailMutation.mutate(email)}
                      isResending={resendEmailMutation.isPending}
                    />
                  </TabsContent>
                </>
              )}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface EnrollmentTableProps {
  enrollments: any[];
  onResend: (email: string) => void;
  isResending: boolean;
}

function EnrollmentTable({ enrollments, onResend, isResending }: EnrollmentTableProps) {
  if (enrollments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No enrollments found in this category.
      </div>
    );
  }

  return (
    <div className="rounded-md border max-h-[500px] overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Invited</TableHead>
            <TableHead>Enrolled</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {enrollments.map((enrollment) => (
            <TableRow key={enrollment.id}>
              <TableCell className="font-medium">{enrollment.email}</TableCell>
              <TableCell>
                {enrollment.processed_at ? (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    Enrolled
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                    Pending
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-gray-500">
                {format(new Date(enrollment.created_at), "MMM d, yyyy")}
              </TableCell>
              <TableCell className="text-gray-500">
                {enrollment.processed_at
                  ? format(new Date(enrollment.processed_at), "MMM d, yyyy")
                  : "—"}
              </TableCell>
              <TableCell className="text-right">
                {!enrollment.processed_at && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onResend(enrollment.email)}
                    disabled={isResending}
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Resend
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
