
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function BlogNotFound() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold">Post not found</h1>
      <p className="text-gray-600">The blog post you're looking for doesn't exist or has been removed.</p>
      <Button 
        variant="default" 
        onClick={() => navigate('/blog')}
        className="mt-4"
      >
        Back to Blog
      </Button>
    </div>
  );
}
