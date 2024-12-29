import { Button } from "@/components/ui/button";

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
  return (
    <div className="flex items-center gap-16">
      {!isReversed && (
        <div className="flex-1 space-y-6">
          <div className={`inline-block px-4 py-1 rounded-full text-sm bg-${badge}-50 text-${badge}-600`}>
            {badge}
          </div>
          <h2 className="text-4xl font-bold text-gray-900">{title}</h2>
          {description.map((paragraph, index) => (
            <p key={index} className="text-lg text-gray-600">
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
          className="w-full rounded-lg"
        />
      </div>
      {isReversed && (
        <div className="flex-1 space-y-6">
          <div className={`inline-block px-4 py-1 rounded-full text-sm bg-${badge}-50 text-${badge}-600`}>
            {badge}
          </div>
          <h2 className="text-4xl font-bold text-gray-900">{title}</h2>
          {description.map((paragraph, index) => (
            <p key={index} className="text-lg text-gray-600">
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