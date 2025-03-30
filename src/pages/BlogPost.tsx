
import { useParams, useSearchParams } from "react-router-dom";
import { MainNav } from "@/components/site-config/MainNav";
import { Footer } from "@/components/site-config/Footer";
import { PortableText } from "@portabletext/react";
import { format } from "date-fns";
import { OpenGraphTags } from "@/components/common/OpenGraphTags";
import { useBlogPost } from "@/hooks/use-blog-posts";
import { urlFor } from "@/lib/sanity";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { useToast } from "@/hooks/use-toast";

// Fallback image when mainImage is null
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1200&h=630";

export default function BlogPost() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const preview = searchParams.get("preview") === "true";
  const { toast } = useToast();
  const { data: post, isLoading, error } = useBlogPost(slug || "", preview);

  // Log any errors
  if (error) {
    console.error("Error loading blog post:", error);
    toast({
      title: "Error loading blog post",
      description: "Unable to load the blog post. Please try again later.",
      variant: "destructive",
    });
  }

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

  if (!post) {
    return (
      <>
        <MainNav />
        <div className="min-h-screen bg-white pt-16">
          <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24 lg:px-8">
            <h1 className="text-2xl font-bold text-gray-900">Post not found</h1>
            <p className="mt-2 text-gray-600">The blog post you're looking for doesn't exist.</p>
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
                  {format(new Date(post.publishedAt), 'MMM d, yyyy')}
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

            {post.mainImage ? (
              <div className="relative mt-8 aspect-[16/9] w-full">
                <img
                  src={urlFor(post.mainImage).width(1200).height(675).url()}
                  alt={post.title}
                  className="rounded-2xl object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = FALLBACK_IMAGE;
                  }}
                />
              </div>
            ) : (
              <div className="relative mt-8 aspect-[16/9] w-full">
                <img
                  src={FALLBACK_IMAGE}
                  alt={post.title}
                  className="rounded-2xl object-cover"
                />
              </div>
            )}

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
