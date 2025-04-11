
import { Lightbulb } from "lucide-react";
import { CreateIdeaCard } from "./CreateIdeaCard";

interface IdeasEmptyProps {
  projectId: string;
}

export function IdeasEmpty({ projectId }: IdeasEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="bg-primary/10 p-4 rounded-full mb-4">
        <Lightbulb className="h-10 w-10 text-primary" />
      </div>
      
      <h2 className="text-xl font-semibold mb-2">No ideas yet</h2>
      <p className="text-muted-foreground text-center max-w-md mb-8">
        Be the first to share an idea for this design challenge! 
        Ideas can be as small as a simple suggestion or as detailed as a full concept.
      </p>
      
      <div className="w-full max-w-md">
        <CreateIdeaCard 
          projectId={projectId} 
          onIdeaCreated={() => {}} 
          viewMode="grid"
          focus={true}
        />
      </div>
    </div>
  );
}
