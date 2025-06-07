
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ToolkitForm } from "@/components/admin/toolkits/ToolkitForm";
import { ToolkitItemsManager } from "@/components/admin/toolkits/ToolkitItemsManager";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function EditToolkit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("details");
  const [isLoading, setIsLoading] = useState(false);

  const { data: toolkit, isLoading: isLoadingToolkit } = useQuery({
    queryKey: ["toolkit", id],
    queryFn: async () => {
      if (!id) throw new Error("No toolkit ID provided");
      
      const { data, error } = await supabase
        .from("toolkits")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const handleSubmit = async (data: any) => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("toolkits")
        .update(data)
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Toolkit updated",
        description: "The toolkit has been successfully updated.",
      });
      
      queryClient.invalidateQueries({ queryKey: ["admin-toolkits"] });
      queryClient.invalidateQueries({ queryKey: ["toolkit", id] });
    } catch (error: any) {
      toast({
        title: "Error updating toolkit",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingToolkit) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!toolkit) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Toolkit not found</h1>
        <p className="text-gray-600 mt-2">The toolkit you're looking for doesn't exist.</p>
        <Button 
          onClick={() => navigate("/admin/content")}
          className="mt-4"
        >
          Back to Content
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/content")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Content
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold">Edit Toolkit</h1>
        <p className="text-muted-foreground">
          Update toolkit information and manage resources.
        </p>
      </div>

      <div className="max-w-6xl">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Toolkit Details</TabsTrigger>
            <TabsTrigger value="items">Items</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-6">
            <ToolkitForm 
              onSubmit={handleSubmit} 
              defaultValues={toolkit}
              isLoading={isLoading}
            />
          </TabsContent>
          
          <TabsContent value="items" className="space-y-6">
            <ToolkitItemsManager toolkitId={id!} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
