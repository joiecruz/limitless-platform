import { format } from "date-fns";

interface BlogMetaProps {
  createdAt: string;
  readTime: number;
  categories?: string[] | null;
  author?: string;
}

export function BlogMeta({ createdAt, readTime, categories, author }: BlogMetaProps) {
  return (
    <div className="mb-12 space-y-4">
      <div className="flex items-center gap-4 text-gray-600">
        {author && (
          <>
            <span>{author}</span>
            <span>·</span>
          </>
        )}
        <time dateTime={createdAt}>
          {format(new Date(createdAt), 'MMMM d, yyyy')}
        </time>
        <span>·</span>
        <span>{readTime} min read</span>
      </div>
      
      {categories && categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <span
              key={category}
              className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
            >
              {category}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
