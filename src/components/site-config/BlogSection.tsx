import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  created_at: string;
  slug: string;
}

export function BlogSection() {
  const navigate = useNavigate();

  const { data: blogs } = useQuery({
    queryKey: ['recent-blogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('id, title, excerpt, created_at, slug')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      return data as BlogPost[];
    }
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReadTime = (excerpt: string | null) => {
    if (!excerpt) return '3 min read';
    const wordsPerMinute = 200;
    const words = excerpt.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Updates and Insights
          </h2>
          <p className="text-lg text-gray-600">
            Explore the latest trends, expert insights, and transformative ideas at the intersection of innovation and social change
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {blogs?.map((blog) => (
            <div 
              key={blog.id} 
              className="bg-white rounded-lg overflow-hidden cursor-pointer"
              onClick={() => navigate(`/blog/${blog.slug}`)}
            >
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 hover:text-[#393CA0] transition-colors">
                  {blog.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{formatDate(blog.created_at)}</span>
                  <span>•</span>
                  <span>{getReadTime(blog.excerpt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button 
            onClick={() => navigate('/blog')}
            variant="outline"
            className="border-[#393CA0] text-[#393CA0] hover:bg-[#393CA0]/5"
          >
            Read more
          </Button>
        </div>
      </div>
    </div>
  );
}