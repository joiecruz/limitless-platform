import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function LimitlessGov() {
  return (
    <div className="min-h-screen bg-background">
      {/* Cover Image Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg overflow-hidden mb-8">
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center p-8">
              <h1 className="text-5xl font-bold text-foreground mb-4">
                LimitlessGov
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="prose prose-lg max-w-none">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            About LimitlessGov
          </h2>
          <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
            LimitlessGov is our flagship initiative empowering government digital transformation 
            through innovative solutions, capacity building, and sustainable change management. 
            We partner with government entities to modernize their operations, enhance citizen 
            services, and build a more efficient public sector.
          </p>
          <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
            Our comprehensive approach includes digital strategy development, process automation, 
            data analytics implementation, and citizen service enhancement. We work closely with 
            government organizations to ensure sustainable transformation that delivers lasting 
            impact for citizens and communities.
          </p>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Through LimitlessGov, we've helped transform government operations across multiple 
            jurisdictions, improving service delivery, operational efficiency, and citizen 
            satisfaction. Our evidence-based approach ensures that every transformation initiative 
            delivers measurable results and sustainable value.
          </p>
          
          <div className="mt-8">
            <Link to="/contact">
              <Button size="lg">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}