
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ToolkitForm } from "@/components/admin/toolkits/ToolkitForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function CreateToolkit() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (data: any) => {
    try {
      const { error } = await supabase
        .from("toolkits")
        .insert([data]);

      if (error) throw error;

      toast({
        title: "Toolkit created",
        description: "The toolkit has been successfully created.",
      });
      
      queryClient.invalidateQueries({ queryKey: ["admin-toolkits"] });
      navigate("/admin/content");
    } catch (error: any) {
      toast({
        title: "Error creating toolkit",
        description: error.message,
        variant: "destructive",
      });
    }
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

      <div className="max-w-4xl">
        <ToolkitForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
