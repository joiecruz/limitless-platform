import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function BlogContent() {
  const navigate = useNavigate();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Blog post cards would go here */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-2">Sample Blog Post</h3>
          <p className="text-gray-600 mb-4">
            This is a sample blog post description. Real content would be fetched from your backend.
          </p>
          <Button 
            variant="outline" 
            onClick={() => navigate('/blog/sample-post')}
            className="w-full"
          >
            Read More
          </Button>
        </div>
      </div>
    </div>
  );
}