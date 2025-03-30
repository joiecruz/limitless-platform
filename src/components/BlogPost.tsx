import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBlogPostBySlug, urlFor } from '../lib/sanity';
import { PortableText } from '@portabletext/react';

interface BlogPost {
  _id: string;
  title: string;
  mainImage: any;
  body: any[];
  publishedAt: string;
  author: string;
  categories: string[];
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      try {
        const fetchedPost = await getBlogPostBySlug(slug);
        setPost(fetchedPost);
      } catch (error) {
        console.error('Error fetching blog post:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (isLoading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (!post) {
    return <div className="container mx-auto p-4">Post not found</div>;
  }

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <div className="mb-8 text-gray-600">
        By {post.author} · {new Date(post.publishedAt).toLocaleDateString()}
      </div>
      
      {post.mainImage && (
        <div className="mb-8">
          <img
            src={urlFor(post.mainImage).width(1200).height(600).url()}
            alt={post.title}
            className="w-full h-[400px] object-cover rounded-lg"
          />
        </div>
      )}

      <div className="prose prose-lg max-w-none">
        <PortableText value={post.body} />
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {post.categories.map((category) => (
          <span
            key={category}
            className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
          >
            {category}
          </span>
        ))}
      </div>
    </article>
  );
} 