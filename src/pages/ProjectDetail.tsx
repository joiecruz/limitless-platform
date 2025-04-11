
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Star, MessageSquare, Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { IdeaCard } from "@/components/projects/IdeaCard";
import { AddIdeaDialog } from "@/components/projects/AddIdeaDialog";

// Sample idea data - would come from API in real implementation
const sampleIdeas = [
  {
    id: "1",
    title: "Innovation Hubs",
    description: "Establish dedicated innovation labs or hubs within the company",
    stars: 3,
    comments: 1,
    author: {
      name: "Jane Cooper",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
  },
  {
    id: "2",
    title: "Hackathons",
    description: "Organize company-wide hackaton to enable innovatoin",
    stars: 11,
    comments: 1,
    author: {
      name: "John Smith",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
  },
  {
    id: "3",
    title: "Give incentives",
    description: "Provide free gift certificates for those who will start innovation",
    stars: 24,
    comments: 0,
    author: {
      name: "Emma Jones",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
  },
  {
    id: "4",
    title: "Innovation Hubs",
    description: "Establish dedicated innovation labs or hubs within the company",
    stars: 34,
    comments: 3,
    author: {
      name: "Mark Wilson",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
  }
];

const ProjectDetail = () => {
  const { projectId } = useParams();
  const [showAddIdeaDialog, setShowAddIdeaDialog] = useState(false);
  const [ideas] = useState(sampleIdeas);

  // In a real implementation, we would fetch the project details by ID
  // For now, we'll use static data or location state if available
  const projectTitle = "How might we build a culture of innovation inside our company?";
  const projectDescription = "This question challenges us to think about how we can foster an environment where creativity, experimentation, and continuous improvement are ingrained in our company's DNA. Building a culture of innovation involves more than just implementing new processes or technologies; it requires cultivating an open mindset where employees at all levels feel empowered to share ideas, take risks, and collaborate across teams.";
  
  return (
    <div className="container max-w-7xl px-4 py-8 animate-fade-in">
      <div className="space-y-6">
        {/* Header section */}
        <div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="text-sm text-muted-foreground uppercase tracking-wide">COLLECT IDEAS</div>
              <div className="text-sm text-muted-foreground">{ideas.length} ideas</div>
            </div>
            <div className="space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setShowAddIdeaDialog(true)}
                className="flex items-center gap-2"
              >
                <span className="flex items-center">
                  <Plus className="h-5 w-5" />
                  Generate idea
                </span>
              </Button>
              <Button 
                onClick={() => setShowAddIdeaDialog(true)}
                className="bg-[#3a3ca1] hover:bg-[#3a3ca1]/90 text-white flex items-center gap-2"
              >
                <span className="flex items-center">
                  <Plus className="h-5 w-5" />
                  Add idea
                </span>
              </Button>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold mt-6 mb-4">{projectTitle}</h1>
          <p className="text-lg text-gray-600 max-w-5xl">{projectDescription}</p>
        </div>
        
        <Separator className="my-8" />
        
        {/* Ideas grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {ideas.map(idea => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      </div>
      
      <AddIdeaDialog
        open={showAddIdeaDialog}
        onOpenChange={setShowAddIdeaDialog}
        projectTitle={projectTitle}
      />
    </div>
  );
};

export default ProjectDetail;
