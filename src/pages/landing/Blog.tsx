
import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { CTASection } from "@/components/site-config/CTASection";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { OpenGraphTags } from "@/components/common/OpenGraphTags";

export default function Blog() {
  const { toast } = useToast();

  const { data: posts, isLoading, error } = useQuery({
    queryKey: ["published-blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });
      
      if (error) {
        
        toast({
          title: "Error loading blog posts",
          description: "Unable to load blog posts. Please try again later.",
          variant: "destructive",
        });
        throw error;
      }
      
      return data || [];
    },
  });

  // Log any errors for debugging
  useEffect(() => {
    if (error) {
      
    }
  }, [error]);

  // Metadata for the blog listing page
  const baseUrl = window.location.origin;
  const canonicalUrl = `${baseUrl}/blog`;
  const pageTitle = "Blog | Limitless Lab";
  const pageDescription = "Explore insights, ideas, and innovations from Limitless Lab's experts on social innovation, design thinking, and sustainable development.";
  const pageImage = "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/Hero_section_image.png";

  return (
    <div className="min-h-screen bg-white">
      <OpenGraphTags
        title={pageTitle}
        description={pageDescription}
        imageUrl={pageImage}
        url={canonicalUrl}
        type="website"
      />
      
      <MainNav />
      
      {/* Hero Section */}
      <div className="bg-[#393CA0] py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-white mb-8">Blog</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Explore insights, ideas, and innovations from our experts on
              social innovation, design thinking, and sustainable development.
            </p>
          </div>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                  <div className="bg-gray-200 h-6 w-3/4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <h3 className="text-xl text-gray-600">Failed to load blog posts</h3>
              <p className="mt-2 text-gray-500">Please try again later</p>
            </div>
          ) : (posts && posts.length > 0) ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link 
                  key={post.id} 
                  to={`/blog/${post.slug}`}
                  className="group"
                >
                  <div className="bg-white rounded-lg overflow-hidden border hover:shadow-lg transition-shadow h-full flex flex-col">
                    <div className="aspect-[16/9] relative">
                      <img
                        src={post.cover_image || "/placeholder.svg"}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-2">
                          {post.created_at && format(new Date(post.created_at), 'MMMM d, yyyy')}
                        </p>
                        <h3 className="text-xl font-semibold mb-3 group-hover:text-[#393CA0] transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                      </div>
                      <div className="text-[#393CA0] font-medium">Read more</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl text-gray-600">No blog posts found</h3>
              <p className="mt-2 text-gray-500">Check back later for new content</p>
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <CTASection />

      <Footer />
    </div>
  );
}
