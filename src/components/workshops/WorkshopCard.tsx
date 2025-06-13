
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Workshop {
  id: string;
  title: string;
  description: string;
  image_url: string;
  format: string;
  locked: boolean;
}

interface WorkshopCardProps {
  workshop: Workshop;
}

const WorkshopCard = ({ workshop }: WorkshopCardProps) => {
  const navigate = useNavigate();

  // Helper function to get badge color based on format
  const getBadgeColor = (format: string) => {
    switch (format.toLowerCase()) {
      case 'in-person':
        return 'bg-green-50 text-green-600';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  const handleLearnMore = () => {
    navigate(`/courses/${workshop.id}`);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-[16/9] relative overflow-hidden">
        <img
          src={workshop.image_url || '/placeholder.svg'}
          alt={workshop.title}
          className="object-cover w-full h-full"
        />
      </div>
      <CardHeader>
        <div className="flex items-center gap-1 mb-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getBadgeColor(workshop.format)}`}>
            {workshop.format}
          </span>
        </div>
        <CardTitle className="leading-[1.2]">{workshop.title}</CardTitle>
        <CardDescription>{workshop.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          className="w-full bg-[#393CA0] hover:bg-[#393CA0]/90"
          onClick={handleLearnMore}
        >
          Learn More
          <ArrowRight className="ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default WorkshopCard;
