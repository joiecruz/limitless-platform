
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface IdeasHeaderProps {
  project: {
    name?: string;
    title?: string;
    description?: string;
    challenge_statement?: string;
    challenge_description?: string;
  };
}

export function IdeasHeader({ project }: IdeasHeaderProps) {
  // Use the appropriate field based on what's available
  const title = project.title || project.name || project.challenge_statement || "Design Challenge";
  const description = project.description || project.challenge_description || "";
  
  return (
    <div className="mb-8">
      <div className="flex items-center mb-2">
        <Button 
          variant="ghost" 
          size="sm" 
          asChild
          className="gap-1 text-muted-foreground hover:text-foreground"
        >
          <Link to="/projects">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Projects</span>
          </Link>
        </Button>
      </div>
      
      <div className="bg-card rounded-lg p-6 border shadow-sm">
        <h1 className="text-3xl font-bold mb-4">{title}</h1>
        {description && (
          <p className="text-muted-foreground whitespace-pre-line">{description}</p>
        )}
      </div>
    </div>
  );
}
