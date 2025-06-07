
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Plus, Edit, Trash2, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { EditToolkitDialog } from "./EditToolkitDialog";
import { ManageToolkitItemsDialog } from "./ManageToolkitItemsDialog";

interface Toolkit {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  cover_image_url: string | null;
  created_at: string;
  updated_at: string;
}

export function ToolkitsTable() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [selectedToolkitId, setSelectedToolkitId] = useState<string | null>(null);
  const [manageItemsToolkitId, setManageItemsToolkitId] = useState<string | null>(null);

  const { data: toolkits, isLoading } = useQuery({
    queryKey: ["admin-toolkits"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("toolkits")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Toolkit[];
    },
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this toolkit?")) return;

    try {
      const { error } = await supabase
        .from("toolkits")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Toolkit deleted",
        description: "The toolkit has been successfully deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-toolkits"] });
    } catch (error: any) {
      toast({
        title: "Error deleting toolkit",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Toolkits</h2>
        <Button onClick={() => navigate("/admin/content/toolkits/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Toolkit
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {toolkits?.map((toolkit) => (
            <TableRow key={toolkit.id}>
              <TableCell className="font-medium">{toolkit.name}</TableCell>
              <TableCell>{toolkit.category || "No category"}</TableCell>
              <TableCell className="max-w-xs truncate">
                {toolkit.description || "No description"}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setManageItemsToolkitId(toolkit.id)}
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    Items
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedToolkitId(toolkit.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(toolkit.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {selectedToolkitId && (
        <EditToolkitDialog
          toolkitId={selectedToolkitId}
          open={!!selectedToolkitId}
          onOpenChange={(open) => !open && setSelectedToolkitId(null)}
        />
      )}

      {manageItemsToolkitId && (
        <ManageToolkitItemsDialog
          toolkitId={manageItemsToolkitId}
          open={!!manageItemsToolkitId}
          onOpenChange={(open) => !open && setManageItemsToolkitId(null)}
        />
      )}
    </div>
  );
}
