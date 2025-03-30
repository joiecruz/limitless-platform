import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";
import { Link, useSearchParams } from "react-router-dom";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { OpenGraphTags } from "@/components/common/OpenGraphTags";
import { useBlogPosts } from "@/hooks/use-blog-posts";
import { urlFor } from "@/lib/sanity";
import { Button } from "@/components/ui/button";

const POSTS_PER_PAGE = 9;

export default function Blog() {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const { data: allPosts, isLoading, error } = useBlogPosts();

  // Log any errors for debugging
  if (error) {
    console.error("Error in blog listing query:", error);
    toast({
      title: "Error loading blog posts",
      description: "Unable to load blog posts. Please try again later.",
      variant: "destructive",
    });
  }

  // Calculate pagination
  const totalPosts = allPosts?.length || 0;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  const posts = allPosts?.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  // Handle page change
  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString() });
    window.scrollTo(0, 0);
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
                      <div className="aspect-[16/9] w-full overflow-hidden rounded-lg">
                        <img
                          src={urlFor(post.mainImage).width(800).height(450).url()}
                          alt={post.title}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="mt-4">
                        <time dateTime={post.publishedAt} className="text-sm text-gray-500">
                          {format(new Date(post.publishedAt), 'MMMM d, yyyy')}
                        </time>
                        <h3 className="mt-2 text-lg font-semibold leading-6 text-gray-900 group-hover:text-[#393CA0]">
                          {post.title}
                        </h3>
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
            </div>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
}
