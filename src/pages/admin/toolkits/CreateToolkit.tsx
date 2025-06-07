
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ToolkitForm } from "@/components/admin/toolkits/ToolkitForm";
import { ToolkitItemsManager } from "@/components/admin/toolkits/ToolkitItemsManager";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";

export default function CreateToolkit() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [createdToolkitId, setCreatedToolkitId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("details");

  const handleSubmit = async (data: any) => {
    try {
      const { data: toolkit, error } = await supabase
        .from("toolkits")
        .insert([data])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Toolkit created",
        description: "The toolkit has been successfully created. You can now add items to it.",
      });
      
      setCreatedToolkitId(toolkit.id);
      setActiveTab("items");
      queryClient.invalidateQueries({ queryKey: ["admin-toolkits"] });
    } catch (error: any) {
      toast({
        title: "Error creating toolkit",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleFinish = () => {
    navigate("/admin/content");
  };

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
        <h1 className="text-3xl font-bold">Create Toolkit</h1>
        <p className="text-muted-foreground">
          Add a new toolkit with detailed information and resources.
        </p>
      </div>

      <div className="max-w-6xl">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Toolkit Details</TabsTrigger>
            <TabsTrigger value="items" disabled={!createdToolkitId}>
              Items ({createdToolkitId ? "Available" : "Create toolkit first"})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-6">
            <ToolkitForm onSubmit={handleSubmit} />
          </TabsContent>
          
          <TabsContent value="items" className="space-y-6">
            {createdToolkitId && (
              <div className="space-y-6">
                <ToolkitItemsManager toolkitId={createdToolkitId} />
                <div className="flex justify-end">
                  <Button onClick={handleFinish}>
                    Finish & Return to Content
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
