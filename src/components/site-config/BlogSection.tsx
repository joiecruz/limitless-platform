import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  created_at: string;
  slug: string;
  cover_image: string;
}

export function BlogSection() {
  const navigate = useNavigate();
  
  const { data: posts, isLoading } = useQuery({
    queryKey: ['featured-blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts?.map((post) => (
        <div 
          key={post.id} 
          className="bg-white rounded-lg overflow-hidden cursor-pointer border border-gray-100 hover:border-[#393CA0]/20 transition-all duration-200 hover:shadow-md"
          onClick={() => navigate(`/blog/${post.slug}`)}
        >
          {post.cover_image && (
            <div className="aspect-video w-full overflow-hidden">
              <img
                src={post.cover_image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-6 space-y-4">
            <h3 className="text-2xl font-semibold text-gray-900 hover:text-[#393CA0] transition-colors">
              {post.title}
            </h3>
            <div className="text-sm text-gray-600">
              {format(new Date(post.created_at), 'MMMM d, yyyy')}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}