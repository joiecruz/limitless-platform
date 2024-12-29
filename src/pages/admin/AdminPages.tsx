import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { EditPageDialog } from "@/components/admin/pages/EditPageDialog";
import { PagesHeader } from "@/components/admin/pages/PagesHeader";
import { PagesTable } from "@/components/admin/pages/PagesTable";

interface Page {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  created_at: string;
  updated_at: string;
  meta_description: string | null;
}

export default function AdminPages() {
  const { toast } = useToast();
  const [selectedPage, setSelectedPage] = useState<string | null>(null);

  const { data: pages, isLoading, refetch } = useQuery({
    queryKey: ['admin-pages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error loading pages",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      return data as Page[];
    },
  });

  const handlePreview = (slug: string) => {
    window.open(`/preview/pages/${slug}`, '_blank');
  };

  const handleEdit = (id: string) => {
    setSelectedPage(id);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('pages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Page deleted",
        description: "The page has been successfully deleted.",
      });
      refetch();
    } catch (error: any) {
      toast({
        title: "Error deleting page",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <PagesHeader />
      <PagesTable
        pages={pages}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPreview={handlePreview}
      />
      <EditPageDialog
        pageId={selectedPage}
        isOpen={!!selectedPage}
        onClose={() => setSelectedPage(null)}
        onSuccess={refetch}
      />
    </div>
  );
}