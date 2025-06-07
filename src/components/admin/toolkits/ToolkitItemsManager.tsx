
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SortableContainer, SortableElement, arrayMove } from "react-sortable-hoc";
import { ToolkitItemForm } from "./ToolkitItemForm";
import { SortableToolkitItem } from "./SortableToolkitItem";

interface ToolkitItem {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  order_index: number | null;
  created_at: string;
}

interface ToolkitItemsManagerProps {
  toolkitId: string;
}

const SortableList = SortableContainer(({ children }: { children: React.ReactNode }) => (
  <div className="space-y-4">{children}</div>
));

export function ToolkitItemsManager({ toolkitId }: ToolkitItemsManagerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [items, setItems] = useState<ToolkitItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  const { data: fetchedItems, isLoading } = useQuery({
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

  useEffect(() => {
    if (fetchedItems) {
      setItems(fetchedItems);
    }
  }, [fetchedItems]);

  const handleAdd = async (data: any) => {
    try {
      const maxOrder = items.length > 0 ? Math.max(...items.map(item => item.order_index || 0)) : -1;
      
      const { data: newItem, error } = await supabase
        .from("toolkit_items")
        .insert([{ 
          ...data, 
          toolkit_id: toolkitId,
          order_index: maxOrder + 1
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Item added",
        description: "The toolkit item has been successfully added.",
      });
      
      setItems([...items, newItem]);
      setIsAdding(false);
    } catch (error: any) {
      toast({
        title: "Error adding item",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const { error } = await supabase
        .from("toolkit_items")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Item deleted",
        description: "The toolkit item has been successfully deleted.",
      });
      
      setItems(items.filter(item => item.id !== id));
    } catch (error: any) {
      toast({
        title: "Error deleting item",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const onSortEnd = async ({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) => {
    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);

    // Update the order in the database
    try {
      const updates = newItems.map((item, index) => ({
        id: item.id,
        order_index: index,
      }));

      for (const update of updates) {
        await supabase
          .from("toolkit_items")
          .update({ order_index: update.order_index })
          .eq("id", update.id);
      }

      toast({
        title: "Order updated",
        description: "The item order has been successfully updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating order",
        description: error.message,
        variant: "destructive",
      });
      // Revert the order if there's an error
      queryClient.invalidateQueries({ queryKey: ["toolkit-items", toolkitId] });
    }
  };

  if (isLoading) {
    return <div>Loading items...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Toolkit Items</h2>
          <p className="text-muted-foreground">
            Add files and resources to your toolkit. Drag and drop to reorder.
          </p>
        </div>
        <Button onClick={() => setIsAdding(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Item</CardTitle>
          </CardHeader>
          <CardContent>
            <ToolkitItemForm 
              onSubmit={handleAdd}
              onCancel={() => setIsAdding(false)}
            />
          </CardContent>
        </Card>
      )}

      {items.length === 0 && !isAdding ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No items added yet.</p>
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Item
            </Button>
          </CardContent>
        </Card>
      ) : (
        <SortableList onSortEnd={onSortEnd} useDragHandle>
          {items.map((item, index) => (
            <SortableToolkitItem
              key={item.id}
              index={index}
              item={item}
              onDelete={handleDelete}
            />
          ))}
        </SortableList>
      )}
    </div>
  );
}
