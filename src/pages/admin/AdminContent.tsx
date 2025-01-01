import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PagesTable } from "@/components/admin/pages/PagesTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PageEditor } from "@/components/admin/pages/PageEditor";
import { useToast } from "@/hooks/use-toast";

export default function AdminContent() {
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const { toast } = useToast();

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
      return data;
    },
  });

  const handleEdit = (id: string) => {
    setSelectedPage(id);
    setIsEditorOpen(true);
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

  const handlePreview = (slug: string) => {
    window.open(`/preview/pages/${slug}`, '_blank');
  };

  const selectedPageData = pages?.find(page => page.id === selectedPage);

  return (
    <div className="p-6">
      <Tabs defaultValue="pages" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pages">Landing Pages</TabsTrigger>
        </TabsList>

        <TabsContent value="pages" className="space-y-6">
          <PagesTable
            pages={pages}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onPreview={handlePreview}
          />
        </TabsContent>
      </Tabs>

      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedPage ? 'Edit Page' : 'Create New Page'}</DialogTitle>
          </DialogHeader>
          <PageEditor
            pageId={selectedPage || undefined}
            initialData={selectedPageData}
            onSuccess={() => {
              setIsEditorOpen(false);
              setSelectedPage(null);
              refetch();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}