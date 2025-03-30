
import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";
import { Link, useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { OpenGraphTags } from "@/components/common/OpenGraphTags";
import { useBlogPosts } from "@/hooks/use-blog-posts";
import { urlFor, FALLBACK_IMAGE } from "@/lib/sanity";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RefreshCw, ExternalLink } from "lucide-react";

const POSTS_PER_PAGE = 9;

export default function Blog() {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const { data: allPosts, isLoading, error, refetch, isSuccess } = useBlogPosts();

  // Calculate pagination
  const totalPosts = allPosts?.length || 0;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  const posts = allPosts?.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  // Handle page change
  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString() });
    window.scrollTo(0, 0);
  };

  // Handle manual retry
  const handleRetry = () => {
    toast({
      title: "Retrying connection",
      description: "Attempting to reconnect to the blog service...",
    });
    refetch();
  };

  // Metadata for the blog listing page
  const baseUrl = window.location.origin;
  const canonicalUrl = `${baseUrl}/blog`;
  const pageTitle = "Blog | Limitless Lab";
  const pageDescription = "Stay updated with our latest insights and news";

  return (
    <>
      <OpenGraphTags
        title={pageTitle}
        description={pageDescription}
        type="website"
        url={canonicalUrl}
      />
      
      <MainNav />
      
      <div className="min-h-screen bg-white pt-16">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Latest Articles</h1>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              Stay updated with our latest insights and news
            </p>
          </div>

          {error && (
            <div className="mt-8">
              <Alert className="bg-red-50 border-red-200">
                <AlertTitle className="text-red-800">Connection Issue</AlertTitle>
                <AlertDescription className="text-red-600">
                  <p className="mb-4">We're having trouble connecting to our content service. You're seeing cached or fallback content.</p>
                  
                  {error instanceof Error && (
                    <div className="mb-4 bg-red-100 p-3 rounded text-sm overflow-auto max-h-36">
                      <p className="font-semibold">Error details:</p>
                      <p>{error.message}</p>
                    </div>
                  )}
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      onClick={handleRetry} 
                      className="bg-red-100 text-red-800 hover:bg-red-200 flex items-center gap-2"
                      variant="outline"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Try Again
                    </Button>
                    <a 
                      href="https://42h9veeb.api.sanity.io/v2021-10-21/data/query/production?query=*%5B_type+%3D%3D+%22post%22%5D"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block"
                    >
                      <Button 
                        variant="outline" 
                        className="w-full flex items-center gap-2 bg-white text-gray-800 border-gray-300"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Test API Connection
                      </Button>
                    </a>
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          )}

          {isLoading ? (
            <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[16/9] w-full bg-gray-200 rounded-lg" />
                  <div className="mt-4 h-4 w-1/3 bg-gray-200 rounded" />
                  <div className="mt-2 h-6 w-3/4 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          ) : posts && posts.length > 0 ? (
            <>
              <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                {posts.map((post) => (
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
                          <p className="mt-2 text-sm text-gray-600 line-clamp-2">{post.excerpt}</p>
                        )}
                      </div>
                    </Link>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-16 flex justify-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2"
                  >
                    Previous
                  </Button>
                  {[...Array(totalPages)].map((_, i) => (
                    <Button
                      key={i + 1}
                      variant={currentPage === i + 1 ? "default" : "outline"}
                      onClick={() => handlePageChange(i + 1)}
                      className="px-4 py-2"
                    >
                      {i + 1}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl text-gray-600">No blog posts found</h3>
              <p className="mt-2 text-gray-500">Check back later for new content</p>
              <Button 
                onClick={handleRetry} 
                className="mt-6 flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh Content
              </Button>
            </div>
          )}

          {isSuccess && (
            <div className="mt-8 text-center text-sm text-gray-500">
              {totalPosts === 0 ? (
                <p>Using mock content (Sanity connection successful, but no posts found)</p>
              ) : (
                <p>Showing {posts?.length || 0} of {totalPosts} posts from Sanity</p>
              )}
            </div>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
}
