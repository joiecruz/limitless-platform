import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { MainNav } from "@/components/site-config/MainNav";
import { CTASection } from "@/components/site-config/CTASection";
import { Footer } from "@/components/site-config/Footer";

export default function ASEANDigitalLiteracy() {
  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      
      {/* Cover Image Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg overflow-hidden mb-8">
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center p-8">
              <h1 className="text-5xl font-bold text-foreground mb-4">
                ASEAN Digital Literacy Programme
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="prose prose-lg max-w-none">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            About the Programme
          </h2>
          <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
            The ASEAN Digital Literacy Programme is dedicated to advancing digital literacy 
            and skills development across the ASEAN region for inclusive growth and sustainable 
            development. We focus on empowering individuals and communities with the digital 
            skills they need to thrive in an increasingly connected world.
          </p>
          <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
            Our comprehensive program covers four key areas: Digital Skills Training for personal 
            and professional development, Online Safety & Security to protect individuals and 
            communities, Digital Tools Mastery through hands-on training, and Community Outreach 
            to bring digital literacy to underserved communities across ASEAN.
          </p>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            With over 100,000 people trained, 500+ communities reached, and 200+ training centers 
            across 10 ASEAN countries, we're making significant strides in bridging the digital 
            divide. Our program serves students, working professionals, and community leaders, 
            ensuring that digital opportunities are accessible to all.
          </p>
          
          <div className="mt-8">
            <Link to="/contact">
              <Button size="lg">
                Get Involved
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