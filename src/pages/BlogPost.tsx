import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";
import { CTASection } from "@/components/site-config/CTASection";
import { format } from "date-fns";
import { useEffect } from "react";

export default function BlogPost() {
  const { slug } = useParams();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const { data: post, isLoading } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  // Calculate read time (assuming average reading speed of 200 words per minute)
  const wordCount = post.content.split(/\s+/).length;
  const readTime = Math.ceil(wordCount / 200);

  return (
    <div className="min-h-screen bg-white">
      <MainNav />
      
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        {post.cover_image && (
          <div className="aspect-video w-full mb-12 rounded-lg overflow-hidden">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 mb-12 text-sm text-gray-600">
          <time dateTime={post.created_at}>
            {format(new Date(post.created_at), 'MMMM d, yyyy')}
          </time>
          <span>·</span>
          <span>{readTime} min read</span>
          {post.categories && post.categories.length > 0 && (
            <>
              <span>·</span>
              <div className="flex flex-wrap gap-2">
                {post.categories.map((category: string) => (
                  <span
                    key={category}
                    className="bg-primary-50 text-primary-700 px-2 py-1 rounded-full text-xs"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
        
        <div 
          className="prose prose-lg max-w-none prose-headings:font-bold prose-p:text-gray-600 prose-a:text-primary-600 prose-img:rounded-lg mb-24"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      <CTASection />
      <Footer />
    </div>
  );
}