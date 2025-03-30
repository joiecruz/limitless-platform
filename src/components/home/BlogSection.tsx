
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { useBlogPosts } from "@/hooks/use-blog-posts";
import { urlFor } from "@/lib/sanity";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

// Fallback image to use when mainImage is null
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&h=450";

export function BlogSection() {
  const { toast } = useToast();
  const { data: posts, isLoading, error, isError, refetch } = useBlogPosts();
  
  // Show a toast notification on error
  useEffect(() => {
    if (isError && error) {
      console.error('Error loading blog posts in BlogSection:', error);
      toast({
        title: "Connection issue with blog service",
        description: "We're experiencing some technical difficulties. Please try again later.",
        variant: "destructive",
      });
    }
  }, [isError, error, toast]);
  
  // Fallback to empty array if there's an error with Sanity
  const latestPosts = posts?.slice(0, 3) || [];

  const handleRetry = () => {
    console.log('Manually retrying blog posts fetch');
    toast({
      title: "Retrying connection",
      description: "Attempting to reconnect to the blog service...",
    });
    refetch();
  };

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
              <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="mx-auto mt-16 max-w-md text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle className="h-12 w-12 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-red-600">Connection Error</h3>
            <p className="mt-2 text-gray-600 mb-6">
              We're having trouble connecting to our content service. This could be due to:
            </p>
            <ul className="text-left text-sm text-gray-600 mb-6 space-y-2">
              <li>• Network connectivity issues</li>
              <li>• Temporary service outage</li>
              <li>• API configuration problems</li>
            </ul>
            <Button 
              onClick={handleRetry} 
              className="mt-4 flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
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
                          console.log('Image failed to load, using fallback');
                          const target = e.target as HTMLImageElement;
                          target.src = FALLBACK_IMAGE;
                        }}
                      />
                    ) : (
                      <img
                        src={FALLBACK_IMAGE}
                        alt={post.title}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="mt-4">
                    <time dateTime={post.publishedAt} className="text-sm text-gray-500">
                      {post.publishedAt ? format(new Date(post.publishedAt), 'MMMM d, yyyy') : 'Date unavailable'}
                    </time>
                    <h3 className="mt-2 text-lg font-semibold leading-6 text-gray-900 group-hover:text-[#393CA0]">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="mt-2 text-sm text-gray-600 line-clamp-3">{post.excerpt}</p>
                    )}
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="mx-auto mt-16 max-w-lg text-center">
            <h3 className="text-lg font-semibold text-gray-800">No articles available</h3>
            <p className="mt-4 text-gray-600">
              Please ensure your Sanity project is properly configured and contains blog posts.
            </p>
            <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-left">
              <p className="font-medium mb-2">Sanity Configuration:</p>
              <p>Project ID: 42h9veeb</p>
              <p>Dataset: production</p>
              <p className="mt-2">Check that:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Posts exist in your Sanity project</li>
                <li>Posts have the '_type' set to "post"</li>
                <li>CORS settings allow access from this domain</li>
              </ul>
            </div>
            <Button onClick={handleRetry} className="mt-6 flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
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
