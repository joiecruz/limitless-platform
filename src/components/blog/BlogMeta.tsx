
import { format } from "date-fns";

interface BlogMetaProps {
  createdAt: string;
  readTime: number;
  categories?: string[] | null;
}

export function BlogMeta({ createdAt, readTime, categories }: BlogMetaProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-gray-600">
      <time dateTime={createdAt}>
        {format(new Date(createdAt), 'MMMM d, yyyy')}
      </time>
      <span>·</span>
      <span>{readTime} min read</span>
      {categories && categories.length > 0 && (
        <>
          <span>·</span>
          <div className="flex flex-wrap gap-2">
            {categories.map((category: string) => (
              <span
                key={category}
                className="bg-primary-50 text-primary-700 px-2 py-1 rounded-full text-xs"
              >
                {category}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
