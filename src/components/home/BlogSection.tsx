
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { useBlogPosts } from "@/hooks/use-blog-posts";
import { urlFor } from "@/lib/sanity";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export function BlogSection() {
  const { toast } = useToast();
  const { data: posts, isLoading, error } = useBlogPosts();
  
  // Show a toast notification on error
  useEffect(() => {
    if (error) {
      console.error('Error loading blog posts in BlogSection:', error);
      toast({
        title: "Unable to load blog posts",
        description: "We're experiencing some technical difficulties. Please try again later.",
        variant: "destructive",
      });
    }
  }, [error, toast]);
  
  // Fallback to supabase blog posts if there's an error with Sanity
  const latestPosts = posts?.slice(0, 3) || [];

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Latest Articles</h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Stay updated with our latest insights and news
          </p>
        </div>

        {isLoading ? (
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[16/9] w-full bg-gray-200 rounded-lg" />
                <div className="mt-4 h-4 w-1/3 bg-gray-200 rounded" />
                <div className="mt-2 h-6 w-3/4 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="mx-auto mt-16 text-center">
            <p className="text-red-500">We're experiencing some technical difficulties</p>
            <p className="mt-2 text-gray-600">Please check back later for our latest articles</p>
          </div>
        ) : latestPosts && latestPosts.length > 0 ? (
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {latestPosts.map((post) => (
              <article key={post._id} className="group">
                <Link to={`/blog/${post.slug.current}`} className="block">
                  <div className="aspect-[16/9] w-full overflow-hidden rounded-lg">
                    {post.mainImage ? (
                      <img
                        src={urlFor(post.mainImage).width(800).height(450).url()}
                        alt={post.title}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        onError={(e) => {
                          // Fallback for image loading errors
                          const target = e.target as HTMLImageElement;
                          target.src = "https://crllgygjuqpluvdpwayi.supabase.co/storage/v1/object/public/web-assets/Hero_section_image.png";
                        }}
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-200" />
                    )}
                  </div>
                  <div className="mt-4">
                    <time dateTime={post.publishedAt} className="text-sm text-gray-500">
                      {format(new Date(post.publishedAt || new Date()), 'MMMM d, yyyy')}
                    </time>
                    <h3 className="mt-2 text-lg font-semibold leading-6 text-gray-900 group-hover:text-[#393CA0]">
                      {post.title}
                    </h3>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="mx-auto mt-16 text-center">
            <p className="text-gray-600">No articles available at the moment</p>
          </div>
        )}

        <div className="mt-16 text-center">
          <Link
            to="/blog"
            className="rounded-md border border-[#393CA0] px-6 py-2.5 text-sm font-semibold text-[#393CA0] hover:bg-[#393CA0] hover:text-white transition-colors"
          >
            View All Articles
          </Link>
        </div>
      </div>
    </div>
  );
}
