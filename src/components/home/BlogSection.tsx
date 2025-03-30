
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { useBlogPosts } from "@/hooks/use-blog-posts";
import { urlFor, FALLBACK_IMAGE } from "@/lib/sanity";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, ExternalLink } from "lucide-react";

export function BlogSection() {
  const { toast } = useToast();
  const { data: posts, isLoading, error, isError, refetch, isSuccess } = useBlogPosts();
  
  // Show latest 3 posts
  const latestPosts = posts?.slice(0, 3) || [];

  const handleRetry = () => {
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
              <AlertCircle className="h-12 w-12 text-orange-500" />
            </div>
            <h3 className="text-lg font-semibold text-orange-600">Connection Issue</h3>
            <p className="mt-2 text-gray-600 mb-6">
              We're having trouble connecting to our content service. You're seeing cached or fallback content.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleRetry} 
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
              <Link 
                to="https://42h9veeb.api.sanity.io/v2021-10-21/data/query/production?query=*%5B_type+%3D%3D+%22post%22%5D"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 w-full"
                >
                  <ExternalLink className="h-4 w-4" />
                  Test Sanity Connection
                </Button>
              </Link>
            </div>
          </div>
        ) : latestPosts && latestPosts.length > 0 ? (
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {latestPosts.map((post) => (
              <article key={post._id} className="group">
                <Link to={`/blog/${post.slug.current}`} className="block">
                  <div className="aspect-[16/9] w-full overflow-hidden rounded-lg bg-gray-100">
                    <img
                      src={post.mainImage 
                        ? urlFor(post.mainImage).width(800).height(450).url() 
                        : FALLBACK_IMAGE}
                      alt={post.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      onError={(e) => {
                        console.log('Image failed to load, using fallback');
                        const target = e.target as HTMLImageElement;
                        target.src = FALLBACK_IMAGE;
                      }}
                    />
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
              Please check back later for new content.
            </p>
            <Button onClick={handleRetry} className="mt-6 flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        )}

        {isSuccess && (
          <div className="mt-4 text-center text-sm text-gray-500">
            {latestPosts.length === 0 ? (
              <p>Using mock content (Sanity connection successful, but no posts found)</p>
            ) : posts?.length === latestPosts.length ? (
              <p>Showing all {posts.length} posts from Sanity</p>
            ) : (
              <p>Showing {latestPosts.length} of {posts?.length} posts from Sanity</p>
            )}
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
