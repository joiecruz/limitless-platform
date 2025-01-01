import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BlogFormHeaderProps {
  title: string;
}

export function BlogFormHeader({ title }: BlogFormHeaderProps) {
  const navigate = useNavigate();
  
  return (
    <div className="mb-6 space-y-4">
      <Button 
        variant="ghost" 
        onClick={() => navigate("/admin/content")}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Content
      </Button>
      <h1 className="text-2xl font-bold">{title}</h1>
    </div>
  );
}