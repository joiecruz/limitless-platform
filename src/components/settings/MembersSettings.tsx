import { useContext, useState } from "react";
import { WorkspaceContext } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface WorkspaceMember {
  profiles: {
    first_name: string | null;
    last_name: string | null;
    email?: string;
  };
  role: string;
}

export function MembersSettings() {
  const { currentWorkspace } = useContext(WorkspaceContext);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: members, isLoading } = useQuery({
    queryKey: ['workspace-members', currentWorkspace?.id],
    queryFn: async () => {
      if (!currentWorkspace?.id) return [];
      
      const { data, error } = await supabase
        .from('workspace_members')
        .select(`
          role,
          profiles (
            first_name,
            last_name
          )
        `)
        .eq('workspace_id', currentWorkspace.id);

      if (error) {
        console.error('Error fetching members:', error);
        throw error;
      }

      return data as WorkspaceMember[];
    },
    enabled: !!currentWorkspace?.id,
  });

  const handleInvite = async (email: string) => {
    // TODO: Implement invite functionality
    toast({
      title: "Coming Soon",
      description: "Invite functionality will be implemented soon.",
    });
    setIsInviteDialogOpen(false);
  };

  if (!currentWorkspace) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <p className="text-muted-foreground">Please select a workspace</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">Members</h2>
        <p className="text-sm text-muted-foreground">
          Manage your workspace members and their roles.
        </p>
      </div>
      
      <div className="space-y-4">
        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button>Invite Members</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Members</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-muted-foreground">
                This feature is coming soon. You'll be able to invite team members via email.
              </p>
            </div>
          </DialogContent>
        </Dialog>
        
        <div className="rounded-md border">
          {isLoading ? (
            <div className="p-4">
              <p className="text-sm text-muted-foreground">Loading members...</p>
            </div>
          ) : !members?.length ? (
            <div className="p-4">
              <p className="text-sm text-muted-foreground">No members found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {member.profiles.first_name || member.profiles.last_name 
                        ? `${member.profiles.first_name || ''} ${member.profiles.last_name || ''}`.trim()
                        : 'Unnamed Member'}
                    </TableCell>
                    <TableCell className="capitalize">{member.role}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}