import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Trash2, Search } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function AdminUsers() {
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Error loading users",
          description: error.message,
          variant: "destructive",
        });
      },
    },
  });

  // Filter users based on search term
  const filteredUsers = users?.filter(user => {
    if (!search) return true;

    const searchLower = search.toLowerCase();
    const email = user.email?.toLowerCase() || '';
    const firstName = user.first_name?.toLowerCase() || '';
    const lastName = user.last_name?.toLowerCase() || '';
    const fullName = `${firstName} ${lastName}`.trim();
    const role = user.is_superadmin ? 'superadmin' : user.is_admin ? 'admin' : 'user';

    return (
      email.includes(searchLower) ||
      firstName.includes(searchLower) ||
      lastName.includes(searchLower) ||
      fullName.includes(searchLower) ||
      role.includes(searchLower)
    );
  });

  const handleDeleteClick = (userId: string) => {
    setUserToDelete(userId);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    try {
      const user = users?.find(u => u.id === userToDelete);

      if (!user) {
        throw new Error("User not found");
      }

      if (user.is_superadmin) {
        toast({
          title: "Cannot delete superadmin",
          description: "Superadmin users cannot be deleted",
          variant: "destructive",
        });
        return;
      }

      // Get current session for authentication
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        throw new Error("Authentication required");
      }

      // Use edge function to delete user with proper permissions
      const { data, error } = await supabase.functions.invoke('admin-delete-user', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: {
          userId: userToDelete
        }
      });

      if (error) {
        throw new Error(error.message || "Failed to delete user");
      }

      if (!data?.success) {
        throw new Error(data?.error || "Failed to delete user");
      }

      queryClient.invalidateQueries({ queryKey: ['admin-users'] });

      toast({
        title: "Success",
        description: data.message || "User deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error deleting user",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setUserToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <div className="flex items-center space-x-2">
          <Search className="w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                {search ? "No users found matching your search" : "No users found"}
              </TableCell>
            </TableRow>
          ) : (
            filteredUsers?.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.first_name} {user.last_name}
                </TableCell>
                <TableCell>
                  {user.is_superadmin ? 'Superadmin' : user.is_admin ? 'Admin' : 'User'}
                </TableCell>
                <TableCell>
                  {new Date(user.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteClick(user.id)}
                    disabled={user.is_superadmin}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user
              and all their data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}