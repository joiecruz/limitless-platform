
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
} from "@/components/ui/alert-dialog";

export function LogosTable() {
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: logos = [], isLoading, refetch } = useQuery({
    queryKey: ["admin-logos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("client_logos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("client_logos")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Logo deleted successfully",
      });
      
      refetch();
    } catch (error: any) {
      console.error("Error deleting logo:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete logo",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return <div>Loading logos...</div>;
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logos.map((logo) => (
            <TableRow key={logo.id}>
              <TableCell>
                <img
                  src={logo.image_url}
                  alt={logo.name}
                  className="w-12 h-12 object-contain"
                />
              </TableCell>
              <TableCell>{logo.name}</TableCell>
              <TableCell>{new Date(logo.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeletingId(logo.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Logo</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this logo? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingId && handleDelete(deletingId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
