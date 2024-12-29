import { useNavigate } from "react-router-dom";
import { BlogForm } from "@/components/admin/blog/BlogForm";

export default function CreateBlog() {
  const navigate = useNavigate();
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create New Blog Post</h1>
      </div>
      
      <BlogForm 
        onSuccess={() => navigate("/admin/content")} 
      />
    </div>
  );
}