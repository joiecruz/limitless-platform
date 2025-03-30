
import { Link } from "react-router-dom";
import { urlFor, FALLBACK_IMAGE } from "@/lib/sanity";
import { BlogPost } from "@/hooks/use-blog-posts";

interface RelatedPostsProps {
  posts: BlogPost[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  // If no posts are provided, don't render anything
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <Link 
          key={post._id} 
          to={`/blog/${post.slug.current}`}
          className="group block"
        >
          <div className="overflow-hidden rounded-lg bg-gray-100">
            <img
              src={post.mainImage ? urlFor(post.mainImage).width(400).height(225).url() : FALLBACK_IMAGE}
              alt={post.title}
              className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = FALLBACK_IMAGE;
              }}
            />
          </div>
          <h3 className="mt-3 text-lg font-semibold text-gray-900 group-hover:text-[#393CA0]">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">{post.excerpt}</p>
          )}
        </Link>
      ))}
    </div>
  );
}
