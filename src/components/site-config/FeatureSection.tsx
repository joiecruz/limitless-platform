import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface FeatureProps {
  badge: string;
  title: string;
  description: string[];
  buttonText: string;
  buttonLink: string;
  imageSrc: string;
  imageAlt: string;
  isReversed?: boolean;
}

export function FeatureSection({ 
  badge, 
  title, 
  description, 
  buttonText, 
  buttonLink, 
  imageSrc, 
  imageAlt,
  isReversed = false 
}: FeatureProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
      {!isReversed && (
        <div className="flex-1 space-y-6">
          <div className={`inline-block px-4 py-1 rounded-full text-sm bg-${badge.toLowerCase()}-50 text-${badge.toLowerCase()}-600`}>
            {badge}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{title}</h2>
          {description.map((paragraph, index) => (
            <p key={index} className="text-base md:text-lg text-gray-600">
              {paragraph}
            </p>
          ))}
          <Button 
            onClick={() => navigate(buttonLink)}
            className="bg-[#393CA0] hover:bg-[#393CA0]/90"
          >
            {buttonText}
          </Button>
        </div>
      )}
      <div className="flex-1">
        <img 
          src={imageSrc}
          alt={imageAlt}
          className="w-full rounded-lg shadow-lg"
        />
      </div>
      {isReversed && (
        <div className="flex-1 space-y-6">
          <div className={`inline-block px-4 py-1 rounded-full text-sm bg-${badge.toLowerCase()}-50 text-${badge.toLowerCase()}-600`}>
            {badge}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{title}</h2>
          {description.map((paragraph, index) => (
            <p key={index} className="text-base md:text-lg text-gray-600">
              {paragraph}
            </p>
          ))}
          <Button 
            onClick={() => navigate(buttonLink)}
            className="bg-[#393CA0] hover:bg-[#393CA0]/90"
          >
            {buttonText}
          </Button>
        </div>
      )}
    </div>
  );
}