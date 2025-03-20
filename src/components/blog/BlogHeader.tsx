
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface BlogHeaderProps {
  title: string;
  coverImage?: string | null;
}

export function BlogHeader({ title, coverImage }: BlogHeaderProps) {
  const navigate = useNavigate();

  return (
    <>
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/blog')}
          className="mb-6 text-gray-600 hover:text-gray-900"
        >
          ← Back to all posts
        </Button>
      </div>
      
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 leading-tight">
        {title}
      </h1>
      
      {coverImage && (
        <div className="aspect-video w-full mb-12 rounded-lg overflow-hidden">
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </>
  );
}
