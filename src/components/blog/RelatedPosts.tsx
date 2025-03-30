import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { urlFor } from '@/lib/sanity';

interface RelatedPost {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  excerpt?: string;
  mainImage?: any;
  publishedAt: string;
}

interface RelatedPostsProps {
  posts: RelatedPost[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (!posts?.length) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {posts.map((post) => (
        <Link
          key={post._id}
          to={`/blog/${post.slug.current}`}
          className="group"
        >
          <div className="bg-white rounded-lg overflow-hidden border hover:shadow-lg transition-shadow h-full flex flex-col">
            <div className="aspect-[16/9] relative">
              {post.mainImage ? (
                <img
                  src={urlFor(post.mainImage).width(600).height(400).url()}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gray-100" />
              )}
            </div>
            <div className="p-6 flex-1">
              <p className="text-sm text-gray-500 mb-2">
                {format(new Date(post.publishedAt), 'MMMM d, yyyy')}
              </p>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-[#393CA0] transition-colors">
                {post.title}
              </h3>
              {post.excerpt && (
                <p className="text-gray-600 text-base line-clamp-2">
                  {post.excerpt}
                </p>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
} 