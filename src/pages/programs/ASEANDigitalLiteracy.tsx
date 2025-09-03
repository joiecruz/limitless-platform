import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Monitor, Shield, Wrench, Heart } from "lucide-react";

export default function ASEANDigitalLiteracy() {
  const components = [
    {
      icon: Monitor,
      title: "Digital Skills Training",
      description: "Essential digital skills for personal and professional development"
    },
    {
      icon: Shield,
      title: "Online Safety & Security",
      description: "Protecting individuals and communities in the digital world"
    },
    {
      icon: Wrench,
      title: "Digital Tools Mastery",
      description: "Hands-on training with productivity and communication tools"
    },
    {
      icon: Heart,
      title: "Community Outreach",
      description: "Bringing digital literacy to underserved communities across ASEAN"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              ASEAN Digital Literacy Programme
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Advancing digital literacy and skills development across the ASEAN region 
              for inclusive growth and sustainable development.
            </p>
            <Link to="/contact">
              <Button size="lg" className="mr-4">
                Get Involved
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Program Components */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Building Digital Capabilities
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {components.map((component, index) => (
              <div key={index} className="bg-card border border-border rounded-lg p-8">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                  <component.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  {component.title}
                </h3>
                <p className="text-muted-foreground">
                  {component.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Groups */}
      <section className="bg-muted py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Who We Serve
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Students & Youth
              </h3>
              <p className="text-muted-foreground">
                Preparing the next generation with essential digital skills for the future economy
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Working Professionals
              </h3>
              <p className="text-muted-foreground">
                Upskilling workforce to adapt to digital transformation across industries
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Community Leaders
              </h3>
              <p className="text-muted-foreground">
                Empowering community leaders to drive local digital inclusion initiatives
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Numbers */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Programme Impact
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">100K+</div>
              <div className="text-lg text-muted-foreground">People Trained</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-lg text-muted-foreground">Communities Reached</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">10</div>
              <div className="text-lg text-muted-foreground">ASEAN Countries</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">200+</div>
              <div className="text-lg text-muted-foreground">Training Centers</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Join the Digital Literacy Movement
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Help us bridge the digital divide and create inclusive opportunities across ASEAN
          </p>
          <Link to="/contact">
            <Button size="lg">
              Partner with Us
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}