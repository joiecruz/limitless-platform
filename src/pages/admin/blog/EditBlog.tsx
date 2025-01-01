import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BlogForm } from "@/components/admin/blog/BlogForm";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: blog, isLoading } = useQuery({
    queryKey: ['blog', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="p-6">
        <p>Blog post not found</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 space-y-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/admin/content")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Content
        </Button>
        <h1 className="text-2xl font-bold">Edit Blog Post</h1>
      </div>
      
      <BlogForm 
        initialData={blog}
        onSuccess={() => navigate("/admin/content")}
        isEdit
        blogId={id}
      />
    </div>
  );
}