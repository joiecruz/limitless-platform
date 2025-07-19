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
  profiles: {
    email: string;
    first_name?: string;
    last_name?: string;
  } | null;
  granted_by_profile: {
    email: string;
    first_name?: string;
    last_name?: string;
  } | null;
}

interface PendingInvitation {
  id: string;
  email: string;
  invited_by: string;
  created_at: string;
  status: string;
  invited_by_profile: {
    email: string;
    first_name?: string;
    last_name?: string;
  } | null;
}

export default function AdminMasterTrainers() {
  const [masterTrainers, setMasterTrainers] = useState<MasterTrainer[]>([]);
  const [pendingInvitations, setPendingInvitations] = useState<PendingInvitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInviting, setIsInviting] = useState(false);
  const [newInviteEmail, setNewInviteEmail] = useState("");
  const [bulkEmails, setBulkEmails] = useState("");
  const [showBulkInvite, setShowBulkInvite] = useState(false);
  const { toast } = useToast();

  const fetchMasterTrainers = async () => {
    try {
      const { data, error } = await supabase
        .from('master_trainer_access')
        .select(`
          *,
          profiles:user_id (
            email,
            first_name,
            last_name
          ),
          granted_by_profile:granted_by (
            email,
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMasterTrainers(data || []);
    } catch (error) {
      console.error('Error fetching master trainers:', error);
      toast({
        title: "Error",
        description: "Failed to load master trainers",
        variant: "destructive",
      });
    }
  };

  const fetchPendingInvitations = async () => {
    try {
      const { data, error } = await supabase
        .from('master_trainer_invitations')
        .select(`
          *,
          invited_by_profile:invited_by (
            email,
            first_name,
            last_name
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error && error.code !== 'PGRST116') throw error; // Ignore table doesn't exist error
      setPendingInvitations(data || []);
    } catch (error) {
      console.error('Error fetching pending invitations:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchMasterTrainers(), fetchPendingInvitations()]);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const inviteUser = async (email: string) => {
    try {
      // First check if user exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email.toLowerCase().trim())
        .single();

      if (existingUser) {
        // User exists, grant access directly
        const { data: currentUser } = await supabase.auth.getUser();
        if (!currentUser.user) throw new Error('Not authenticated');

        const { error } = await supabase
          .from('master_trainer_access')
          .insert({
            user_id: existingUser.id,
            granted_by: currentUser.user.id
          });

        if (error) throw error;

        toast({
          title: "Success",
          description: `Master trainer access granted to ${email}`,
        });
      } else {
        // User doesn't exist, create pending invitation
        const { data: currentUser } = await supabase.auth.getUser();
        if (!currentUser.user) throw new Error('Not authenticated');

        const { error } = await supabase
          .from('master_trainer_invitations')
          .insert({
            email: email.toLowerCase().trim(),
            invited_by: currentUser.user.id,
            status: 'pending'
          });

        if (error) throw error;

        toast({
          title: "Invitation Sent",
          description: `Invitation sent to ${email}. Access will be granted when they create an account.`,
        });
      }

      await Promise.all([fetchMasterTrainers(), fetchPendingInvitations()]);
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

  const cancelInvitation = async (invitationId: string, email: string) => {
    try {
      const { error } = await supabase
        .from('master_trainer_invitations')
        .update({ status: 'cancelled' })
        .eq('id', invitationId);

      if (error) throw error;

      toast({
        title: "Invitation Cancelled",
        description: `Invitation cancelled for ${email}`,
      });

      await fetchPendingInvitations();
    } catch (error: any) {
      console.error('Error cancelling invitation:', error);
      toast({
        title: "Error",
        description: "Failed to cancel invitation",
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <CardTitle className="text-sm font-medium">Pending Invitations</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingInvitations.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting user registration</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Managed</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{masterTrainers.length + pendingInvitations.length}</div>
            <p className="text-xs text-muted-foreground">Active + pending</p>
          </CardContent>
        </Card>
      </div>

      {/* Single Invite */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Invite New Master Trainer
          </CardTitle>
          <CardDescription>
            Grant access to the AI Ready ASEAN Master Trainer dashboard
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
                Invite
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
              Bulk Invite Master Trainers
            </CardTitle>
            <CardDescription>
              Enter multiple email addresses separated by commas or new lines
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
                  Send Invitations
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

      {/* Pending Invitations */}
      {pendingInvitations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              Pending Invitations
            </CardTitle>
            <CardDescription>
              Invitations waiting for users to create accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Invited By</TableHead>
                  <TableHead>Date Invited</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingInvitations.map((invitation) => (
                  <TableRow key={invitation.id}>
                    <TableCell className="font-medium">{invitation.email}</TableCell>
                    <TableCell>
                      {invitation.invited_by_profile?.first_name || invitation.invited_by_profile?.last_name
                        ? `${invitation.invited_by_profile.first_name || ''} ${invitation.invited_by_profile.last_name || ''}`.trim()
                        : invitation.invited_by_profile?.email || 'Unknown'}
                    </TableCell>
                    <TableCell>
                      {new Date(invitation.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Cancel Invitation</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to cancel the invitation for {invitation.email}?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => cancelInvitation(invitation.id, invitation.email)}
                            >
                              Cancel Invitation
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
                    {trainer.profiles?.first_name || trainer.profiles?.last_name
                      ? `${trainer.profiles.first_name || ''} ${trainer.profiles.last_name || ''}`.trim()
                      : 'Unknown User'}
                  </TableCell>
                  <TableCell>{trainer.profiles?.email || 'No email'}</TableCell>
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
                            Are you sure you want to revoke Master Trainer access for {trainer.profiles?.email}?
                            They will no longer be able to access the Master Trainer dashboard.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => revokeAccess(trainer.id, trainer.profiles?.email || 'this user')}
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