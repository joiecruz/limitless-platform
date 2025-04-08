
import { useNavigate } from "react-router-dom";
import { BlogForm } from "@/components/admin/blog/BlogForm";
import { BlogFormHeader } from "@/components/admin/blog/components/BlogFormHeader";

export default function CreateBlog() {
  const navigate = useNavigate();
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <BlogFormHeader title="Create New Blog Post" />
      
      <BlogForm 
        onSuccess={() => navigate("/admin/content")} 
        isEdit={false}
      />
    </div>
  );
}
