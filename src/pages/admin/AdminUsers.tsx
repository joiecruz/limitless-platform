import { useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
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
import { Loader2, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react";
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
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

const PAGE_SIZE = 25;

interface AdminUserRow {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  is_admin: boolean | null;
  is_superadmin: boolean | null;
  created_at: string;
}

export default function AdminUsers() {
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const debouncedSearch = useDebouncedValue(search.trim(), 400);

  // Reset to first page when the search term changes.
  if (page !== 0 && debouncedSearch !== "" && page * PAGE_SIZE > 0) {
    // no-op; handled by including debouncedSearch in queryKey below.
  }

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["admin-users", debouncedSearch, page],
    queryFn: async () => {
      const from = page * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let query = supabase
        .from("profiles")
        .select(
          "id, email, first_name, last_name, is_admin, is_superadmin, created_at",
          { count: "exact" }
        )
        .order("created_at", { ascending: false })
        .range(from, to);

      if (debouncedSearch) {
        const term = `%${debouncedSearch}%`;
        query = query.or(
          `email.ilike.${term},first_name.ilike.${term},last_name.ilike.${term}`
        );
      }

      const { data, error, count } = await query;
      if (error) throw error;
      return { rows: (data || []) as AdminUserRow[], total: count ?? 0 };
    },
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData,
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

  const users = data?.rows ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(0);
  };

  const handleDeleteClick = (userId: string) => {
    setUserToDelete(userId);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    try {
      const user = users.find((u) => u.id === userToDelete);

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

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        throw new Error("Authentication required");
      }

      const { data, error } = await supabase.functions.invoke("admin-delete-user", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: { userId: userToDelete },
      });

      if (error) {
        throw new Error(error.message || "Failed to delete user");
      }

      if (!data?.success) {
        throw new Error(data?.error || "Failed to delete user");
      }

      queryClient.invalidateQueries({ queryKey: ["admin-users"] });

      toast({
        title: "Success",
        description: data.message || "User deleted successfully",
      });
    } catch (error: any) {
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
            onChange={(e) => handleSearchChange(e.target.value)}
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
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                {debouncedSearch ? "No users found matching your search" : "No users found"}
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.first_name} {user.last_name}
                </TableCell>
                <TableCell>
                  {user.is_superadmin ? "Superadmin" : user.is_admin ? "Admin" : "User"}
                </TableCell>
                <TableCell>
                  {new Date(user.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteClick(user.id)}
                    disabled={!!user.is_superadmin}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-gray-500">
          {total > 0
            ? `Showing ${page * PAGE_SIZE + 1}–${Math.min((page + 1) * PAGE_SIZE, total)} of ${total}`
            : ""}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0 || isFetching}
          >
            <ChevronLeft className="h-4 w-4" /> Prev
          </Button>
          <span className="text-sm">
            Page {page + 1} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={page + 1 >= totalPages || isFetching}
          >
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

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
