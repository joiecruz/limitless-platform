
import { useNavigate } from "react-router-dom";
import { BlogForm } from "@/components/admin/blog/BlogForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function CreateBlog() {
  const navigate = useNavigate();
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 space-y-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/admin/content")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Content
        </Button>
        <h1 className="text-2xl font-bold">Create New Blog Post</h1>
      </div>
      
      <BlogForm 
        onSuccess={() => navigate("/admin/content")} 
      />
    </div>
  );
}
