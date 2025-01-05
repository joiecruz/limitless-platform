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
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tool } from "@/types/tool";
import { CreateToolDialog } from "./CreateToolDialog";
import { EditToolDialog } from "./EditToolDialog";

export function ToolsTable() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: tools, isLoading } = useQuery({
    queryKey: ["admin-tools"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("innovation_tools")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Tool[];
    },
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tool?")) return;

    try {
      const { error } = await supabase
        .from("innovation_tools")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Tool deleted",
        description: "The tool has been successfully deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-tools"] });
    } catch (error: any) {
      toast({
        title: "Error deleting tool",
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
        <h2 className="text-2xl font-bold">Tools</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>Add Tool</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Downloads</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tools?.map((tool) => (
            <TableRow key={tool.id}>
              <TableCell>{tool.name}</TableCell>
              <TableCell>{tool.category}</TableCell>
              <TableCell>{tool.type}</TableCell>
              <TableCell>{tool.downloads_count || 0}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedToolId(tool.id)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(tool.id)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <CreateToolDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
      
      {selectedToolId && (
        <EditToolDialog
          toolId={selectedToolId}
          open={!!selectedToolId}
          onOpenChange={(open) => !open && setSelectedToolId(null)}
        />
      )}
    </div>
  );
}