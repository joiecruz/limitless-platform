import { Link } from 'react-router-dom';
import { useBlogTags } from '@/hooks/use-blog-posts';

export function BlogTags() {
  const { data: tags, isLoading } = useBlogTags();

  if (isLoading || !tags?.length) {
    return null;
  }

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Popular Topics</h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Explore our content by topic
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-2xl">
          <div className="flex flex-wrap justify-center gap-2">
            {tags.map((tag) => (
              <Link
                key={tag._id}
                to={`/blog/tag/${encodeURIComponent(tag.name)}`}
                className="inline-flex items-center rounded-full bg-gray-50 px-4 py-2 text-sm font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 hover:bg-gray-100"
              >
                {tag.name}
                <span className="ml-2 text-gray-400">({tag.count})</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 