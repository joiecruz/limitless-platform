
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  order_index: number;
  created_at: string;
}

export function ManageToolkitItemsDialog({ toolkitId, open, onOpenChange }: ManageToolkitItemsDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateItemDialogOpen, setIsCreateItemDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

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

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const { error } = await supabase
        .from("toolkit_items")
        .delete()
        .eq("id", itemId);

      if (error) throw error;

      toast({
        title: "Item deleted",
        description: "The toolkit item has been successfully deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["toolkit-items", toolkitId] });
    } catch (error: any) {
      toast({
        title: "Error deleting item",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Toolkit Items</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setIsCreateItemDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
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
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>File URL</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.order_index}</TableCell>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {item.description || "No description"}
                    </TableCell>
                    <TableCell>
                      <a 
                        href={item.file_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline truncate block max-w-xs"
                      >
                        {item.file_url}
                      </a>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
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
                          onClick={() => handleDeleteItem(item.id)}
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

        <CreateToolkitItemDialog
          toolkitId={toolkitId}
          open={isCreateItemDialogOpen}
          onOpenChange={setIsCreateItemDialogOpen}
        />

        {selectedItemId && (
          <EditToolkitItemDialog
            itemId={selectedItemId}
            open={!!selectedItemId}
            onOpenChange={(open) => !open && setSelectedItemId(null)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
