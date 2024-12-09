import { formatDistanceToNow } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
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
import { useState, useEffect } from "react";
import { TableMember } from "./types";
import { supabase } from "@/integrations/supabase/client";

interface MembersTableProps {
  members: TableMember[];
  onDeleteMember: (member: TableMember) => void;
}

export function MembersTable({ members, onDeleteMember }: MembersTableProps) {
  const [memberToDelete, setMemberToDelete] = useState<TableMember | null>(null);
  const [currentUser, setCurrentUser] = useState<string | undefined>(undefined);

  // Get current user on component mount
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user?.id);
    };
    getCurrentUser();
  }, []);

  const handleDelete = () => {
    if (memberToDelete) {
      onDeleteMember(memberToDelete);
      setMemberToDelete(null);
    }
  };

  const isCurrentUser = (member: TableMember) => {
    if (member.status === 'Active' && currentUser) {
      return member.user_id === currentUser;
    }
    return false;
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Active</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member, index) => (
            <TableRow key={index}>
              <TableCell>
                {member.status === 'Active' && 'profiles' in member
                  ? `${member.profiles.first_name || ''} ${member.profiles.last_name || ''}`.trim() || 'Unnamed Member'
                  : 'Pending Member'}
              </TableCell>
              <TableCell>
                {member.status === 'Active' 
                  ? 'Email not available'
                  : member.email}
              </TableCell>
              <TableCell className="capitalize">{member.role}</TableCell>
              <TableCell>
                <Badge variant={member.status === 'Active' ? "default" : "secondary"}>
                  {member.status}
                </Badge>
              </TableCell>
              <TableCell>
                {formatDistanceToNow(new Date(member.last_active), { addSuffix: true })}
              </TableCell>
              <TableCell>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setMemberToDelete(member)}
                      disabled={isCurrentUser(member)}
                      title={isCurrentUser(member) ? "You cannot remove yourself" : "Remove member"}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        {member.status === 'Active'
                          ? "This will remove the member from your workspace. This action cannot be undone."
                          : "This will cancel the invitation. You can always invite this person again later."}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setMemberToDelete(null)}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}