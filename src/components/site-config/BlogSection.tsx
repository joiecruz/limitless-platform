import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  created_at: string;
  slug: string;
  cover_image: string;
}

interface BlogSectionProps {
  post: BlogPost;
}

export function BlogSection({ post }: BlogSectionProps) {
  const navigate = useNavigate();

  const getReadTime = (excerpt: string | null) => {
    if (!excerpt) return '3 min read';
    const wordsPerMinute = 200;
    const words = excerpt.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  return (
    <div 
      key={post.id} 
      className="bg-white rounded-lg overflow-hidden cursor-pointer border border-gray-100 hover:border-[#393CA0]/20 transition-all duration-200 hover:shadow-md"
      onClick={() => navigate(`/blog/${post.slug}`)}
    >
      {post.cover_image && (
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-6 space-y-4">
        <h3 className="text-2xl font-semibold text-gray-900 hover:text-[#393CA0] transition-colors">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-gray-600 line-clamp-2">{post.excerpt}</p>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>{format(new Date(post.created_at), 'MMMM d, yyyy')}</span>
          <span>•</span>
          <span>{getReadTime(post.excerpt)}</span>
        </div>
      </div>
    </div>
  );
}