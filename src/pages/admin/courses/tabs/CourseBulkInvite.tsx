import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, UserCheck, UserPlus, Users, RefreshCw, Settings2, Trash2 } from "lucide-react";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";

interface CourseBulkInviteProps {
  courseId: string;
  courseName: string;
}

const DEFAULT_EMAIL_SUBJECT = "Welcome to {courseName}: Your Learning Journey Starts Here!";
const DEFAULT_EMAIL_HEADING = "Welcome to {courseName}!";
const DEFAULT_EMAIL_INTRO = "Congratulations! You've been invited to join our exclusive training program designed to help you succeed.";
const DEFAULT_EMAIL_DESCRIPTION = "This course will equip you with practical skills to transform your work, enhance productivity, and unlock new opportunities.";

export default function CourseBulkInvite({ courseId, courseName }: CourseBulkInviteProps) {
  const [emailInput, setEmailInput] = useState("");
  const [sendEmails, setSendEmails] = useState(true);
  const [showEmailSettings, setShowEmailSettings] = useState(false);
  const [emailSubject, setEmailSubject] = useState(DEFAULT_EMAIL_SUBJECT.replace("{courseName}", courseName));
  const [emailHeading, setEmailHeading] = useState(DEFAULT_EMAIL_HEADING.replace("{courseName}", courseName));
  const [emailIntro, setEmailIntro] = useState(DEFAULT_EMAIL_INTRO);
  const [emailDescription, setEmailDescription] = useState(DEFAULT_EMAIL_DESCRIPTION);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch pending enrollments for this course
  const { data: enrollments, isLoading: loadingEnrollments } = useQuery({
    queryKey: ["course-bulk-enrollments", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pending_course_enrollments")
        .select(`
          *,
          inviter:profiles!pending_course_enrollments_invited_by_fkey(first_name, last_name)
        `)
        .eq("course_id", courseId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Fetch enrolled user profiles for this course (users who completed enrollment)
  const { data: enrolledProfiles } = useQuery({
    queryKey: ["course-enrolled-profiles", courseId],
    queryFn: async () => {
      // Get all processed enrollments' emails
      const processedEmails = enrollments
        ?.filter(e => e.processed_at)
        .map(e => e.email.toLowerCase()) || [];

      if (processedEmails.length === 0) return {};

      // Fetch profiles by email
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, first_name, last_name")
        .in("email", processedEmails);

      if (error) {
        console.error("Error fetching enrolled profiles:", error);
        return {};
      }

      // Create a map of email to profile
      const profileMap: Record<string, { first_name: string | null; last_name: string | null }> = {};
      data?.forEach(profile => {
        profileMap[profile.email.toLowerCase()] = {
          first_name: profile.first_name,
          last_name: profile.last_name
        };
      });

      return profileMap;
    },
    enabled: !!enrollments && enrollments.some(e => e.processed_at),
  });

  // Bulk invite mutation
  const bulkInviteMutation = useMutation({
    mutationFn: async ({ emails, sendEmail }: { emails: string[]; sendEmail: boolean }) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const response = await supabase.functions.invoke("send-course-invite", {
        body: {
          emails,
          courseId,
          courseName,
          sendEmail,
          emailTemplate: sendEmail ? {
            subject: emailSubject,
            heading: emailHeading,
            intro: emailIntro,
            description: emailDescription,
          } : undefined,
        },
      });

      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["course-bulk-enrollments", courseId] });
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
          courseId,
          courseName,
          sendEmail: true,
          emailTemplate: {
            subject: emailSubject,
            heading: emailHeading,
            intro: emailIntro,
            description: emailDescription,
          },
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

  // Delete invitation mutation
  const deleteInvitationMutation = useMutation({
    mutationFn: async (enrollmentId: string) => {
      const { error } = await supabase
        .from("pending_course_enrollments")
        .delete()
        .eq("id", enrollmentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-bulk-enrollments", courseId] });
      toast({
        title: "Invitation Deleted",
        description: "The invitation has been removed.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete invitation",
        variant: "destructive",
      });
    },
  });

  const handleBulkInvite = () => {
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
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Invited</p>
                <p className="text-xl font-bold">{totalCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-full">
                <UserPlus className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Pending</p>
                <p className="text-xl font-bold">{pendingCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <UserCheck className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Enrolled</p>
                <p className="text-xl font-bold">{enrolledCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-full">
                <Mail className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Conversion</p>
                <p className="text-xl font-bold">{conversionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bulk Invite Form */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Bulk Invite Learners</CardTitle>
            <CardDescription>
              Paste email addresses (one per line or comma-separated)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="email1@example.com&#10;email2@example.com&#10;email3@example.com"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              rows={8}
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

            {/* Email Template Settings */}
            {sendEmails && (
              <Collapsible open={showEmailSettings} onOpenChange={setShowEmailSettings}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground">
                    <Settings2 className="h-4 w-4 mr-2" />
                    {showEmailSettings ? "Hide" : "Customize"} email template
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-3 pt-3">
                  <div>
                    <Label htmlFor="email-subject" className="text-xs">Subject Line</Label>
                    <Input
                      id="email-subject"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      placeholder="Email subject..."
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email-heading" className="text-xs">Email Heading</Label>
                    <Input
                      id="email-heading"
                      value={emailHeading}
                      onChange={(e) => setEmailHeading(e.target.value)}
                      placeholder="Welcome heading..."
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email-intro" className="text-xs">Introduction</Label>
                    <Textarea
                      id="email-intro"
                      value={emailIntro}
                      onChange={(e) => setEmailIntro(e.target.value)}
                      placeholder="Introduction paragraph..."
                      rows={2}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email-description" className="text-xs">Course Description</Label>
                    <Textarea
                      id="email-description"
                      value={emailDescription}
                      onChange={(e) => setEmailDescription(e.target.value)}
                      placeholder="Course description..."
                      rows={2}
                      className="mt-1"
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}

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
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Invitation Status</CardTitle>
            <CardDescription>Track invited learners and their enrollment status</CardDescription>
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
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <>
                  <TabsContent value="all">
                    <EnrollmentTable
                      enrollments={enrollments || []}
                      enrolledProfiles={enrolledProfiles || {}}
                      onResend={(email) => resendEmailMutation.mutate(email)}
                      onDelete={(id) => deleteInvitationMutation.mutate(id)}
                      isResending={resendEmailMutation.isPending}
                      isDeleting={deleteInvitationMutation.isPending}
                    />
                  </TabsContent>
                  <TabsContent value="pending">
                    <EnrollmentTable
                      enrollments={enrollments?.filter((e) => !e.processed_at) || []}
                      enrolledProfiles={enrolledProfiles || {}}
                      onResend={(email) => resendEmailMutation.mutate(email)}
                      onDelete={(id) => deleteInvitationMutation.mutate(id)}
                      isResending={resendEmailMutation.isPending}
                      isDeleting={deleteInvitationMutation.isPending}
                    />
                  </TabsContent>
                  <TabsContent value="enrolled">
                    <EnrollmentTable
                      enrollments={enrollments?.filter((e) => e.processed_at) || []}
                      enrolledProfiles={enrolledProfiles || {}}
                      onResend={(email) => resendEmailMutation.mutate(email)}
                      onDelete={(id) => deleteInvitationMutation.mutate(id)}
                      isResending={resendEmailMutation.isPending}
                      isDeleting={deleteInvitationMutation.isPending}
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
  enrolledProfiles: Record<string, { first_name: string | null; last_name: string | null }>;
  onResend: (email: string) => void;
  onDelete: (id: string) => void;
  isResending: boolean;
  isDeleting: boolean;
}

function EnrollmentTable({ enrollments, enrolledProfiles, onResend, onDelete, isResending, isDeleting }: EnrollmentTableProps) {
  if (enrollments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No invitations found in this category.
      </div>
    );
  }

  const getUserName = (email: string): string | null => {
    const profile = enrolledProfiles[email.toLowerCase()];
    if (profile?.first_name || profile?.last_name) {
      return `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
    }
    return null;
  };

  return (
    <div className="rounded-md border max-h-[400px] overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Invited</TableHead>
            <TableHead>Enrolled</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {enrollments.map((enrollment) => {
            const userName = getUserName(enrollment.email);
            return (
              <TableRow key={enrollment.id}>
                <TableCell className="font-medium">{enrollment.email}</TableCell>
                <TableCell className="text-muted-foreground">
                  {userName || "—"}
                </TableCell>
                <TableCell>
                  {enrollment.processed_at ? (
                    <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                      Enrolled
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                      Pending
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {format(new Date(enrollment.created_at), "MMM d, yyyy")}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {enrollment.processed_at
                    ? format(new Date(enrollment.processed_at), "MMM d, yyyy")
                    : "—"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
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
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          disabled={isDeleting}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Invitation</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete the invitation for {enrollment.email}? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDelete(enrollment.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
