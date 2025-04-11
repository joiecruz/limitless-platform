
import { useState } from "react";
import { Idea } from "@/types/ideas";
import { IdeaCard } from "./IdeaCard";
import { CreateIdeaCard } from "./CreateIdeaCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GridIcon, ListIcon } from "lucide-react";

interface IdeasBoardProps {
  projectId: string;
  ideas: Idea[];
  onIdeaAdded: () => void;
}

export function IdeasBoard({ projectId, ideas, onIdeaAdded }: IdeasBoardProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Ideas</h2>
        
        <Tabs 
          defaultValue="grid" 
          value={viewMode}
          onValueChange={(value) => setViewMode(value as "grid" | "list")}
          className="w-auto"
        >
          <TabsList className="grid w-[180px] grid-cols-2">
            <TabsTrigger value="grid" className="flex items-center gap-2">
              <GridIcon className="h-4 w-4" />
              <span>Grid</span>
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <ListIcon className="h-4 w-4" />
              <span>List</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className={viewMode === "grid" 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
        : "flex flex-col gap-4"
      }>
        <CreateIdeaCard 
          projectId={projectId} 
          onIdeaCreated={onIdeaAdded} 
          viewMode={viewMode}
        />
        
        {ideas.map((idea) => (
          <IdeaCard 
            key={idea.id} 
            idea={idea} 
            viewMode={viewMode}
          />
        ))}
      </div>
    </div>
  );
}
