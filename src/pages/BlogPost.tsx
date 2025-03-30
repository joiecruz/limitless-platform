
import { useParams, useSearchParams } from "react-router-dom";
import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";
import { PortableText } from "@portabletext/react";
import { format } from "date-fns";
import { OpenGraphTags } from "@/components/common/OpenGraphTags";
import { useBlogPost } from "@/hooks/use-blog-posts";
import { urlFor, FALLBACK_IMAGE } from "@/lib/sanity";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle, ExternalLink } from "lucide-react";

export default function BlogPost() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const preview = searchParams.get("preview") === "true";
  const { toast } = useToast();
  const { data: post, isLoading, error, refetch } = useBlogPost(slug || "", preview);

  // Handle retry
  const handleRetry = () => {
    toast({
      title: "Retrying connection",
      description: "Attempting to reconnect to the blog service...",
    });
    refetch();
  };

  // Metadata
  const baseUrl = window.location.origin;
  const canonicalUrl = `${baseUrl}/blog/${post?.slug?.current || slug}`;
  const imageUrl = post?.mainImage ? urlFor(post.mainImage).width(1200).height(630).url() : FALLBACK_IMAGE;

  if (isLoading) {
    return (
      <>
        <MainNav />
        <div className="min-h-screen bg-white pt-16">
          <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24 lg:px-8">
            <div className="animate-pulse">
              <div className="h-8 w-3/4 bg-gray-200 rounded" />
              <div className="mt-4 h-4 w-1/2 bg-gray-200 rounded" />
              <div className="mt-8 h-64 w-full bg-gray-200 rounded-2xl" />
              <div className="mt-8 space-y-4">
                <div className="h-4 w-full bg-gray-200 rounded" />
                <div className="h-4 w-5/6 bg-gray-200 rounded" />
                <div className="h-4 w-4/6 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <MainNav />
        <div className="min-h-screen bg-white pt-16">
          <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24 lg:px-8">
            <div className="flex flex-col items-center text-center">
              <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Blog Post</h1>
              <p className="text-gray-600 mb-8">
                We're having trouble connecting to our content service. Please try again later.
              </p>
              
              {error instanceof Error && (
                <div className="mb-8 bg-red-50 p-4 rounded text-sm text-left w-full max-w-lg overflow-auto max-h-40">
                  <p className="font-semibold">Error details:</p>
                  <p className="text-red-700">{error.message}</p>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleRetry}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.history.back()}
                >
                  Go Back
                </Button>
                <a 
                  href={`https://42h9veeb.api.sanity.io/v2021-10-21/data/query/production?query=*%5B_type+%3D%3D+%22post%22+%26%26+slug.current+%3D%3D+%22${slug}%22%5D`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2 w-full"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Test API Connection
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!post) {
    return (
      <>
        <MainNav />
        <div className="min-h-screen bg-white pt-16">
          <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24 lg:px-8">
            <h1 className="text-2xl font-bold text-gray-900">Post not found</h1>
            <p className="mt-2 text-gray-600">The blog post you're looking for doesn't exist.</p>
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="mt-6"
            >
              Go Back to Blog
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <OpenGraphTags
        title={`${post.title} | Limitless Lab Blog`}
        description={post.excerpt || `${post.title} - Limitless Lab Blog`}
        type="article"
        image={imageUrl}
        url={canonicalUrl}
        publishedTime={post.publishedAt}
        modifiedTime={post._updatedAt}
        author={post.author}
        tags={post.categories}
        section="Blog"
      />

      {preview && (
        <div className="bg-[#393CA0] text-white text-center py-2">
          <p>Preview Mode - <a href={canonicalUrl} className="underline">Exit Preview</a></p>
        </div>
      )}

      <MainNav />

      <div className="min-h-screen bg-white pt-16">
        <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24 lg:px-8">
          <article>
            <header>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {post.title}
              </h1>
              <div className="mt-4 flex items-center gap-x-4 text-xs">
                <time dateTime={post.publishedAt} className="text-gray-500">
                  {post.publishedAt ? format(new Date(post.publishedAt), 'MMM d, yyyy') : 'Publication date unknown'}
                </time>
                {post.categories?.map((category) => (
                  <span
                    key={category}
                    className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </header>

            <div className="relative mt-8 aspect-[16/9] w-full">
              <img
                src={post.mainImage ? urlFor(post.mainImage).width(1200).height(675).url() : FALLBACK_IMAGE}
                alt={post.title}
                className="rounded-2xl object-cover"
                onError={(e) => {
                  console.log('Image failed to load, using fallback');
                  const target = e.target as HTMLImageElement;
                  target.src = FALLBACK_IMAGE;
                }}
              />
            </div>

            <div className="prose prose-lg prose-indigo mt-8 max-w-none">
              <PortableText 
                value={post.body}
                components={{
                  block: {
                    normal: ({children}) => (
                      <p className="mb-4 last:mb-0">
                        {children}
                      </p>
                    ),
                    blockquote: ({children}) => (
                      <blockquote className="border-l-4 border-gray-200 pl-4 mb-4 italic">
                        {children}
                      </blockquote>
                    ),
                    h1: ({children}) => (
                      <h1 className="text-3xl font-bold mb-4">{children}</h1>
                    ),
                    h2: ({children}) => (
                      <h2 className="text-2xl font-bold mb-3">{children}</h2>
                    ),
                    h3: ({children}) => (
                      <h3 className="text-xl font-bold mb-2">{children}</h3>
                    ),
                  },
                  marks: {
                    em: ({children}) => <em className="italic">{children}</em>,
                    strong: ({children}) => <strong className="font-bold">{children}</strong>,
                    link: ({value, children}) => {
                      const target = (value?.href || '').startsWith('http') ? '_blank' : undefined
                      return (
                        <a 
                          href={value?.href}
                          target={target}
                          rel={target === '_blank' ? 'noopener noreferrer' : undefined}
                          className="text-blue-600 hover:underline"
                        >
                          {children}
                        </a>
                      )
                    },
                  },
                }}
              />
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="mt-8">
                <h2 className="text-sm font-medium text-gray-500">Tags</h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-gray-100 px-3 py-0.5 text-sm font-medium text-gray-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>
        </div>

        {post.relatedPosts && post.relatedPosts.length > 0 && (
          <div className="border-t border-gray-100">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="py-24 sm:py-32">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-8">Related Articles</h2>
                <RelatedPosts posts={post.relatedPosts} />
              </div>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </>
  );
}
