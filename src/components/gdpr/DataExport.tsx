import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function DataExport() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Fetch user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Fetch user enrollments
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('*')
        .eq('user_id', user.id);

      // Fetch user messages
      const { data: messages } = await supabase
        .from('messages')
        .select('*')
        .eq('user_id', user.id);

      const userData = {
        profile,
        enrollments,
        messages,
        exportDate: new Date().toISOString(),
      };

      // Create and download file
      const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `user-data-export-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Export Successful",
        description: "Your data has been exported successfully.",
      });
    } catch (error: any) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: error.message || "Failed to export data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Export Your Data</h3>
      <p className="text-sm text-gray-600">
        Download a copy of your personal data in JSON format.
      </p>
      <Button onClick={handleExport} disabled={loading}>
        {loading ? "Exporting..." : "Export Data"}
      </Button>
    </div>
  );
}