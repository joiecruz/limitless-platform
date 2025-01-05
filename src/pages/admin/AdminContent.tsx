import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BlogsTable } from "@/components/admin/blog/BlogsTable";
import { CreateBlogDialog } from "@/components/admin/blog/CreateBlogDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function AdminContent() {
  const { toast } = useToast();
  const { data: blogs, isLoading, refetch } = useQuery({
    queryKey: ['admin-blogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error loading articles",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      return data;
    },
  });

  return (
    <div className="p-6">
      <Tabs defaultValue="articles" className="space-y-6">
        <TabsList>
          <TabsTrigger value="articles">Articles</TabsTrigger>
        </TabsList>

        <TabsContent value="articles" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Articles</h2>
            <CreateBlogDialog onSuccess={() => refetch()} />
          </div>
          
          <BlogsTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}