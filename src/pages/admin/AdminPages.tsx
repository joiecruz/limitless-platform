import { useQuery } from "@tanstack/react-query";
import { useState } from "react"; // Added this import
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
import { Edit, Trash2, Eye, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import { CreatePageDialog } from "@/components/admin/pages/CreatePageDialog";

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

  const { data: pages, isLoading } = useQuery({
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Landing Pages</h1>
          <p className="text-muted-foreground mt-1">
            Manage your website's landing pages
          </p>
        </div>
        <CreatePageDialog />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages?.map((page) => (
              <TableRow key={page.id}>
                <TableCell className="font-medium">{page.title}</TableCell>
                <TableCell className="text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    {page.slug}
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    page.published 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {page.published ? 'Published' : 'Draft'}
                  </span>
                </TableCell>
                <TableCell>{formatDate(page.updated_at)}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handlePreview(page.slug)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleEdit(page.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDelete(page.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {pages?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <p className="text-muted-foreground">No pages found</p>
                  <Button variant="link" className="mt-2">
                    Create your first page
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}