import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, UserPlus, Trash2, Send, Users, CheckCircle, Clock, XCircle } from "lucide-react";
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
}

export default function AdminMasterTrainers() {
  const [masterTrainers, setMasterTrainers] = useState<MasterTrainer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInviting, setIsInviting] = useState(false);
  const [newInviteEmail, setNewInviteEmail] = useState("");
  const [bulkEmails, setBulkEmails] = useState("");
  const [showBulkInvite, setShowBulkInvite] = useState(false);
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

        trainersWithProfiles.push({
          ...trainer,
          user_profile: userProfile || undefined,
          granted_by_profile: grantedByProfile || undefined
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

  const inviteUser = async (email: string) => {
    try {
      // First check if user exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .eq('email', email.toLowerCase().trim())
        .single();

      if (existingUser) {
        // User exists, grant access directly
        const { data: currentUser } = await supabase.auth.getUser();
        if (!currentUser.user) throw new Error('Not authenticated');

        // Check if user already has access
        const { data: existingAccess } = await supabase
          .from('master_trainer_access')
          .select('id')
          .eq('user_id', existingUser.id)
          .single();

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

        // Send notification email to existing user
        try {
          await supabase.functions.invoke('send-master-trainer-notification', {
            body: {
              email: email.toLowerCase().trim(),
              firstName: existingUser.first_name,
              lastName: existingUser.last_name,
              isNewUser: false
            }
          });
        } catch (emailError) {
          console.error('Failed to send notification email:', emailError);
          // Don't fail the whole process if email fails
        }

        toast({
          title: "Success",
          description: `Master trainer access granted to ${email}. Notification email sent.`,
        });
      } else {
        // User doesn't exist, create invitation and send signup email
        const { data: currentUser } = await supabase.auth.getUser();
        if (!currentUser.user) throw new Error('Not authenticated');

        // Create invitation record
        const { error: inviteError } = await supabase
          .from('master_trainer_invitations')
          .insert({
            email: email.toLowerCase().trim(),
            invited_by: currentUser.user.id,
            status: 'pending'
          });

        if (inviteError) throw inviteError;

        // Send invitation email
        try {
          await supabase.functions.invoke('send-master-trainer-notification', {
            body: {
              email: email.toLowerCase().trim(),
              firstName: null,
              lastName: null,
              isNewUser: true
            }
          });
        } catch (emailError) {
          console.error('Failed to send invitation email:', emailError);
          // Don't fail the whole process if email fails
        }

        toast({
          title: "Invitation Sent",
          description: `Invitation sent to ${email}. They will receive instructions to create an account and access the Master Trainer dashboard.`,
        });
      }

      await fetchMasterTrainers();
    } catch (error: any) {
      console.error('Error inviting user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to invite user",
        variant: "destructive",
      });
    }
  };

  const handleSingleInvite = async () => {
    if (!newInviteEmail.trim()) return;
    
    setIsInviting(true);
    await inviteUser(newInviteEmail.trim());
    setNewInviteEmail("");
    setIsInviting(false);
  };

  const handleBulkInvite = async () => {
    if (!bulkEmails.trim()) return;

    const emails = bulkEmails
      .split(/[,\n]/)
      .map(email => email.trim())
      .filter(email => email && email.includes('@'));

    if (emails.length === 0) {
      toast({
        title: "Error",
        description: "Please enter valid email addresses",
        variant: "destructive",
      });
      return;
    }

    setIsInviting(true);
    
    for (const email of emails) {
      await inviteUser(email);
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Master Trainer Management</h1>
          <p className="text-muted-foreground">Manage access to the AI Ready ASEAN Master Trainer dashboard</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowBulkInvite(!showBulkInvite)}
          >
            <Users className="h-4 w-4 mr-2" />
            Bulk Invite
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <CardTitle className="text-sm font-medium">Total Managed</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{masterTrainers.length}</div>
            <p className="text-xs text-muted-foreground">Active trainers</p>
          </CardContent>
        </Card>
      </div>

      {/* Single Invite */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Grant Master Trainer Access
          </CardTitle>
          <CardDescription>
            Grant access to the AI Ready ASEAN Master Trainer dashboard. Note: Users must have already created an account.
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
                onKeyPress={(e) => e.key === 'Enter' && handleSingleInvite()}
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleSingleInvite}
                disabled={isInviting || !newInviteEmail.trim()}
              >
                {isInviting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
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
              Enter multiple email addresses separated by commas or new lines. Users must have already created accounts.
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
                  onClick={handleBulkInvite}
                  disabled={isInviting || !bulkEmails.trim()}
                >
                  {isInviting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
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
    </div>
  );
}