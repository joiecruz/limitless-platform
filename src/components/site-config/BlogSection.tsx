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
        <div className="text-sm text-gray-600">
          {format(new Date(post.created_at), 'MMMM d, yyyy')}
        </div>
      </div>
    </div>
  );
}