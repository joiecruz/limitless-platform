
import { Link } from "react-router-dom";
import { urlFor } from "@/lib/sanity";
import { BlogPost } from "@/hooks/use-blog-posts";

// Fallback image to use when post.mainImage is null
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=400&h=225";

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
