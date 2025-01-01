import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface CaseStudyHeaderProps {
  name: string;
  description: string;
}

export function CaseStudyHeader({ name, description }: CaseStudyHeaderProps) {
  return (
    <>
      <Link to="/case-studies">
        <Button variant="ghost" className="mb-8 -ml-4 text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4 mr-2" />
          See all case studies
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        <div className="lg:col-span-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {name}
          </h1>
          
          <p className="text-xl text-gray-600">
            {description}
          </p>
        </div>
      </div>
    </>
  );
}