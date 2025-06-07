
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Plus, Edit, Trash2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CreateToolkitItemDialog } from "./CreateToolkitItemDialog";
import { EditToolkitItemDialog } from "./EditToolkitItemDialog";

interface ManageToolkitItemsDialogProps {
  toolkitId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ToolkitItem {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  order_index: number | null;
  created_at: string;
}

export function ManageToolkitItemsDialog({ toolkitId, open, onOpenChange }: ManageToolkitItemsDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: items, isLoading } = useQuery({
    queryKey: ["toolkit-items", toolkitId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("toolkit_items")
        .select("*")
        .eq("toolkit_id", toolkitId)
        .order("order_index", { ascending: true });

      if (error) throw error;
      return data as ToolkitItem[];
    },
    enabled: !!toolkitId,
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this file?")) return;

    try {
      const { error } = await supabase
        .from("toolkit_items")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "File deleted",
        description: "The toolkit file has been successfully deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["toolkit-items", toolkitId] });
    } catch (error: any) {
      toast({
        title: "Error deleting file",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Manage Toolkit Files</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add File
              </Button>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>File Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items?.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.order_index || 0}</TableCell>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {item.description || "No description"}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(item.file_url, '_blank')}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedItemId(item.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <CreateToolkitItemDialog
        toolkitId={toolkitId}
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />

      {selectedItemId && (
        <EditToolkitItemDialog
          itemId={selectedItemId}
          open={!!selectedItemId}
          onOpenChange={(open) => !open && setSelectedItemId(null)}
        />
      )}
    </>
  );
}
