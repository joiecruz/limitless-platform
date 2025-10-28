import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { MainNav } from "@/components/site-config/MainNav";
import { CTASection } from "@/components/site-config/CTASection";
import { Footer } from "@/components/site-config/Footer";

export default function AIReadyASEAN() {
  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      
      {/* Cover Image Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg overflow-hidden mb-8">
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center p-8">
              <h1 className="text-5xl font-bold text-foreground mb-4">
                AI Ready ASEAN
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="prose prose-lg max-w-none">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            About AI Ready ASEAN
          </h2>
          <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
            AI Ready ASEAN is a comprehensive initiative focused on building AI capabilities 
            across ASEAN nations through training, policy development, and regional collaboration. 
            We empower professionals, students, and organizations to harness the transformative 
            potential of artificial intelligence for economic growth and social development.
          </p>
          <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
            Our program encompasses four key pillars: AI Training & Education, Policy Development, 
            Technical Skills Development, and Regional Collaboration. Through these pillars, we 
            provide comprehensive curricula, support governance frameworks, deliver hands-on 
            training in machine learning and data science, and foster knowledge sharing across 
            ASEAN nations.
          </p>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            With over 5,000 professionals trained across 10+ ASEAN countries and partnerships 
            with 50+ organizations, AI Ready ASEAN is creating a foundation for AI-driven 
            innovation and inclusive growth throughout the region. Join us in building the 
            AI capabilities that will shape ASEAN's digital future.
          </p>
          
          <div className="mt-8">
            <Link to="/contact">
              <Button size="lg">
                Join the Initiative
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <CTASection />
      <Footer />
    </div>
  );
}