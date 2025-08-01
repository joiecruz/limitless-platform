import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, UserPlus, Trash2, Send, Users, CheckCircle, Clock, XCircle, FileText, Eye, TrendingUp } from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface MasterTrainer {
  id: string;
  user_id: string;
  granted_by: string;
  created_at: string;
  updated_at: string;
  user_profile?: {
    email: string;
    first_name?: string;
    last_name?: string;
  };
  granted_by_profile?: {
    email: string;
    first_name?: string;
    last_name?: string;
  };
  targets?: {
    hour_of_code_current: number;
    depth_training_current: number;
    hour_of_code_target: number;
    depth_training_target: number;
  };
  reports_count?: number;
}

export default function AdminMasterTrainers() {
  const [masterTrainers, setMasterTrainers] = useState<MasterTrainer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInviting, setIsInviting] = useState(false);
  const [newInviteEmail, setNewInviteEmail] = useState("");
  const [bulkEmails, setBulkEmails] = useState("");
  const [showBulkInvite, setShowBulkInvite] = useState(false);
  const [activeTab, setActiveTab] = useState<'manage' | 'reports'>('manage');
  const { toast } = useToast();

  const fetchMasterTrainers = async () => {
    try {
      const { data: trainers, error } = await supabase
        .from('master_trainer_access')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch user profiles separately
      const trainersWithProfiles: MasterTrainer[] = [];
      
      for (const trainer of trainers || []) {
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('email, first_name, last_name')
          .eq('id', trainer.user_id)
          .single();

        const { data: grantedByProfile } = await supabase
          .from('profiles')
          .select('email, first_name, last_name')
          .eq('id', trainer.granted_by)
          .single();

        // Fetch targets for this trainer
        const { data: targets } = await supabase
          .from('master_trainer_targets')
          .select('hour_of_code_current, depth_training_current, hour_of_code_target, depth_training_target')
          .eq('user_id', trainer.user_id)
          .single();

        // Count training reports for this trainer
        const { count: reportsCount } = await supabase
          .from('training_reports')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', trainer.user_id);

        trainersWithProfiles.push({
          ...trainer,
          user_profile: userProfile || undefined,
          granted_by_profile: grantedByProfile || undefined,
          targets: targets || undefined,
          reports_count: reportsCount || 0
        });
      }

      setMasterTrainers(trainersWithProfiles);
    } catch (error) {
      console.error('Error fetching master trainers:', error);
      toast({
        title: "Error",
        description: "Failed to load master trainers",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await fetchMasterTrainers();
      setIsLoading(false);
    };
    loadData();
  }, []);

  const grantAccess = async (email: string) => {
    try {
      // First check if user exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .eq('email', email.toLowerCase().trim())
        .maybeSingle();

      if (!existingUser) {
        toast({
          title: "User Not Found",
          description: `No account found for ${email}. User must create an account first.`,
          variant: "destructive",
        });
        return;
      }

      // User exists, grant access directly
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) throw new Error('Not authenticated');

      // Check if user already has access
      const { data: existingAccess } = await supabase
        .from('master_trainer_access')
        .select('id')
        .eq('user_id', existingUser.id)
        .maybeSingle();

      if (existingAccess) {
        toast({
          title: "User Already Has Access",
          description: `${email} already has Master Trainer access`,
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('master_trainer_access')
        .insert({
          user_id: existingUser.id,
          granted_by: currentUser.user.id
        });

      if (error) throw error;

      toast({
        title: "Access Granted",
        description: `Master trainer access granted to ${email}. They can now access the AI Ready ASEAN module in their dashboard.`,
      });

      await fetchMasterTrainers();
    } catch (error: any) {
      console.error('Error granting access:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to grant access",
        variant: "destructive",
      });
    }
  };

  const handleSingleGrant = async () => {
    if (!newInviteEmail.trim()) return;
    
    setIsInviting(true);
    await grantAccess(newInviteEmail.trim());
    setNewInviteEmail("");
    setIsInviting(false);
  };

  const handleBulkGrant = async () => {
    if (!bulkEmails.trim()) return;

    // Enhanced parsing for Google Sheets data - handle tabs, commas, newlines, and extra whitespace
    const emails = bulkEmails
      .split(/[,\n\t;]/) // Split by comma, newline, tab, or semicolon
      .map(email => email.trim().replace(/[\r\n\t]/g, '')) // Remove any remaining whitespace and line breaks
      .filter(email => {
        // Better email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return email && emailRegex.test(email);
      });

    if (emails.length === 0) {
      toast({
        title: "No Valid Emails Found",
        description: "Please enter valid email addresses separated by commas, tabs, or new lines",
        variant: "destructive",
      });
      return;
    }

    // Show initial feedback
    toast({
      title: "Processing Bulk Grant",
      description: `Processing ${emails.length} email address${emails.length > 1 ? 'es' : ''}...`,
    });

    setIsInviting(true);
    
    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];
    
    for (const email of emails) {
      try {
        await grantAccess(email);
        successCount++;
      } catch (error) {
        errorCount++;
        errors.push(email);
      }
    }

    // Provide detailed feedback
    if (successCount > 0) {
      toast({
        title: "Bulk Grant Complete",
        description: `Successfully granted access to ${successCount} user${successCount > 1 ? 's' : ''}${errorCount > 0 ? `. ${errorCount} failed.` : '.'}`,
      });
    }

    if (errorCount > 0 && errors.length > 0) {
      console.log('Failed emails:', errors);
    }

    setBulkEmails("");
    setShowBulkInvite(false);
    setIsInviting(false);
  };

  const revokeAccess = async (accessId: string, userEmail: string) => {
    try {
      const { error } = await supabase
        .from('master_trainer_access')
        .delete()
        .eq('id', accessId);

      if (error) throw error;

      toast({
        title: "Access Revoked",
        description: `Master trainer access revoked for ${userEmail}`,
      });

      await fetchMasterTrainers();
    } catch (error: any) {
      console.error('Error revoking access:', error);
      toast({
        title: "Error",
        description: "Failed to revoke access",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const viewTrainerReports = (trainerId: string) => {
    // Navigate to detailed reports view
    window.open(`/admin/master-trainers/reports/${trainerId}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Master Trainer Management</h1>
          <p className="text-muted-foreground">Manage access to the AI Ready ASEAN Master Trainer dashboard</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'manage' ? 'default' : 'outline'}
            onClick={() => setActiveTab('manage')}
          >
            <Users className="h-4 w-4 mr-2" />
            Manage Trainers
          </Button>
          <Button
            variant={activeTab === 'reports' ? 'default' : 'outline'}
            onClick={() => setActiveTab('reports')}
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Training Reports
          </Button>
          {activeTab === 'manage' && (
            <Button
              variant="outline"
              onClick={() => setShowBulkInvite(!showBulkInvite)}
            >
              <Users className="h-4 w-4 mr-2" />
              Bulk Grant
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Master Trainers</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{masterTrainers.length}</div>
            <p className="text-xs text-muted-foreground">Users with active access</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {masterTrainers.reduce((sum, trainer) => sum + (trainer.reports_count || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">Training sessions reported</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">People Trained</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {masterTrainers.reduce((sum, trainer) => 
                sum + (trainer.targets?.hour_of_code_current || 0) + (trainer.targets?.depth_training_current || 0), 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">Total participants reached</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hour of Code Sessions</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {masterTrainers.reduce((sum, trainer) => sum + (trainer.targets?.hour_of_code_current || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">People reached via Hour of Code</p>
          </CardContent>
        </Card>
      </div>

      {activeTab === 'manage' && (
        <>
          {/* Single Invite */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Grant Master Trainer Access
              </CardTitle>
              <CardDescription>
                Grant access to the AI Ready ASEAN Master Trainer dashboard. Users must have an existing account. Access is immediate - no email confirmation required.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="trainer@example.com"
                    value={newInviteEmail}
                    onChange={(e) => setNewInviteEmail(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSingleGrant()}
                  />
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={handleSingleGrant}
                    disabled={isInviting || !newInviteEmail.trim()}
                  >
                    {isInviting ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <UserPlus className="h-4 w-4 mr-2" />
                    )}
                    Grant Access
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bulk Invite */}
          {showBulkInvite && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Bulk Grant Master Trainer Access
                </CardTitle>
                <CardDescription>
                  Enter multiple email addresses separated by commas, tabs, semicolons, or new lines. Perfect for copying data from Google Sheets or Excel. Users must have existing accounts. Access is granted immediately.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="bulk-emails">Email Addresses</Label>
                    <Textarea
                      id="bulk-emails"
                      placeholder="trainer1@example.com, trainer2@example.com&#10;trainer3@example.com"
                      value={bulkEmails}
                      onChange={(e) => setBulkEmails(e.target.value)}
                      rows={6}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleBulkGrant}
                      disabled={isInviting || !bulkEmails.trim()}
                    >
                      {isInviting ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <UserPlus className="h-4 w-4 mr-2" />
                      )}
                      Grant Access to All
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowBulkInvite(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Active Master Trainers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Active Master Trainers
              </CardTitle>
              <CardDescription>
                Users with current access to the Master Trainer dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Granted By</TableHead>
                    <TableHead>Date Granted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {masterTrainers.map((trainer) => (
                    <TableRow key={trainer.id}>
                      <TableCell className="font-medium">
                        {trainer.user_profile?.first_name || trainer.user_profile?.last_name
                          ? `${trainer.user_profile.first_name || ''} ${trainer.user_profile.last_name || ''}`.trim()
                          : 'Unknown User'}
                      </TableCell>
                      <TableCell>{trainer.user_profile?.email || 'No email'}</TableCell>
                      <TableCell>
                        {trainer.granted_by_profile?.first_name || trainer.granted_by_profile?.last_name
                          ? `${trainer.granted_by_profile.first_name || ''} ${trainer.granted_by_profile.last_name || ''}`.trim()
                          : trainer.granted_by_profile?.email || 'Unknown'}
                      </TableCell>
                      <TableCell>
                        {new Date(trainer.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="default">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Revoke Access</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to revoke Master Trainer access for {trainer.user_profile?.email}?
                                They will no longer be able to access the Master Trainer dashboard.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => revokeAccess(trainer.id, trainer.user_profile?.email || 'this user')}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Revoke Access
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {masterTrainers.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No master trainers found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {activeTab === 'reports' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Training Reports & Performance
            </CardTitle>
            <CardDescription>
              View training reports and track the number of people trained by each Master Trainer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Trainer Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Reports Submitted</TableHead>
                  <TableHead>Hour of Code</TableHead>
                  <TableHead>Depth Training</TableHead>
                  <TableHead>Total Trained</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {masterTrainers.map((trainer) => {
                  const hourOfCodeCurrent = trainer.targets?.hour_of_code_current || 0;
                  const depthTrainingCurrent = trainer.targets?.depth_training_current || 0;
                  const hourOfCodeTarget = trainer.targets?.hour_of_code_target || 3000;
                  const depthTrainingTarget = trainer.targets?.depth_training_target || 600;
                  const totalTrained = hourOfCodeCurrent + depthTrainingCurrent;
                  const totalTarget = hourOfCodeTarget + depthTrainingTarget;
                  const progressPercentage = totalTarget > 0 ? Math.round((totalTrained / totalTarget) * 100) : 0;

                  return (
                    <TableRow key={trainer.id}>
                      <TableCell className="font-medium">
                        {trainer.user_profile?.first_name || trainer.user_profile?.last_name
                          ? `${trainer.user_profile.first_name || ''} ${trainer.user_profile.last_name || ''}`.trim()
                          : 'Unknown User'}
                      </TableCell>
                      <TableCell>{trainer.user_profile?.email || 'No email'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">{trainer.reports_count || 0}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{hourOfCodeCurrent.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">
                            of {hourOfCodeTarget.toLocaleString()} target
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{depthTrainingCurrent.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">
                            of {depthTrainingTarget.toLocaleString()} target
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-lg">{totalTrained.toLocaleString()}</div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-secondary rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{progressPercentage}%</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => viewTrainerReports(trainer.user_id)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Reports
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            {masterTrainers.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No master trainers found</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}